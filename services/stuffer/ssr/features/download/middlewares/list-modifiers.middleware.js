/**
 * Searches for modifiers in the querystring and applies parsing and
 * validation rules based on the current download context.
 *
 * Query string modifiers:
 * ?foo=123&faa=hey&withJson=%7B%22a%22%3A123%2C%22b%22%3A%22foo%22%7D
 *
 * NOTE: any query parameter that starts with "_" will be ignored
 *       (this is used for GET authentication, by instance)
 *
 * Encode json as:
 * encodeURIComponent(JSON.stringify({ data: "foo", hey: 123 }))
 *
 * Params modifiers:
 * /:space/:uuid/mod1:val/mod2:val/.../file.txt
 */

import extend from 'extend'

const getQueryModifiers = req =>
    Object.keys(req.query)
        .filter(name => name.substring(0, 1) !== '_')
        .map(name => ({
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

export default (settings) => ({
    name: 'list-modifiers',
    priority: 300,
    handler: async (req, res, next) => {
        try {
            const items = [
                ...getQueryModifiers(req),
                ...getParamsModifiers(req),
            ]

            let globalSettings = {}
            let spaceSettings = {}
            let resourceSettings = {}
            try {
                globalSettings = settings.stuffrc.modifiers
            } catch (err) {}
            try {
                spaceSettings = settings.stuffrc.spaces[req.data.download.space].modifiers
            } catch (err) {}
            try {
                resourceSettings = req.data.download.meta.data.modifiers
            } catch (err) {}

            req.data.modifiers = {
                requested: items,
                validated: [],
                settings: extend(true, {}, globalSettings, spaceSettings, resourceSettings),
            }

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

