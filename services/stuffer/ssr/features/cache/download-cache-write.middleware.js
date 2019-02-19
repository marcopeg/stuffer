import fs from 'fs-extra'
import { setCache } from './lru'

export default (settings) => ({
    name: 'download-cache-write',
    priority: 650,
    handler: async (req, res, next) => {
        if (!req.data.buffer) {
            next()
            return
        }

        fs.writeFile(req.data.cache.path, req.data.buffer, (err) => {
            if (err) {
                throw new Error('could not write cache')
            }

            setCache(req.data.cache.path, req.data.buffer.byteLength)
            console.log('cache written', req.data.buffer.byteLength)
            next()
        })
    },
})
