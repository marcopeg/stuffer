/**
 * Here the big question is whether to accept the buffer solution or
 * to try to force ourselves into a stream solution.
 *
 * I believe streams would work better.
 * But let's see what happens
 */

import fs from 'fs-extra'

export default (modifiers) => ({
    name: 'apply-modifiers',
    priority: 600,
    handler: async (req, res, next) => {
        // Skip in case no modifier was applied
        if (!req.data.modifiers.validated.length) {
            next()
            return
        }

        // create a buffer and process it through all the listed modifiers
        try {
            req.data.buffer = await fs.readFile(req.data.download.filePath)
        } catch (err) {
            res.status(404).send('file not found')
            return
        }

        // run through all the modifiers
        for (const modifier of req.data.modifiers.validated) {
            const handler = modifiers[modifier.name].handler
            const options = req.data.modifiers.settings[modifier.name]
            req.data.buffer = await handler(req.data.buffer, modifier.value, options, req, res)
        }

        next()
    },
})

