/**
 * Composes a cache file name and tries to send it out.
 * If it fails the request proceeds to the normal file manipulation.
 */

import path from 'path'

export default (settings, modifiers) => ({
    name: 'cache-read',
    priority: 350,
    handler: async (req, res, next) => {
        req.data.cacheName = [
            req.data.download.space,
            req.data.download.uuid,
            ...(req.data.download.modifiers.map(({ name, value }) =>
                modifiers[name].cacheName(value)
            )),
        ].join('__')

        // req.data.cachePath = path.join(settings.cacheBase, req.data.cacheName)

        // res.sendFile(req.data.cachePath, {}, (err) => {
        //     if (err) {
        //         next()
        //     }
        // })

        next()
    },
})

