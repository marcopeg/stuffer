import { INIT_FEATURE, START_FEATURE } from '@marcopeg/hooks'
import { UPLOAD_COMPLETED } from 'features/upload/hooks'
import { FEATURE_NAME } from './hooks'

import { initFeatureHandler } from './init-feature.handler'
import { startFeatureHandler } from './start-feature.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'

export { resolveMeta, resolveFile } from './resolvers'
export { computeMeta, computeFile } from './resolvers'

export { lock, free, isFree } from './lockr'

export const register = ({ settings, registerAction }) => {
    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initFeatureHandler,
    })

    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: startFeatureHandler,
    })

    registerAction({
        hook: UPLOAD_COMPLETED,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadCompletedHandler(settings.store),
    })
}
