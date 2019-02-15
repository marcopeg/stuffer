import { UPLOAD_COMPLETED } from 'ssr/features/upload/hooks'
import { EXPRESS_ROUTE } from 'ssr/services/express/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as downloadRouteHandler } from './download-route.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'

export const register = ({ settings, registerAction }) => {
    registerAction({
        hook: UPLOAD_COMPLETED,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadCompletedHandler(settings.download),
    })

    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: downloadRouteHandler(settings.download),
    })
}
