import path from 'path'
import glob from 'glob'
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
    require('./services/express'),
]

const features = [
    require('./features/upload'),
    require('./features/store'),
    require('./features/download'),
]

registerAction({
    hook: require('./features/upload/hooks').UPLOAD_CONFIG,
    name: '♦ boot',
    handler: ({ options }) => {
        options.mountPoint = config.get('UPLOAD_MOUNT_POINT')
        options.tempFolder = config.get('UPLOAD_TEMP_FOLDER')
        options.bufferSize = Number(config.get('UPLOAD_BUFFER_SIZE', 2 * 1048576)) // Set 2MiB buffer
        options.maxSize = Number(config.get('UPLOAD_MAX_SIZE', 100 * 1048576)) // 100Mb
        options.maxFiles = Number(config.get('UPLOAD_MAX_FILES', 10))
        options.maxFileSize = Number(config.get('UPLOAD_MAX_FILE_SIZE', 100 * 1048576)) // 100Mb
        options.maxFields = Number(config.get('UPLOAD_MAX_FIELDS', options.maxFiles * 2))
        options.maxFieldSize = Number(config.get('UPLOAD_MAX_FIELD_SIZE', 5 * 1024)) // 5Kb - cookie style
    },
})

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        settings.store = {
            base: config.get('STORE_BASE'),
        }

        settings.download = {
            baseUrl: config.get('DOWNLOAD_BASE_URL'),
            mountPoint: config.get('DOWNLOAD_MOUNT_POINT', '/'),
        }

        settings.express = {
            nodeEnv: config.get('NODE_ENV'),
            port: '8080',
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
