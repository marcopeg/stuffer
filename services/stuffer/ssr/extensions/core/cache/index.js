import path from 'path'
import fs from 'fs-extra'
import * as config from '@marcopeg/utils/lib/config'
import { INIT_FEATURE, START_FEATURE } from '@marcopeg/hooks'
import { DOWNLOAD_MIDDLEWARES } from 'features/download/hooks'
import { FEATURE_NAME } from './hooks'

import * as lru from './lru-cache'
import downloadCacheCheckMiddleware from './download-cache-check.middleware'
import downloadCacheWriteMiddleware from './download-cache-write.middleware'

export const register = ({ registerAction, settings }) => {
    settings.cache = {
        base: config.get('CACHE_DATA_PATH', path.join(settings.stufferData, 'cache')),
        maxAge: Number(config.get('CACHE_MAX_AGE', '31536000')) * 1000, // in seconds, 1 year
        maxSize: Number(config.get('CACHE_MAX_SIZE', '100')) * 1000000, // in Mb
        pruneInterval: Number(config.get('CACHE_PRUNE_INTERVAL', '60')) * 1000, // in seconds
    }

    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: () => lru.init(settings.cache),
    })

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
