import { INIT_FEATURE, START_FEATURE } from '@marcopeg/hooks'
import { UPLOAD_MIDDLEWARES, UPLOAD_COMPLETED } from 'features/upload/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as initHandler } from './init.handler'
import { handler as startHandler } from './start.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'
import pploadVariantsMid from './upload.variants.middleware'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initHandler,
    })
    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: startHandler,
    })
    registerAction({
        hook: UPLOAD_MIDDLEWARES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ addUploadMiddleware }) => {
            const mid = pploadVariantsMid(settings)
            addUploadMiddleware(mid)
        },
    })
    registerAction({
        hook: UPLOAD_COMPLETED,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadCompletedHandler(settings),
    })
}
