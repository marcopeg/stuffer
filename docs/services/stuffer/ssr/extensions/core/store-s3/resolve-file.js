import path from 'path'
import fs from 'fs-extra'
import AWS from 'aws-sdk'
import { fileExists } from 'lib/file-exists'
import { hashFileName } from 'lib/hash-file-name'
import { logError, logDebug } from 'services/logger'
import { setCache } from './lru-cache'

const fromCache = async (settings, space, uuid, fileName) => {
    try {
        const fileNameHashed = hashFileName(fileName)
        const filePath = path.join(settings.storeS3.paths.cache, 'files', space, uuid, `${fileNameHashed}.stuff`)
        const exists = await fileExists(filePath)
        return exists ? filePath : null
    } catch (err) {
        logError(`[store-s3] failed test local cache for stuff: ${space}/${uuid}/${fileName} - ${err.message}`)
        return null
    }
}

const fromStore = async (settings, space, uuid, fileName) => {
    try {
        const fileNameHashed = hashFileName(fileName)
        const filePath = path.join(settings.store.base, 'files', space, uuid, `${fileNameHashed}.stuff`)
        const exists = await fileExists(filePath)
        return exists ? filePath : null
    } catch (err) {
        logError(`[store-s3] failed test local store for stuff: ${space}/${uuid}/${fileName} - ${err.message}`)
        return null
    }
}

const fromS3 = async (settings, space, uuid, fileName) =>
    new Promise(async resolve => {
        const fileNameHashed = hashFileName(fileName)
        const cachePath = path.join(settings.storeS3.paths.cache, 'files', space, uuid, `${fileNameHashed}.stuff`)
        const s3Key = path.join('files', space, uuid, `${fileNameHashed}.stuff`)

        await fs.ensureDir(path.join(settings.storeS3.paths.cache, 'files', space, uuid))
        
        const s3Stream = new AWS.S3(settings.storeS3.aws)
        .getObject({
            Bucket: settings.storeS3.aws.Bucket,
            Key: s3Key,
        })
        .createReadStream()
        
        const fileStream = fs.createWriteStream(cachePath)
        fileStream.on('finish', () => setCache(cachePath, fileStream.bytesWritten))
    
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

export default settings => async (space, uuid, fileName) => {
    const cache = await fromCache(settings, space, uuid, fileName)
    if (cache) return cache
    
    const store = await fromStore(settings, space, uuid, fileName)
    if (store) return store
    
    const s3 = await fromS3(settings, space, uuid, fileName)
    if (s3) return s3

    throw new Error('file not found')
}
