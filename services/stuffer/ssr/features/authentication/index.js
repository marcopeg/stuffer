import { INIT_FEATURE } from '@marcopeg/hooks'
import { UPLOAD_MIDDLEWARES } from 'ssr/features/upload/hooks'
import { DOWNLOAD_MIDDLEWARES } from 'ssr/features/download/hooks'
import { FEATURE_NAME } from './hooks'

import uploadValidateTokenHandler from './upload.validate-token.handler'
import downloadValidateTokenHandler from './download.validate-token.handler'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: () => {
            console.log('config AUTH')
        },
    })

    registerAction({
        hook: UPLOAD_MIDDLEWARES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadValidateTokenHandler(settings),
    })

    registerAction({
        hook: DOWNLOAD_MIDDLEWARES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: downloadValidateTokenHandler(settings),
    })
}
