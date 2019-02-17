/**
 * The responsability is to validate the original file to exists and
 * provide a filePath to it for the streamer to take action.
 *
 * If an external storage feature is active, it might need to fetch
 * the file from the outside and maintain a local cache.
 *
 * Here we treat thi possibility as an extension point.
 */
import { createHook } from '@marcopeg/hooks'
import { STORE_CHANGE_RESOLVER } from './hooks'
import fileResolver from './file-resolver'

export const handler = ({ base }) => async ({ file }) => {
    // Let extensions set an custom resolver
    const setResolver = fn => (setResolver.fn = fn)
    createHook(STORE_CHANGE_RESOLVER, { args: { setResolver } })
    const resolver = setResolver.fn || fileResolver

    return resolver({ file, base })
}
