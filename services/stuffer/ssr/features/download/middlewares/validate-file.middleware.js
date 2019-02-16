import { createHook } from '@marcopeg/hooks'
import { DOWNLOAD_VALIDATE_FILE } from '../hooks'

export default options => ({
    name: 'validate-file',
    priority: 400,
    handler: async (req, res, next) => {
        await createHook(DOWNLOAD_VALIDATE_FILE, {
            async: 'serie',
            args: {
                file: req.data.download,
            },
        })

        if (req.data.download.exists === false) {
            res.status(404).send('file not found')
            return
        }

        next()
    },
})
