import * as config from '@marcopeg/utils/lib/config'
import {
    registerAction,
    createHookApp,
    logBoot,
    SETTINGS,
    FINISH,
} from '@marcopeg/hooks'

const services = [
    require('./services/env'),
    require('./services/logger'),
    require('./services/jwt'),
    require('./services/express'),
]

const features = [
    require('./features/authentication'),
    require('./features/upload'),
    require('./features/store'),
    require('./features/download'),
    require('./features/mod-jimp'),
    require('./features/cache'),
    require('./features/store-s3'),
]

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        settings.jwt = {
            secret: config.get('JWT_SECRET'),
            duration: config.get('JWT_DURATION'),
        }

        settings.express = {
            nodeEnv: config.get('NODE_ENV'),
            port: '8080',
        }

        settings.upload = {
            mountPoint: config.get('UPLOAD_MOUNT_POINT'),
            tempFolder: config.get('UPLOAD_TEMP_FOLDER'),
            publicSpace: config.get('UPLOAD_PUBLIC_SPACE', 'public'),
            bufferSize: Number(config.get('UPLOAD_BUFFER_SIZE', 2 * 1048576)), // Set 2MiB buffer
            maxSize: Number(config.get('UPLOAD_MAX_SIZE', 100 * 1048576)), // 100Mb
            maxFiles: Number(config.get('UPLOAD_MAX_FILES', 10)),
            maxFields: Number(config.get('UPLOAD_MAX_FIELDS', 30)),
            maxFileSize: Number(config.get('UPLOAD_MAX_FILE_SIZE', 100 * 1048576)), // 100Mb
            maxFieldSize: Number(config.get('UPLOAD_MAX_FIELD_SIZE', 5 * 1024)), // 5Kb - cookie style
        }

        settings.store = {
            base: config.get('STORE_BASE'),
        }

        settings.storeS3 = {
            base: config.get('STORE_S3_BASE'),
            // aws
            accessKeyId: config.get('STORE_S3_KEY'),
            secretAccessKey: config.get('STORE_S3_SECRET'),
            Bucket: config.get('STORE_S3_BUCKET'),
            region: config.get('STORE_S3_REGION'),
            apiVersion: '2006-03-01',
            // cache
            maxAge: Number(config.get('STORE_S3_MAX_AGE', '31536000')) * 1000, // in seconds, 1 year
            maxSize: Number(config.get('STORE_S3_MAX_SIZE', '100')) * 1000000, // in Mb
            pruneInterval: Number(config.get('STORE_S3_PRUNE_INTERVAL', '1')) * 1000, // in seconds
        }

        settings.download = {
            baseUrl: config.get('DOWNLOAD_BASE_URL'),
            mountPoint: config.get('DOWNLOAD_MOUNT_POINT', '/'),
            modifiers: {},
        }

        settings.cache = {
            base: config.get('CACHE_BASE'),
            maxAge: Number(config.get('CACHE_MAX_AGE', '31536000')) * 1000, // in seconds, 1 year
            maxSize: Number(config.get('CACHE_MAX_SIZE', '100')) * 1000000, // in Mb
            pruneInterval: Number(config.get('CACHE_PRUNE_INTERVAL', '60')) * 1000, // in seconds
        }

        settings.auth = {
            isAnonymousUploadEnabled: config.get('AUTH_ENABLE_ANONYMOUS_UPLOAD', 'true') === 'true',
            isAnonymousDownloadEnabled: config.get('AUTH_ENABLE_ANONYMOUS_DOWNLOAD', 'true') === 'true',
            isCrossSpaceDownloadEnabled: config.get('AUTH_ENABLE_CROSS_SPACE_DOWNLOAD', 'false') === 'true',
        }

        try {
            settings.download.modifiers = JSON.parse(config.get('DOWNLOAD_MODIFIERS', '{}'))
        } catch (err) {
            throw new Error('env variable "DOWNLOAD_MODIFIERS" contains invalid JSON')
        }
    },
})

registerAction({
    hook: FINISH,
    name: '♦ boot',
    handler: () => logBoot(),
})

export default createHookApp({
    settings: { cwd: process.cwd() },
    services,
    features,
})
