import fs from 'fs-extra'
import path from 'path'

export default (options, modifiers) => ({
    name: 'apply-modifiers',
    priority: 500,
    handler: async (req, res, next) => {
        // create a buffer and process it through all the listed modifiers
        let buff = await fs.readFile(req.data.download.filePath)
        for (const modifier of req.data.download.modifiers) {
            const handler = modifiers[modifier.name].handler
            buff = await handler(buff, modifier.value, req.data.download)
        }

        // writes out the buffer to the cache file and sets it as origin
        // for the streamer
        const fout = path.join(path.dirname(req.data.download.filePath), `mod_${req.data.download.name}`)
        await fs.writeFile(fout, buff)
        req.data.download.filePath = fout

        next()
    },
})

