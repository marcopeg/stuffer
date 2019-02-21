import path from 'path'
import fs from 'fs-extra'
import AWS from 'aws-sdk'
import { logError, logDebug } from 'ssr/services/logger'

const fileExists = s => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)))

const fromLocalCache = async (settings, file) => {
    const filePath = [
        file.space,
        file.uuid,
        `${file.meta.nameB64}.stuff`,
    ].join('/')

    const cachePath = path.join(settings.storeS3.base, filePath)
    const exists = await fileExists(cachePath)
    if (exists) {
        return cachePath
    }
}

const fromLocalStore = async (settings, file) => {
    const filePath = [
        file.space,
        file.uuid,
        `${file.meta.nameB64}.stuff`,
    ].join('/')

    const cachePath = path.join(settings.store.base, 'files', filePath)
    const exists = await fileExists(cachePath)
    if (exists) {
        return cachePath
    }
}

const fromRemoteCache = (settings, file) => new Promise(async (resolve) => {
    const filePath = [
        file.space,
        file.uuid,
        `${file.meta.nameB64}.stuff`,
    ].join('/')

    const cachePath = path.join(settings.storeS3.base, filePath)

    const s3Stream = new AWS.S3(settings.storeS3)
        .getObject({
            Bucket: settings.storeS3.Bucket,
            Key: `files/${filePath}`,
        })
        .createReadStream()

    await fs.ensureDir(path.join(settings.storeS3.base, file.space, file.uuid))

    const fileStream = fs.createWriteStream(cachePath)

    s3Stream.pipe(fileStream)

    s3Stream.on('error', (err) => {
        fs.unlink(cachePath, (err) => {
            if (err) {
                logError(`[store-s3] could not remove temp file: ${cachePath} - ${err.message}`)
                logDebug(err)
            }
            resolve()
        })
    })

    s3Stream.on('end', () => {
        resolve(cachePath)
    })
})

export default settings => ({ setResolver }) =>
    setResolver(async ({ file, base }) => {
        // check local cache
        const local = await fromLocalCache(settings, file)
        if (local) {
            file.filePath = local
            return
        }

        // check original path
        const original = await fromLocalStore(settings, file)
        if (original) {
            file.filePath = original
            return
        }

        // download from S3 to cache
        const fetchit = await fromRemoteCache(settings, file)
        if (fetchit) {
            file.filePath = fetchit
            return
        }

        file.exists = false
    })
