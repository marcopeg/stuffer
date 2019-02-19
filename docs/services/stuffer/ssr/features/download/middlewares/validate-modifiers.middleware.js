/**
 * Searches for modifiers in the querystring and applies parsing and
 * validation rules based on the current download context.
 *
 * Query string modifiers:
 * ?foo=123&faa=hey&withJson=%7B%22a%22%3A123%2C%22b%22%3A%22foo%22%7D
 *
 * Encode json as:
 * encodeURIComponent(JSON.stringify({ data: "foo", hey: 123 }))
 *
 * Params modifiers:
 * /:space/:uuid/mod1:val/mod2:val/.../file.txt
 */

const getQueryModifiers = req =>
    Object.keys(req.query).map(name => ({
        name,
        rawValue: req.query[name],
    }))

const getParamsModifiers = (req) => {
    if (!req.params[0]) {
        return []
    }
    return req.params[0]
        .split('/')
        .map(m => {
            const tokens = m.split(':')
            return {
                name: tokens[0],
                rawValue: tokens[1],
            }
        })
}

export default (settings, modifiers) => ({
    name: 'validate-modifiers',
    priority: 300,
    handler: async (req, res, next) => {
        try {
            const items = [
                ...getQueryModifiers(req),
                ...getParamsModifiers(req),
            ]

            req.data.modifiers = {}

            req.data.download.modifiers = items
                .map(({ name, rawValue }) => {
                    const modifier = modifiers[name]
                    if (!modifier) {
                        throw new Error(`unknown download modifier - ${name}`)
                    }

                    // merge the modifier's settings with global / token / file
                    req.data.modifiers[name] = {
                        ...(settings.modifiers[name] || {}),
                        // @TODO: add token based modifiers settings
                        ...(req.data.download.meta.data[name] || {}),
                    }

                    let value
                    try {
                        value = modifier.parse(rawValue, req.data.modifiers[name], req, res)
                    } catch (err) {
                        throw new Error(`failed to parse modifier - ${name}`)
                    }

                    if (!modifier.validate(value, req.data.modifiers[name], req, res)) {
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

