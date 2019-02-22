import path from 'path'
import uuid from 'uuid/v1'
import * as config from '@marcopeg/utils/lib/config'
import { logInfo } from 'services/logger'
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

const getJwtSecret = () => {
    const secret = config.get('JWT_SECRET', '---')
    if (secret !== '---') {
        return secret
    }

    const generatedSecret = uuid()
    logInfo('')
    logInfo('WARNING:')
    logInfo('Stuffer was started without a JWT_SECRET env var.')
    logInfo('The following value is being generated for this run:')
    logInfo(generatedSecret)
    logInfo('')
    return generatedSecret
}

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        const stufferData = config.get('STUFFER_DATA', '/var/lib/stuffer')

        settings.jwt = {
            secret: getJwtSecret(),
            duration: config.get('JWT_DURATION', '0s'),
        }

        settings.express = {
            nodeEnv: config.get('NODE_ENV'),
            port: '8080',
        }

        settings.upload = {
            tempFolder: config.get('UPLOAD_DATA_PATH', path.join(stufferData, 'uploads')),
            mountPoint: config.get('UPLOAD_MOUNT_POINT', '/upload'),
            publicSpace: config.get('UPLOAD_PUBLIC_SPACE', 'public'),
            bufferSize: Number(config.get('UPLOAD_BUFFER_SIZE', 2 * 1048576)), // Set 2MiB buffer
            maxSize: Number(config.get('UPLOAD_MAX_SIZE', 100 * 1048576)), // 100Mb
            maxFiles: Number(config.get('UPLOAD_MAX_FILES', 10)),
            maxFields: Number(config.get('UPLOAD_MAX_FIELDS', 30)),
            maxFileSize: Number(config.get('UPLOAD_MAX_FILE_SIZE', 100 * 1048576)), // 100Mb
            maxFieldSize: Number(config.get('UPLOAD_MAX_FIELD_SIZE', 5 * 1024)), // 5Kb - cookie style
        }

        settings.store = {
            base: config.get('STORE_DATA_PATH', path.join(stufferData, 'store')),
        }

        settings.storeS3 = {
            enabled: config.get('STORE_S3_ENABLED', 'false') === 'true',
            base: config.get('STORE_S3_DATA_PATH', path.join(stufferData, 'store-s3')),
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

        settings.download = {
            baseUrl: config.get('DOWNLOAD_BASE_URL', 'http://localhost:8080'),
            mountPoint: config.get('DOWNLOAD_MOUNT_POINT', '/'),
            modifiers: {},
        }

        settings.cache = {
            base: config.get('CACHE_DATA_PATH', path.join(stufferData, 'cache')),
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
