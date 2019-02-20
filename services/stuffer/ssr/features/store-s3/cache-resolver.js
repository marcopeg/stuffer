import path from 'path'
import fs from 'fs-extra'
import AWS from 'aws-sdk'

const fileExists = s => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)))

const makeKey = filePath => {
    const tokens = filePath.split('/')
    const buffer = Buffer.from(filePath)
    return `${tokens[0]}/${buffer.toString('base64')}`
}

const fromLocalCache = async (settings, file) => {
    const filePath = [
        file.space,
        file.uuid,
        file.name,
    ].join('/')

    const cacheKey = makeKey(filePath)
    const cachePath = path.join(settings.storeS3.base, cacheKey)
    const exists = await fileExists(cachePath)
    if (exists) {
        return cachePath
    }
}

const fromRemoteCache = (settings, file) => new Promise(async (resolve) => {
    const filePath = [
        file.space,
        file.uuid,
        file.name,
    ].join('/')

    const cacheKey = makeKey(filePath)
    const cachePath = path.join(settings.storeS3.base, cacheKey)

    const s3Stream = new AWS.S3(settings.storeS3)
        .getObject({
            Bucket: settings.storeS3.Bucket,
            Key: cacheKey,
        })
        .createReadStream()

    await fs.ensureDir(path.join(settings.storeS3.base, file.space))

    const fileStream = fs.createWriteStream(cachePath)

    s3Stream.pipe(fileStream)

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

        // download from S3 to cache
        const fetchit = await fromRemoteCache(settings, file)
        if (fetchit) {
            file.filePath = fetchit
            return
        }

        file.exists = false
    })
