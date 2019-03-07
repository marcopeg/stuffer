import { UPLOAD_COMPLETED } from 'features/upload/hooks'
import { EXPRESS_ROUTE } from 'services/express/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as downloadHandler } from './download.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'

export const register = ({ settings, registerAction }) => {
    registerAction({
        hook: UPLOAD_COMPLETED,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadCompletedHandler(settings),
    })

    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: downloadHandler(settings),
    })
}
