import path from 'path'
import fs from 'fs-extra'

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

        const hashedCacheName = process.env.NODE_ENV === 'development'
            ? cacheName
            : (new Buffer(cacheName)).toString('base64')

        const fullCacheName = [
            req.data.download.space,
            req.data.download.uuid,
            hashedCacheName,
        ].join('___')

        // provide cache name informations for writing it later in the request
        req.data.cache = {
            name: fullCacheName,
            path: path.join(settings.base, fullCacheName),
        }

        // tries to stream out the cached file, if anything goes wrong the
        // normal download request goes straight to the end
        try {
            const stream = fs.createReadStream(req.data.cache.path)
            stream.on('error', () => next())

            const file = req.data.download
            res.set('Content-Type', `${file.meta.type}; charset=utf-8`)
            res.set('Content-Disposition', `inline; filename="${file.name}"`)
            stream.pipe(res)
        } catch (err) {
            next()
        }
    },
})
