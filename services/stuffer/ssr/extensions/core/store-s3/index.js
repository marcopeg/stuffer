import path from 'path'
import chokidar from 'chokidar'
import * as config from '@marcopeg/utils/lib/config'
import { INIT_FEATURE, START_FEATURE } from '@marcopeg/hooks'
import { FEATURE_NAME } from './hooks'

import { init as initUploadPool, start as startUploadPool } from './upload-pool'
import { addStuff, addMeta } from './upload-pool'

export const register = ({ registerAction, settings }) => {
    // Build local configuration
    settings.storeS3 = {
        paths: {
            store: settings.store.base,
            cache: config.get('STORE_S3_DATA_PATH', path.join(settings.stufferData, 'store-s3')),
        },
        aws: {
            accessKeyId: config.get('STORE_S3_KEY', 'xxx'),
            secretAccessKey: config.get('STORE_S3_SECRET', 'xxx'),
            Bucket: config.get('STORE_S3_BUCKET', 'xxx'),
            region: config.get('STORE_S3_REGION', 'xxx'),
            apiVersion: '2006-03-01',
        },
        cache: {
            maxAge: Number(config.get('STORE_S3_MAX_AGE', '31536000')) * 1000, // in seconds, 1 year
            maxSize: Number(config.get('STORE_S3_MAX_SIZE', '100')) * 1000000, // in Mb
            pruneInterval: Number(config.get('STORE_S3_PRUNE_INTERVAL', '1')) * 1000, // in seconds
        },
    }

    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: async () => {
            initUploadPool(settings.storeS3)

            const filesPath = path.join(settings.store.base, 'files')
            chokidar.watch(filesPath, { ignore: /.DS_Store/ })
            .on('add', file => {
                addStuff(path.relative(filesPath, file))
            })
            
            const metaPath = path.join(settings.store.base, 'meta')
            chokidar.watch(metaPath, { ignore: /.DS_Store/ })
                .on('add', file => {
                    addMeta(path.relative(metaPath, file))
                })
        },
    })
    
    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: async () => {
            startUploadPool()
        },
    })
}