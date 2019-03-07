import path from 'path'
import fs from 'fs-extra'
import AWS from 'aws-sdk'
import { fileExists } from 'lib/file-exists'
import { logError } from 'services/logger'

const fromCache = async (settings, space, uuid) => {
    try {
        const filePath = path.join(settings.storeS3.paths.cache, 'meta', space, `${uuid}.json`)
        const exists = await fileExists(filePath)
        return exists ? filePath : null
    } catch (err) {
        logError(`[store-s3] failed test local cache for meta: ${space}/${uuid} - ${err.message}`)
        return null
    }
}

const fromStore = async (settings, space, uuid) => {
    try {
        const filePath = path.join(settings.store.base, 'meta', space, `${uuid}.json`)
        const exists = await fileExists(filePath)
        return exists ? filePath : null
    } catch (err) {
        logError(`[store-s3] failed test local store for meta: ${space}/${uuid} - ${err.message}`)
        return null
    }
}

const fromS3 = async (settings, space, uuid) =>
    new Promise(async resolve => {
        const cachePath = path.join(settings.storeS3.paths.cache, 'meta', space, `${uuid}.json`)
        const s3Key = path.join('meta', space, `${uuid}.json`)

        await fs.ensureDir(path.join(settings.storeS3.paths.cache, 'meta', space))
        
        const s3Stream = new AWS.S3(settings.storeS3.aws)
            .getObject({
                Bucket: settings.storeS3.aws.Bucket,
                Key: s3Key,
            })
            .createReadStream()
        
        const fileStream = fs.createWriteStream(cachePath)
    
        s3Stream.pipe(fileStream)
        s3Stream.on('end', () => resolve(cachePath))
        s3Stream.on('error', (err) => {
            logError(`[store-s3] could not download: ${s3Key} - ${err.message}`)
            logDebug(err)

            fs.unlink(cachePath, (err) => {
                if (err) {
                    logError(`[store-s3] could not remove temp file: ${cachePath} - ${err.message}`)
                    logDebug(err)
                }

                resolve()
            })
        })
    })

// @TODO: if the file is not found we need to keep some kind of LRU cache
// so that we avoid doing the same request toward S3 over and over in case
// of attack.
export default settings => async (space, uuid) => {
    const cache = await fromCache(settings, space, uuid)
    if (cache) return cache

    const store = await fromStore(settings, space, uuid)
    if (store) return store
    
    const s3 = await fromS3(settings, space, uuid)
    if (s3) return s3

    throw new Error('meta file not found')
}
