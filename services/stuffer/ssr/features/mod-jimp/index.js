
import { DOWNLOAD_MODIFIERS } from 'ssr/features/download/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as downloadHandler } from './download.handler'

export const register = ({ settings, registerAction }) => {
    registerAction({
        hook: DOWNLOAD_MODIFIERS,
        name: FEATURE_NAME,
        trace: __filename,
        handler: downloadHandler(settings.jimp),
    })
}
