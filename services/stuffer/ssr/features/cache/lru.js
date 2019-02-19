
import Lru from 'lru-cache'
import fs from 'fs-extra'
import { logError, logDebug } from 'ssr/services/logger'

let store = null

export const init = (settings) => {
    console.log(settings)
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
}

export const setCache = (k, v) => store.set(k, v)
export const getCache = (k) => store.get(k)
