import { resolveFile } from 'features/store'

export default () => ({
    name: 'validate-file',
    priority: 500,
    handler: async (req, res, next) => {
        try {
            const { space, uuid, fileName } = req.data.download
            req.data.download.filePath = await resolveFile(space, uuid, fileName)
            next()
        } catch (err) {
            res.status(404).send(`file not found: ${err.message}`)
        }
    },
})

