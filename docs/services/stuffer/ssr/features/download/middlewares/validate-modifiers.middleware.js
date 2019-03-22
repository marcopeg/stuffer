/**
 * Parses and validates the requested modifiers
 */

export default (modifiers) => ({
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

                    let localSettings = {}
                    try {
                        localSettings = req.data.modifiers.settings[name]
                    } catch (err) {
                        throw new Error(`failed to retrieve modifier settings: ${name} - ${err.message}`)
                    }

                    let value
                    try {
                        value = modifier.parse(rawValue, localSettings, req, res)
                    } catch (err) {
                        throw new Error(`failed to parse modifier: ${name} - ${err.message}`)
                    }

                    if (!modifier.validate(value, localSettings, req, res)) {
                        throw new Error(`failed to validate: ${name} - ${err.message}`)
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

