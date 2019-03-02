/**
 * Tries to load meta data for a specific file.
 * @TODO: keep an in-memory database of the meta data for faster access.
 */

import fs from 'fs-extra'
import { resolveMeta } from 'features/store'

export default () => ({
    name: 'validate-meta',
    priority: 200,
    handler: async (req, res, next) => {
        try {
            const { space, uuid } = req.data.download
            req.data.download.metaPath = await resolveMeta(space, uuid)
            req.data.download.meta = await fs.readJson(req.data.download.metaPath)
        } catch (err) {
            res.status(404).send(`file not found: ${err.message}`)
        }

        next()
    },
})

