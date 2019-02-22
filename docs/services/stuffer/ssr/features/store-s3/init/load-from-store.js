/**
 * Scan the store files in order to initialize file uploads.
 * It accepts a synchronous iterator that has to handle each file
 * that gets found.
 */

import path from 'path'
import glob from 'glob'
import async from 'async'

import { logInfo, logError, logDebug } from 'ssr/services/logger'

const globp = (path, options) => new Promise((resolve, reject) => {
    glob(path, options, (err, files) => {
        if (err) {
            reject(err)
        } else {
            resolve(files)
        }
    })
})

export default (sourcePath, onFile) => new Promise(async (resolve, reject) => {
    logInfo(`[store-s3] start import uploads from store: ${sourcePath}`)
    const files = await globp(path.join(sourcePath, '**/*.stuff'))

    const iteratee = (file, next) => {
        onFile(path.relative(sourcePath, file))
        next()
    }

    async.eachLimit(files, 10, iteratee, (err) => {
        if (err) {
            logError(`[store-s3] failed to init store uploads: ${err.message}`)
            logDebug(err)
        }
        logInfo('[store-s3] finished importing uploads')
        resolve()
    })
})
