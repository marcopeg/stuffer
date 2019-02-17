import { INIT_FEATURE } from '@marcopeg/hooks'
import { UPLOAD_COMPLETED } from 'ssr/features/upload/hooks'
import { DOWNLOAD_VALIDATE_META, DOWNLOAD_VALIDATE_FILE } from 'ssr/features/download/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as initStoreHandler } from './init-store.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'
import { handler as downloadValidateMetaHandler } from './download-validate-meta.handler'
import { handler as downloadValidateFileHandler } from './download-validate-file.handler'

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
        hook: DOWNLOAD_VALIDATE_META,
        name: FEATURE_NAME,
        trace: __filename,
        handler: downloadValidateMetaHandler(settings.store),
    })

    registerAction({
        hook: DOWNLOAD_VALIDATE_FILE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: downloadValidateFileHandler(settings.store),
    })
}
