import path from 'path'
import fs from 'fs-extra'
import { hashFileName } from 'lib/hash-file-name'
import { getCache } from './lru-cache'

export default (settings) => ({
    name: 'download-cache-check',
    priority: 350,
    handler: async (req, res, next) => {
        // skip cache check in case no modifier was applied
        if (!req.data.modifiers.requested.length) {
            next()
            return
        }

        const cacheName = req.data.modifiers.requested
            .map(i => `${i.name}=${i.rawValue}`)
            .join('&')

        const fullCacheName = hashFileName([
            req.data.download.space,
            req.data.download.uuid,
            req.data.download.fileName,
            cacheName,
        ].join('___'))

        // provide cache name informations for writing it later in the request
        req.data.cache = {
            name: fullCacheName,
            path: path.join(settings.base, fullCacheName),
        }

        // checks the in-memory cache informations.
        // if there is no cache info, we are going to skip the attempt to stream
        const cache = getCache(req.data.cache.name)
        if (!cache) {
            next()
            return
        }

        // tries to stream out the cached file, if anything goes wrong the
        // normal download request goes straight to the end
        try {
            const file = req.data.download
            res.set('Content-Type', `${file.meta.type}; charset=utf-8`)
            res.set('Content-Disposition', `inline; filename="${file.name}"`)

            res.sendFile(req.data.cache.path, null, (err) => {
                if (!err) return
                res.set('Content-Type', 'text/plain')
                res.status(404)
                res.send('not found')
            })
        } catch (err) {
            next()
        }
    },
})
