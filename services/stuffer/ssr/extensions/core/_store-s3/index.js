import path from 'path'
import * as config from '@marcopeg/utils/lib/config'
import { INIT_FEATURE, START_FEATURE } from '@marcopeg/hooks'
import { STORE_CHANGE_RESOLVER, STORE_FILE_MOVED } from 'features/store/hooks'
import { FEATURE_NAME } from './hooks'

import initHandler from './init/init.handler'
import { start as startUploadPool } from './upload/pool'
import cacheResolver from './cache-resolver'
import uploadFile from './upload/file'

export const name = 'StoreS3'
export const register = ({ registerAction, settings }) => {
    settings.storeS3 = {
        base: config.get('STORE_S3_DATA_PATH', path.join(settings.stufferData, 'store-s3')),
        // aws
        accessKeyId: config.get('STORE_S3_KEY', 'xxx'),
        secretAccessKey: config.get('STORE_S3_SECRET', 'xxx'),
        Bucket: config.get('STORE_S3_BUCKET', 'xxx'),
        region: config.get('STORE_S3_REGION', 'xxx'),
        apiVersion: '2006-03-01',
        // cache
        maxAge: Number(config.get('STORE_S3_MAX_AGE', '31536000')) * 1000, // in seconds, 1 year
        maxSize: Number(config.get('STORE_S3_MAX_SIZE', '100')) * 1000000, // in Mb
        pruneInterval: Number(config.get('STORE_S3_PRUNE_INTERVAL', '1')) * 1000, // in seconds
    }

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
    //     hook: STORE_FILE_MOVED,
    //     name: FEATURE_NAME,
    //     trace: __filename,
    //     handler: uploadFile,
    // })

    // registerAction({
    //     hook: STORE_CHANGE_RESOLVER,
    //     name: FEATURE_NAME,
    //     trace: __filename,
    //     handler: cacheResolver(settings),
    // })
}
