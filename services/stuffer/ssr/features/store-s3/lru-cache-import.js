import glob from 'glob'
import path from 'path'
import fs from 'fs-extra'
import async from 'async'
import { logInfo, logError, logVerbose, logDebug } from 'services/logger'

const globp = (path, options) => new Promise((resolve, reject) => {
    glob(path, options, (err, files) => {
        if (err) {
            reject(err)
        } else {
            resolve(files)
        }
    })
})

export const importCache = (store, settings) => new Promise(async (resolve, reject) => {
    logInfo('[store-s3] start importing LRU cache from local disk...')
    const now = new Date()
    const files = await globp(path.join(settings.base, '**/*.stuff'))
    console.log(files)

    const iteratee = async (file, next) => {
        try {
            const stats = await fs.stat(file)

            if (now - new Date(stats.mtime) > settings.maxAge) {
                try {
                    await fs.remove(path.dirname(file))
                } catch (err) {
                    logError(`[store-s3] could not delete: ${file} - ${err.message}`)
                    return next()
                }
            }

            store.set(file, stats.size)
            next()
        } catch (err) {
            next(err)
        }
    }

    async.eachLimit(files, 10, iteratee, (err) => {
        if (err) {
            logError(`[store-s3] failed to init LRU cache: ${err.message}`)
            logDebug(err)
        }
        logInfo('[store-s3] finished importing LRU cache')
        resolve()
    })
})
