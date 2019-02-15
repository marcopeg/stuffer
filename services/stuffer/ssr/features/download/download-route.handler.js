import { createHook } from '@marcopeg/hooks'
import { logVerbose } from 'ssr/services/logger'
import { DOWNLOAD_MIDDLEWARES } from './hooks'

import sourceFileMiddleware from './source-file.middleware'

export const handler = ({ mountPoint, ...settings }) => ({ app }) => {
    // Build an expandable list of middlewares
    const middlewares = [
        sourceFileMiddleware(settings),
    ]
    createHook(DOWNLOAD_MIDDLEWARES, { args: { middlewares } })

    const sortedMiddlewares = middlewares
        .slice(0)
        .sort((a, b) => (a.priority - b.priority))

    sortedMiddlewares.forEach(mid => logVerbose(`[download/middleware] ${mid.priority} - ${mid.name}`))

    app.get(
        `${mountPoint}/:space/:uuid/:name`,
        sortedMiddlewares.map(m => m.handler),
        (req, res) => res.send({
            data: req.data,
            params: req.params,
            query: req.query,
            keys: Object.keys(req),
        })
    )
}
