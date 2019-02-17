/**
 * Just send a file out.
 * Any previous steps should have contributed in creating a "filePath"
 * that points to the thing that should actually handle the stream out.
 */

import fs from 'fs-extra'

export default (settings) => ({
    name: 'streamer',
    priority: 9999,
    handler: async (req, res) => {
        await fs.ensureDir(settings.cacheBase)
        await fs.copy(req.data.download.filePath, req.data.cachePath)
        res.sendFile(req.data.download.filePath)
    },
})

