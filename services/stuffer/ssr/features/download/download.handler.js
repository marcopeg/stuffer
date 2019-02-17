// import { createHook } from '@marcopeg/hooks'
import { logVerbose } from 'ssr/services/logger'
// import { DOWNLOAD_MIDDLEWARES } from './hooks'

import contextMiddleware from './middlewares/context.middleware'
import validateMetaMiddleware from './middlewares/validate-meta.middleware'
import validateModifiersMiddleware from './middlewares/validate-modifiers.middleware'
import validateFileMiddleware from './middlewares/validate-file.middleware'
import streamerMiddleware from './middlewares/streamer.middleware'

export const handler = ({ mountPoint, ...settings }) => ({ app }) => {
    // Build a list of available modifiers
    const modifiers = {
        size: {
            parse: v => v,
            validate: () => true,
        },
        color: {
            parse: v => JSON.parse(v),
            validate: () => true,
        },
        foo: {
            parse: v => Number(v),
            validate: v => v > 20,
        },
    }

    // Build an expandable list of middlewares
    const middlewares = [
        // token middleware
        contextMiddleware(settings),
        validateMetaMiddleware(settings),
        validateModifiersMiddleware(settings, modifiers),
        validateFileMiddleware(settings),
        streamerMiddleware(settings),
    ]

    // createHook(DOWNLOAD_MIDDLEWARES, { args: { middlewares } })

    const sortedMiddlewares = middlewares
        .slice(0)
        .sort((a, b) => (a.priority - b.priority))

    sortedMiddlewares.forEach(mid => logVerbose(`[download/middleware] ${mid.priority} - ${mid.name}`))

    const mountPoints = [
        `${mountPoint}/:space/:uuid/*/:name`,
        `${mountPoint}/:space/:uuid/:name`,
    ]

    app.get(mountPoints, sortedMiddlewares.map(m => m.handler))
}
