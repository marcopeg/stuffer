/**
 * This is used to create in-memory semaphores on store resources.
 *
 * The usecase is to prevent to try to upload to s3 while a post-processing is
 * operating on the same file, or vice versa.
 *
 *      const free = lockr.set('space/uuid/fileName')
 *      ...
 *      free()
 * 
 */

import Lru from 'lru-cache'

const store = new Lru({
    maxAge: 1000 * 60 * 60,
    dispose: (key, val) => {
        if (typeof val === 'function') {
            val()
        }
    },
})

// check on expired locks
setInterval(() => store.prune(), 1000)

export const lock = (key, maxAge = null, value = null) => {
    store.set(key, value, maxAge)
    return () => store.del(key)

}
export const free = key => store.del(key)
export const isFree = key => !store.has(key)
