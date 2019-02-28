/**
 * Just prepare the data space for the download
 */

import { createHook } from '@marcopeg/hooks'
import { DOWNLOAD_CONTEXT } from '../hooks'

export default options => ({
    name: 'context',
    priority: 100,
    handler: async (req, res, next) => {
        const file = {
            space: req.params.space,
            uuid: req.params.uuid,
            fileName: req.params.fileName,
            exists: null,
            meta: null,
            metaPath: null,
            filePath: null,
            errors: [],
        }

        await createHook(DOWNLOAD_CONTEXT, {
            async: 'serie',
            args: {
                file,
            },
        })

        req.data.download = file
        next()
    },
})

