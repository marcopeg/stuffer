import { createHook } from '@marcopeg/hooks'
import { DOWNLOAD_SOURCE_FILE } from './hooks'

export default options => ({
    name: 'source-file',
    priority: 100,
    handler: async (req, res, next) => {
        const file = {
            space: req.params.space,
            uuid: req.params.uuid,
            name: req.params.name,
            exists: null,
            filePath: null,
            metaPath: null,
            meta: null,
            errors: [],
        }

        await createHook(DOWNLOAD_SOURCE_FILE, {
            async: 'serie',
            args: {
                file,
            },
        })

        // if (!file.exists) {
        //     res.status(404).send('file not found')
        //     return
        // }

        req.data.download = file
        next()
    },
})

