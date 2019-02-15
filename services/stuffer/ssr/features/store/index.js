import { INIT_FEATURE } from '@marcopeg/hooks'
import { UPLOAD_COMPLETED } from 'ssr/features/upload/hooks'
import { FEATURE_NAME } from './hooks'
import { init as initSettings } from './settings'

import { handler as initStoreHandler } from './init-store.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'

export const register = ({ settings, registerAction }) => {
    initSettings(settings.store)

    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initStoreHandler,
    })

    registerAction({
        hook: UPLOAD_COMPLETED,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadCompletedHandler,
    })
}
