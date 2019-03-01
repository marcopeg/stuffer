/**
 * Just send a file/buffer out.
 *
 * req.data.buffer -> send generated buffer
 * req.data.download.filePath -> send out the actual file
 */

import urlencode from 'urlencode'
import { logVerbose } from 'services/logger'

export default () => ({
    name: 'streamer',
    priority: 9999,
    handler: async (req, res) => {
        const file = req.data.download

        res.set('Content-Type', `${file.meta.type}; charset=utf-8`)
        res.set('Content-Disposition', `inline; filename="${urlencode(file.fileName)}"`)

        if (req.data.buffer) {
            logVerbose(`>> BUFFER >> ${file.space}/${file.uuid}/${file.fileName}`)
            res.send(req.data.buffer)
            return
        }

        if (file.filePath) {
            logVerbose(`>> FILE >> ${file.space}/${file.uuid}/${file.fileName} - ${file.filePath}`)
            res.sendFile(file.filePath, null, (err) => {
                if (!err) return
                res.set('Content-Type', 'text/plain')
                res.status(404)
                res.send('not found')
            })
            return
        }

        // any other case
        res.set('Content-Type', 'text/plain')
        res.status(404)
        res.send('not found')
    },
})

