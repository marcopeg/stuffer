import { INIT_FEATURE, START_FEATURE } from '@marcopeg/hooks'
import { FEATURE_NAME } from './hooks'

// import * as lru from './lru-cache'
// import downloadCacheCheckMiddleware from './download-cache-check.middleware'
// import downloadCacheWriteMiddleware from './download-cache-write.middleware'
import initHandler from './init/init.handler'
import { start as startUploadPool } from './upload/pool'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: () => initHandler(settings),
    })

    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: startUploadPool,
    })

    // registerAction({
    //     hook: DOWNLOAD_MIDDLEWARES,
    //     name: FEATURE_NAME,
    //     trace: __filename,
    //     handler: async ({ addDownloadMiddleware }) => {
    //         addDownloadMiddleware(downloadCacheCheckMiddleware(settings.cache))
    //         addDownloadMiddleware(downloadCacheWriteMiddleware(settings.cache))
    //     },
    // })
}
