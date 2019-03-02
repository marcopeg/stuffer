/**
 * Utilities to dynamically resolve a file path using space/uuid.
 *
 * The general idea is that extensions like `store-s3` can inject
 * their own custom resolvers in here.
 * 
 * "computeXXX" should provide a theoretical path, for instance where to write
 * a file.
 * 
 * "resolveXXX" should return an existing path, doing anything necessary to
 * ensure the validity of the path. If the path can not be ensured they
 * should throw an Error('file not found')
 * 
 * `resolveMeta` and `resolveFile` can be asynchronous
 */

import path from 'path'
import { hashFileName } from 'lib/hash-file-name'

export const state = {
    compute: {
        meta: () => null,
        file: () => null,
    },
    resolve: {
        meta: () => null,
        file: () => null,
    },
}

export const setMetaComputer = fn => (state.compute.meta = fn)
export const setMetaResolver = fn => (state.resolve.meta = fn)

export const setFileComputer = fn => (state.compute.file = fn)
export const setFileResolver = fn => (state.resolve.file = fn)

export const computeMeta = (space, uuid) => state.compute.meta(space, uuid)
export const resolveMeta = (space, uuid) => state.resolve.meta(space, uuid)

export const computeFile = (space, uuid, fileName) => state.compute.file(space, uuid, fileName)
export const resolveFile = (space, uuid, fileName) => state.resolve.file(space, uuid, fileName)

export const initResolvers = (base) => {
    const computeMeta = (space, uuid) => 
       path.join(base, 'meta', space, `${uuid}.json`)

    const computeFile = (space, uuid, fileName) =>
        path.join(base, 'files', space, uuid, `${hashFileName(fileName)}.stuff`)

    setMetaComputer(computeMeta)
    setMetaResolver(computeMeta)

    setFileComputer(computeFile)
    setFileResolver(computeFile)
}
