/**
 * Every time a cache file gets created, an in-memory entry is stored in the LRU.
 *
 *     key: cache file full path
 *     val: file size in bytes
 *
 * The cache is tested at read time so that if no cache record is found, there
 * will be no attempts to stream the cache file at all.
 *
 * When the server boot we try to read from the cache folder and generate the
 * LRU in-memory store.
 *
 * Entries are deleted by age and by overall size of the cache store.
 */

import Lru from 'lru-cache'
import fs from 'fs-extra'
import { logError, logDebug } from 'ssr/services/logger'
import { importCache } from './lru-cache-import'

let store = null

export const init = (settings) => {
    store = new Lru({
        max: settings.maxSize,
        maxAge: settings.maxAge,
        length: (val) => val,
        dispose: (key) => {
            fs.unlink(key, (err) => {
                if (err) {
                    logError(`[cache] could not delete - ${key} - ${err.message}`)
                    logDebug(err)
                }
            })
        },
    })

    // automatic prune the cache out
    setInterval(() => store.prune(), settings.pruneInterval)
    return importCache(store, settings)
}

// Interface to the cache middlewares to ping into the cache
export const setCache = (k, v) => store.set(k, v)
export const getCache = (k) => store.get(k)
