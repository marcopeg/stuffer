/**
 * Here the big question is whether to accept the buffer solution or
 * to try to force ourselves into a stream solution.
 *
 * I believe streams would work better.
 * But let's see what happens
 */

import fs from 'fs-extra'

export default (options, modifiers) => ({
    name: 'apply-modifiers',
    priority: 500,
    handler: async (req, res, next) => {
        // Skip in case no modifier was applied
        if (!req.data.download.modifiers.length) {
            next()
            return
        }

        // create a buffer and process it through all the listed modifiers
        req.data.buffer = await fs.readFile(req.data.download.filePath)
        for (const modifier of req.data.download.modifiers) {
            const handler = modifiers[modifier.name].handler
            req.data.buffer = await handler(req.data.buffer, modifier.value, req.data.download)
        }

        next()
    },
})

