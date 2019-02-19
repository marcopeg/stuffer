import fs from 'fs-extra'
import { START_FEATURE } from '@marcopeg/hooks'
import { DOWNLOAD_MIDDLEWARES } from 'ssr/features/download/hooks'
import { FEATURE_NAME } from './hooks'
import downloadCacheCheckMiddleware from './download-cache-check.middleware'
import downloadCacheWriteMiddleware from './download-cache-write.middleware'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: () => fs.ensureDir(settings.cache.base),
    })

    registerAction({
        hook: DOWNLOAD_MIDDLEWARES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: async ({ addDownloadMiddleware }) => {
            addDownloadMiddleware(downloadCacheCheckMiddleware(settings.cache))
            addDownloadMiddleware(downloadCacheWriteMiddleware(settings.cache))
        },
    })
}
