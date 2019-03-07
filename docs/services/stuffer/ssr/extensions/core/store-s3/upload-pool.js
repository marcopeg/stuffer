import { logError, logDebug } from 'services/logger'
import UploadStuff from './upload-stuff'
import UploadMeta from './upload-meta'

const state = {
    settings: null,
    isRunning: false,
    timer: null,
    interval: 10,
    intervalOnEmpty: 5000,
    intervalOnError: 10,
}

const tasks = []

const loop = async () => {
    if (!state.isRunning) {
        return
    }

    // get first non busy task for upload
    const task = tasks.find(item => item.isAvailable())

    if (!task) {
        logDebug('[store-s3] upload queue is empty')
        state.timer = setTimeout(loop, state.intervalOnEmpty)
        return
    }

    try {
        await task.upload()
        tasks.splice(tasks.indexOf(task), 1)
        state.timer = setTimeout(loop, state.interval)
    } catch (err) {
        logError(`[store-s3] upload error: ${err.message}`)
        state.timer = setTimeout(loop, state.intervalOnError)
    }
}

export const addStuff = file =>
    tasks.push(new UploadStuff(file, state.settings))

export const addMeta = file =>
    tasks.push(new UploadMeta(file, state.settings))

export const init = settings =>
    state.settings = settings

export const start = () => {
    state.isRunning = true
    loop()
}

export const stop = () => {
    state.isRunning = false
    clearTimeout(state.timer)
}
    