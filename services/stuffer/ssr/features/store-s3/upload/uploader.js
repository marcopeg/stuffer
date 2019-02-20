import fs from 'fs-extra'
import path from 'path'
import AWS from 'aws-sdk'
import { logVerbose } from 'ssr/services/logger'


export default class Uploader {
    constructor (settings, file) {
        this.settings = settings
        this.file = file
    }

    upload () {
        return new Promise((resolve, reject) => {
            const start = new Date()
            const filePath = path.join(this.settings.filesPath, this.file)
            const cachePath = path.join(this.settings.cachePath, this.file)

            new AWS.S3(this.settings.aws).upload({
                Bucket: this.settings.aws.Bucket,
                Key: this.file,
                Body: fs.createReadStream(filePath),
            }, (err) => {
                if (err) {
                    return reject(err)
                }

                logVerbose(`[store-s3] uploaded "${this.file}" in ${(new Date() - start)}ms`)

                fs.move(filePath, cachePath, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        logVerbose(`[store-s3] moved "${this.file}" to "${cachePath}"`)
                        // @TODO: add the file to a local LRU
                        resolve()
                    }
                })
            })
        })
    }
}
