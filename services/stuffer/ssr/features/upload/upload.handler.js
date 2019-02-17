import { createHook } from '@marcopeg/hooks'
import { logVerbose } from 'ssr/services/logger'
import { UPLOAD_CONFIG, UPLOAD_MIDDLEWARES } from './hooks'
import { uploadRoute } from './upload.route'

import uploadContext from './middlewares/upload.context.middleware'
import uploadSizeLimit from './middlewares/upload.size-limit.middleware'
import uploadTempFolder from './middlewares/upload.temp-folder.middleware'
import uploadStream from './middlewares/upload.stream.middleware'
import uploadCustomUUID from './middlewares/upload.custom-uuid.middleware'
import uploadMeta from './middlewares/upload.meta.middleware'
import uploadCleanup from './middlewares/upload.cleanup.middleware'

export const handler = ({ app }) => {
    // Let options be driven by extensions
    const options = {}
    createHook(UPLOAD_CONFIG, { args: { options } })

    // @TODO: validate options
    // it should fail hard in case some mandatory options are not provided

    // Build an expandable list of middlewares
    const middlewares = [
        uploadContext(options),
        uploadSizeLimit(options),
        uploadTempFolder(options),
        uploadStream(options),
        uploadCustomUUID(options),
        uploadMeta(options),
        uploadCleanup(options),
    ]
    createHook(UPLOAD_MIDDLEWARES, { args: { middlewares } })

    const sortedMiddlewares = middlewares
        .slice(0)
        .sort((a, b) => (a.priority - b.priority))

    sortedMiddlewares.forEach(mid => logVerbose(`[upload/middleware] ${mid.priority} - ${mid.name}`))

    // apply sorted middlewares
    app.post(
        options.mountPoint,
        sortedMiddlewares.map(m => m.handler),
        uploadRoute(options)
    )
}
