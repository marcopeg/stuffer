/**
 * Parses and validates the requested modifiers
 */

export default (settings, modifiers) => ({
    name: 'validate-modifiers',
    priority: 400,
    handler: async (req, res, next) => {
        try {
            req.data.modifiers.validated = req.data.modifiers.requested
                .map(({ name, rawValue }) => {
                    const modifier = modifiers[name]
                    if (!modifier) {
                        throw new Error(`unknown download modifier - ${name}`)
                    }

                    // merge the modifier's settings with global / token / file
                    req.data.modifiers.settings[name] = {
                        ...(settings.modifiers[name] || {}),
                        // @TODO: add space/auth based modifiers settings
                        ...(req.data.download.meta.data[name] || {}),
                    }

                    let value
                    try {
                        value = modifier.parse(rawValue, req.data.modifiers.settings[name], req, res)
                    } catch (err) {
                        throw new Error(`failed to parse modifier - ${name}`)
                    }

                    if (!modifier.validate(value, req.data.modifiers.settings[name], req, res)) {
                        throw new Error(`failed to validate - ${name}`)
                    }

                    return {
                        name,
                        value,
                    }
                })
            next()
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                next(err)
            } else {
                res.status(405).send('unacceptable modifiers')
            }
        }
    },
})

