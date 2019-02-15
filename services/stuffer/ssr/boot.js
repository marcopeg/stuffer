import path from 'path'
import glob from 'glob'
import * as config from '@marcopeg/utils/lib/config'
import {
    registerAction,
    createHook,
    createHookApp,
    logBoot,
    SETTINGS,
    FINISH,
} from '@marcopeg/hooks'
import { logInfo } from 'ssr/services/logger'

const services = [
    require('./services/env'),
    require('./services/logger'),
    // require('./services/express/upload'),
    require('./services/express'),
]

const features = [
    require('./features/upload'),
]

// development extensions from a local folder
// @NOTE: extensions should be plain NodeJS compatible, if you want to use
// weird ES6 syntax you have to transpile your extension yourself
const devExtensions = process.env.NODE_ENV === 'development'
    ? glob.sync(path.resolve(__dirname, 'extensions', 'dev', '[!_]*', 'index.js'))
    : []

// community extensions from a mounted volume
// @NOTE: extensions should be plain NodeJS compatible, if you want to use
// weird ES6 syntax you have to transpile your extension yourself
const communityExtensions = glob
    .sync(path.resolve('/', 'var', 'lib', 'pigtail', 'extensions', '[!_]*', 'index.js'))

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
        settings.express = {
            nodeEnv: config.get('NODE_ENV'),
            port: '8080',
        }

        // core extensions, will be filtered by environment variable
        const enabledExtensions = config.get('EXTENSIONS', '---')
        const coreExtensions = glob
            .sync(path.resolve(__dirname, 'extensions', 'core', `@(${enabledExtensions})`, 'index.js'))

        // register extensions
        const extensions = [ ...devExtensions, ...coreExtensions, ...communityExtensions ]
        for (const extensionPath of extensions) {
            const extension = require(extensionPath)
            if (extension.register) {
                logInfo(`activate extension: ${extensionPath}`)
                await extension.register({
                    registerAction,
                    createHook,
                    settings: { ...settings },
                })
            }
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
