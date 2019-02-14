import { EXPRESS_ROUTE } from 'ssr/services/express/hooks'
import { FEATURE_NAME } from './hooks'
import { handler } from './upload.handler'

export const register = ({ registerAction }) => {
    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler,
    })
}
