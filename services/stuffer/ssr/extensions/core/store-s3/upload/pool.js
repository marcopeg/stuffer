import { logInfo, logError, logDebug, logVerbose } from 'services/logger'
import Uploader from './uploader'

const settings = {
    filesPath: null,
    cachePath: null,
    aws: {
        accessKeyId: null,
        secretAccessKey: null,
        Bucket: null,
        region: null,
    },
    interval: 10,
    intervalOnEmpty: 5000,
    intervalOnError: 10,
}

const state = {
    isRunning: false,
    timer: null,
    current: null,
}

const tasks = []

const loop = async () => {
    if (!state.isRunning) {
        return
    }

    state.current = tasks.shift()
    if (!state.current) {
        logVerbose('[store-s3] upload queue is empty')
        state.timer = setTimeout(loop, settings.intervalOnEmpty)
        return
    }

    try {
        await state.current.upload()
        state.timer = setTimeout(loop, settings.interval)
    } catch (err) {
        logError(`[store-s3] upload error: ${err.message}`)
        state.timer = setTimeout(loop, settings.intervalOnError)
    }
}

export const init = ({ filesPath, metaPath, cachePath, aws }) => {
    settings.filesPath = filesPath
    settings.metaPath = metaPath
    settings.cachePath = cachePath
    settings.aws = aws
}

export const push = (file) =>
    tasks.push(new Uploader(settings, file))

export const start = () => {
    state.isRunning = true
    loop()
}

export const stop = () => {
    state.isRunning = false
    clearTimeout(state.timer)
}
