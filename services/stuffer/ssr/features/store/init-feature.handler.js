import path from 'path'
import fs from 'fs-extra'
import { initResolvers } from './resolvers'

export const initFeatureHandler = async ({ store }) => {
    await Promise.all([
        fs.ensureDir(path.join(store.base, 'files')),
        fs.ensureDir(path.join(store.base, 'meta')),
    ])

    initResolvers(store.base)
}
