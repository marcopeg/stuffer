import path from 'path'
import fs from 'fs-extra'
import AWS from 'aws-sdk'
import { logError, logVerbose } from 'services/logger'
import { isFree, lock } from 'features/store'

export default class UploadMeta {
    constructor (file, settings) {
        this.file = file
        this.settings = settings
    }

    isAvailable () {
        return isFree(this.file)
    }

    upload () {
        const start = new Date()
        const unlock = lock(this.file)
        const filePath = path.join(this.settings.paths.store, 'meta', this.file)
        const cachePath = path.join(this.settings.paths.cache, 'meta', this.file)
        this.attempts += 1

        return new Promise((resolve, reject) => {
            new AWS.S3(this.settings.aws).putObject({
                Bucket: this.settings.aws.Bucket,
                Key: `meta/${this.file}`,
                Body: fs.createReadStream(filePath),
            }, (err) => {
                if (err) {
                    logError(`[store-s3] upload failed: ${filePath} - ${err.message}`)
                    unlock()
                    reject(err)
                    return
                }
    
                logVerbose(`[store-s3] uploaded "${this.file}" in ${(new Date() - start)}ms`)
    
                fs.move(filePath, cachePath, { overwrite: true }, (err) => {
                    if (err) {
                        logError(`[store-s3] failed move to cache: ${filePath} to ${cachePath} - ${err.message}`)
                        unlock()
                        reject(err)
                        return
                    }
                    
                    logVerbose(`[store-s3] moved "${this.file}" to "${cachePath}"`)

                    unlock()
                    resolve()
                })
            })
        })
    }
}
