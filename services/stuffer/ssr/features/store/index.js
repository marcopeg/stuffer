import { INIT_FEATURE } from '@marcopeg/hooks'
import { UPLOAD_COMPLETED } from 'ssr/features/upload/hooks'
import { DOWNLOAD_SOURCE_FILE } from 'ssr/features/download/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as initStoreHandler } from './init-store.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'
import { handler as sourceFileHandler } from './source-file.handler'

export const register = ({ settings, registerAction }) => {
    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initStoreHandler(settings.store),
    })

    registerAction({
        hook: UPLOAD_COMPLETED,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadCompletedHandler(settings.store),
    })

    registerAction({
        hook: DOWNLOAD_SOURCE_FILE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: sourceFileHandler(settings.store),
    })
}
