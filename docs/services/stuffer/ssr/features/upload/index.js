import { INIT_FEATURE } from '@marcopeg/hooks'
import { EXPRESS_ROUTE } from 'ssr/services/express/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as initHandler } from './init.handler'
import { handler as uploadHandler } from './upload.handler'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initHandler,
    })
    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadHandler(settings.upload),
    })
}
