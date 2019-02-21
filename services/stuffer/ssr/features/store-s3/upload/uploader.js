import fs from 'fs-extra'
import path from 'path'
import AWS from 'aws-sdk'
import { logVerbose } from 'ssr/services/logger'

export default class Uploader {
    constructor (settings, file) {
        this.settings = settings
        this.file = file
    }

    uploadFile () {
        return new Promise((resolve, reject) => {
            const start = new Date()
            const filePath = path.join(this.settings.filesPath, this.file)
            const cachePath = path.join(this.settings.cachePath, this.file)

            new AWS.S3(this.settings.aws).putObject({
                Bucket: this.settings.aws.Bucket,
                Key: `files/${this.file}`,
                Body: fs.createReadStream(filePath),
            }, (err) => {
                if (err) {
                    return reject(err)
                }

                logVerbose(`[store-s3] uploaded "${this.file}" in ${(new Date() - start)}ms`)

                fs.move(filePath, cachePath, { overwrite: true }, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        logVerbose(`[store-s3] moved "${this.file}" to "${cachePath}"`)
                        resolve()
                    }
                })
            })
        })
    }

    uploadMeta () {
        return new Promise((resolve, reject) => {
            const start = new Date()
            const tokens = this.file.split('/')
            const metaName = `${tokens[0]}/${tokens[1]}.json`
            const metaPath = path.join(this.settings.metaPath, metaName)

            new AWS.S3(this.settings.aws).upload({
                Bucket: this.settings.aws.Bucket,
                Key: `meta/${tokens[0]}/${tokens[1]}.json`,
                Body: fs.createReadStream(metaPath),
            }, (err) => {
                if (err) {
                    return reject(err)
                }

                logVerbose(`[store-s3] uploaded "${metaPath}" in ${(new Date() - start)}ms`)
                resolve()
            })
        })
    }

    upload () {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.uploadMeta(),
                this.uploadFile(),
            ])
                .then(() => {
                    // @TODO: add the file to a local LRU
                    resolve()
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    }
}
