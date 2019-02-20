import fs from 'fs-extra'
import path from 'path'
import loadFromStore from './load-from-store'
import * as uploader from '../upload/pool'

export default async (settings) => {
    const filesPath = path.join(settings.store.base, 'files')

    await uploader.init({
        filesPath,
        cachePath: settings.storeS3.base,
        aws: settings.storeS3,
    })

    await fs.ensureDir(settings.storeS3.base)
    await loadFromStore(filesPath, uploader.push)
}
