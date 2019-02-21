/**
 * Every time a file is caches in the local disk a record is being created.
 *
 *     key: cache file full path
 *     val: file size in bytes
 *
 * Each cached file will expire after a while and will be automatically deleted,
 * plus the cache has a size limit and old files will be deleted as well
 */

import Lru from 'lru-cache'
import fs from 'fs-extra'
import path from 'path'
import { logError, logDebug } from 'ssr/services/logger'
import { importCache } from './lru-cache-import'

let store = null

export const init = (settings) => {
    store = new Lru({
        max: settings.maxSize,
        maxAge: settings.maxAge,
        length: (val) => val,
        dispose: async (key) => {
            const uuidPath = path.dirname(key)
            try {
                await fs.remove(uuidPath)
            } catch (err) {
                logError(`[store-s3] could not delete - ${uuidPath} - ${err.message}`)
                logDebug(err)
                return
            }
        },
    })

    // automatic prune the cache out
    setInterval(() => store.prune(), settings.pruneInterval)
    return importCache(store, settings)
}

// Interface to the cache middlewares to ping into the cache
export const setCache = (k, v) => store.set(k, v)
export const getCache = (k) => store.get(k)
