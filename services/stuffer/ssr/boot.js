import path from 'path'
import glob from 'glob'
import uuid from 'uuid/v1'
import * as config from '@marcopeg/utils/lib/config'
import { logInfo } from 'services/logger'
import {
    createHook,
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
        settings.stufferData = config.get('STUFFER_DATA', '/var/lib/stuffer')

        settings.jwt = {
            secret: getJwtSecret(),
            duration: config.get('JWT_DURATION', '0s'),
        }

        settings.express = {
            nodeEnv: config.get('NODE_ENV'),
            port: '8080',
        }

        settings.upload = {
            tempFolder: config.get('UPLOAD_DATA_PATH', path.join(settings.stufferData, 'uploads')),
            mountPoint: config.get('UPLOAD_MOUNT_POINT', '/upload'),
            publicSpace: config.get('UPLOAD_PUBLIC_SPACE', 'public'),
            bufferSize: Number(config.get('UPLOAD_BUFFER_SIZE', 2 * 1048576)), // Set 2MiB buffer
            maxSize: Number(config.get('UPLOAD_MAX_SIZE', 100 * 1048576)), // 100Mb
            maxFiles: Number(config.get('UPLOAD_MAX_FILES', 10)),
            maxFields: Number(config.get('UPLOAD_MAX_FIELDS', 30)),
            maxFileSize: Number(config.get('UPLOAD_MAX_FILE_SIZE', 100 * 1048576)), // 100Mb
            maxFieldSize: Number(config.get('UPLOAD_MAX_FIELD_SIZE', 5 * 1024)), // 5Kb - cookie style
        }
        
        settings.download = {
            baseUrl: config.get('DOWNLOAD_BASE_URL', 'http://localhost:8080'),
            mountPoint: config.get('DOWNLOAD_MOUNT_POINT', '/'),
            modifiers: {},
        }
        
        settings.store = {
            base: config.get('STORE_DATA_PATH', path.join(settings.stufferData, 'store')),
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

        // ---- EXTENSIONS

        // development extensions from a local folder
        // @NOTE: extensions should be plain NodeJS compatible, if you want to use
        // weird ES6 syntax you have to transpile your extension yourself
        const devExtensions = process.env.NODE_ENV === 'development'
            ? glob
                .sync(path.resolve(__dirname, 'extensions', 'dev', '[!_]*', 'index.js'))
            : []

        // community extensions from a mounted volume
        // @NOTE: extensions should be plain NodeJS compatible, if you want to use
        // weird ES6 syntax you have to transpile your extension yourself
        const communityExtensionsPath = config.get('STUFFER_CUSTOM_EXTENSIONS', '/var/lib/stuffer/extensions')
        const communityExtensions = glob
            .sync(path.resolve(communityExtensionsPath, '[!_]*', 'index.js'))

        // core extensions, will be filtered by environment variable
        const enabledExtensions = config.get('STUFFER_CORE_EXTENSIONS', '---')
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
