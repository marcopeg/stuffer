import fs from 'fs'
import path from 'path'
import busboy from 'connect-busboy'
import mkdirp from 'mkdirp'
import AWS from 'aws-sdk'
import { createHook } from '@marcopeg/hooks'
import { logError, logVerbose } from 'ssr/services/logger'
import { EXPRESS_ROUTE, EXPRESS_UPLOAD, EXPRESS_UPLOAD_CONFIG } from './hooks'
import { SIGUSR2 } from 'constants';

const getTodayFolderName = () => {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    return [
        y,
        m > 9 ? m : `0${m}`,
        d > 9 ? d : `0${d}`,
    ].join('-')
}

const handler = async ({ app, settings }) => {
    const options = { ...(settings.upload || {}) }
    createHook(EXPRESS_UPLOAD_CONFIG, { args: { options } })

    if (!options.mountPoint) {
        throw new Error('[express/upload] mount point not defined')
    }

    if (!options.destPath) {
        throw new Error('[express/upload] uploads destination not defined')
    }

    const prepareUploadContext = (req, res, next) => {
        req.upload = {
            info: {},
            errors: [],
            files: [],
            _files: {},
            _promises: [],
        }
        next()
    }

    const upsertTempFolder = (req, res, next) => {
        req.upload.localFolder = path.join(options.destPath, getTodayFolderName())
        mkdirp(req.upload.localFolder, next)
    }

    const injectBusboy = busboy({
        highWaterMark: options.bufferSize,
        limits: options.limits || {},
    })

    const handleUpload = (req, res) => {
        req.upload.info = {
            bytesSent: req.headers['content-length'],
        }

        req.busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
            const filePath = path.join(req.upload.localFolder, fileName)
            let bytesReceived = 0

            const fileInfo = {
                fieldName,
                fileName,
                encoding,
                mimeType,
                fs: {},
                s3: {},
                errors: [],
            }
            req.upload._files[fileName] = fileInfo

            // Handle read stream
            file.on('data', data => (bytesReceived += data.length))
            file.on('limit', () => {
                fileInfo.errors.push('size')
                // req.upload.errors.push({
                //     fileName,
                //     fieldName,
                //     encoding,
                //     mimeType,
                //     bytesReceived,
                //     errorType: 'sizeLimit',
                // })
                // fs.unlink(filePath, (err) => {
                //     if (err) {
                //         logError(`[express/upload] failed to delete invalid upload - ${filePath}`)
                //     } else {
                //         logVerbose(`[express/upload] invalid upload file removed - ${filePath}`)
                //     }
                // })
            })

            // Local Storage
            req.upload._promises.push(new Promise((resolve, reject) => {
                const fstream = fs.createWriteStream(filePath)
                file.pipe(fstream)

                fstream.on('close', () => {
                    fileInfo.fs = {
                        success: !file.truncated,
                        filePath,
                        bytesReceived,
                        bytesWritten: fstream.bytesWritten,
                    }
                    resolve()
                })
            }))

            // S3 Storage
            req.upload._promises.push(new Promise((resolve, reject) =>
                new AWS.S3({
                    accessKeyId: options.aws.key,
                    secretAccessKey: options.aws.secret,
                    region: options.aws.region,
                    params: {
                        Body: file,
                        Bucket: options.aws.bucket,
                        ContentType: mimeType,
                        Key: fileName,
                    },
                    options: {
                        partSize: 5 * 1024 * 1024, // 5 MB
                        queueSize: 100,
                    },
                })
                    .upload()
                    .on('httpUploadProgress', (evt) => {
                        console.log(evt)
                    })
                    .send(function (err, data) {
                        if (err) {
                            fileInfo.s3.success = false
                            fileInfo.s3.error = err
                            fileInfo.errors.push(err.message)
                        } else {
                            fileInfo.s3.success = true
                            fileInfo.s3.data = data
                        }
                        resolve()
                    })
            ))
        })

        req.busboy.on('finish', () => {
            Promise.all(req.upload._promises)
                .then(() => {})
                .catch(() => {})
                .finally(() => {
                    res.send({
                        info: req.upload.info,
                        files: req.upload._files,
                        errors: req.upload.errors,
                    })
                })
            // res.send(req.upload)
        })
        req.pipe(req.busboy)
    }

    const middlewares = [
        prepareUploadContext,
        upsertTempFolder,
        injectBusboy,
        handleUpload,
    ]

    app.post(options.mountPoint, middlewares)
}

export const register = ({ registerAction }) => {
    registerAction({
        hook: EXPRESS_ROUTE,
        name: EXPRESS_UPLOAD,
        trace: __filename,
        handler,
    })
}
