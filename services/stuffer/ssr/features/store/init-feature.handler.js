import path from 'path'
import fs from 'fs-extra'
import { createHook } from '@marcopeg/hooks'
import { STORE_SET_RESOLVER } from './hooks'
import { initResolvers, setMetaResolver, setFileResolver } from './resolvers'


export const initFeatureHandler = async ({ store }) => {
    await Promise.all([
        fs.ensureDir(path.join(store.base, 'files')),
        fs.ensureDir(path.join(store.base, 'meta')),
    ])

    initResolvers(store.base)

    createHook(STORE_SET_RESOLVER, {
        args: {
            setMetaResolver,
            setFileResolver,
        },
    })
}
