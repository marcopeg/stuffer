import fs from 'fs-extra'
import path from 'path'
import loadFromStore from './load-from-store'
import * as uploader from '../upload/pool'

export default async (settings) => {
    const filesPath = path.join(settings.store.base, 'files')

    await uploader.init({
        filesPath,
        metaPath: path.join(settings.store.base, 'meta'),
        cachePath: settings.storeS3.base,
        aws: settings.storeS3,
    })

    await fs.ensureDir(settings.storeS3.base)
    await loadFromStore(filesPath, uploader.push)
}
