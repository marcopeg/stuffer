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

// require('es6-promise').polyfill()
// require('isomorphic-fetch')


const services = [
    require('./services/env'),
    require('./services/logger'),
    require('./services/express/upload'),
    require('./services/express'),
]

const features = []

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
    hook: require('./services/express/hooks').EXPRESS_UPLOAD_CONFIG,
    name: '♦ boot',
    handler: ({ options }) => {
        options.mountPoint = config.get('UPLOAD_MOUNT')
        options.destPath = config.get('UPLOAD_TARGET')
        options.bufferSize = 2 * 1024 * 1024 // Set 2MiB buffer
        options.limits = {
            fields: 0,
            // fileSize: 1000000,
        }
        options.aws = {
            key: config.get('AWS_KEY'),
            secret: config.get('AWS_SECRET'),
            region: config.get('AWS_REGION'),
            bucket: config.get('AWS_BUCKET'),
        }
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
