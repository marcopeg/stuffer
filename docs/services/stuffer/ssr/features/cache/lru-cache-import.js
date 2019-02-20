/**
 * Reads the cache folder and restore the in-memory cache that expires
 * files automatically.
 */

import path from 'path'
import fs from 'fs-extra'
import async from 'async'
import { logInfo, logError, logVerbose, logDebug } from 'ssr/services/logger'

export const importCache = (store, settings) => new Promise(async (resolve, reject) => {
    logInfo('[cache] start importing cache from local disk...')
    const now = new Date()
    const done = () => {
        logInfo('[cache] finish import files')
        resolve()
    }

    try {
        const files = await fs.readdir(settings.base)

        const iteratee = (file, next) => {
            const filePath = path.join(settings.base, file)
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    logError(`[cache] could get file stats: ${filePath} - ${err.message}`)
                    return next()
                }

                if (now - new Date(stats.mtime) > settings.maxAge) {
                    return fs.unlink(filePath, (err) => {
                        if (err) {
                            logError(`[cache] could not delete: ${filePath} - ${err.message}`)
                            return
                        }
                        next()
                    })
                }

                logVerbose(`[cache] imported: ${file} - ${stats.size}`)
                store.set(file, stats.size)
                next()
            })
        }

        async.eachLimit(files, 1, iteratee, (err) => {
            if (err) {
                logError(`[cache] errors while reading the cache folder: ${err.message}`)
                logDebug(err)
            }

            done()
        })
    } catch (err) {
        logError(`[cache] could not read cache folder: ${err.message}`)
        logDebug(err)
        done()
    }
})
