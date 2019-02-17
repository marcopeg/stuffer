import fs from 'fs-extra'
import path from 'path'

export default (options, modifiers) => ({
    name: 'apply-modifiers',
    priority: 500,
    handler: async (req, res, next) => {
        // console.log(options)
        // console.log(modifiers)
        // console.log(req.data.download.modifiers)
        const fin = req.data.download.filePath
        const fout = path.join(path.dirname(fin), `mod_${req.data.download.name}`)
        // console.log(fin, fout)

        // create a buffer and process it through all the listed modifiers
        let buff = await fs.readFile(fin)
        for (const modifier of req.data.download.modifiers) {
            buff = await modifiers[modifier.name].handler(buff)
        }

        await fs.writeFile(fout, buff)

        req.data.download.filePath = fout
        next()
    },
})

