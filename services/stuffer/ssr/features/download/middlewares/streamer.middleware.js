/**
 * Just send a file/buffer out.
 *
 * req.data.buffer -> send generated buffer
 * req.data.download.filePath -> send out the actual file
 */

import { logVerbose } from 'ssr/services/logger'

export default (settings) => ({
    name: 'streamer',
    priority: 9999,
    handler: async (req, res) => {
        const file = req.data.download

        if (req.data.buffer) {
            logVerbose(`>> BUFFER >> ${file.space}/${file.uuid}/${file.name}`)
            res.set('Content-Type', `${file.meta.type}; charset=utf-8`)
            res.set('Content-Disposition', `inline; filename="${file.name}"`)
            res.send(req.data.buffer)
            return
        }

        if (file.filePath) {
            logVerbose(`>> FILE >> ${file.space}/${file.uuid}/${file.name} - ${file.filePath}`)
            res.sendFile(file.filePath)
            return
        }
    },
})

