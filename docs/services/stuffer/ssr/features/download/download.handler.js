import { createHook } from '@marcopeg/hooks'
import { logVerbose } from 'services/logger'
import { DOWNLOAD_MIDDLEWARES, DOWNLOAD_MODIFIERS } from './hooks'

import contextMiddleware from './middlewares/context.middleware'
import validateMetaMiddleware from './middlewares/validate-meta.middleware'
import listModifiersMiddleware from './middlewares/list-modifiers.middleware'
import validateModifiersMiddleware from './middlewares/validate-modifiers.middleware'
import validateFileMiddleware from './middlewares/validate-file.middleware'
import applyModifiersMiddleware from './middlewares/apply-modifiers.middleware'
import streamerMiddleware from './middlewares/streamer.middleware'

export const handler = settings => ({ app }) => {
    // Build a list of available modifiers
    const modifiers = {}
    createHook(DOWNLOAD_MODIFIERS, { args: { modifiers } })

    console.log('!!!!!', modifiers)

    // Build an expandable list of middlewares
    const middlewares = [
        // token middleware
        contextMiddleware(),
        validateMetaMiddleware(),
        listModifiersMiddleware(settings),
        validateModifiersMiddleware(modifiers),
        validateFileMiddleware(),
        applyModifiersMiddleware(modifiers),
        streamerMiddleware(),
    ]

    createHook(DOWNLOAD_MIDDLEWARES, { args: {
        addDownloadMiddleware: mid => middlewares.push(mid),
    } })

    const sortedMiddlewares = middlewares
        .slice(0)
        .sort((a, b) => (a.priority - b.priority))

    sortedMiddlewares.forEach(mid => logVerbose(`[download/middleware] ${mid.priority} - ${mid.name}`))

    const mountPoint = settings.download.mountPoint
    const mountPoints = [
        `${mountPoint === '/' ? '' : mountPoint}/:space/:uuid/*/:fileName`,
        `${mountPoint === '/' ? '' : mountPoint}/:space/:uuid/:fileName`,
    ]

    app.get(mountPoints, sortedMiddlewares.map(m => m.handler))
}
