/**
 * Handles the stream of the uploads to local temporary files
 */

import fs from 'fs'
import path from 'path'
import Busboy from 'busboy'
import uuid from 'uuid/v4'

export default options => ({
    name: 'stream',
    priority: 400,
    handler: (req, res, next) => {
        const form = {
            fields: {},
            files: {},
            errors: [],
        }

        const promises = []

        const busboy = new Busboy({
            headers: req.headers,
            highWaterMark: options.bufferSize,
            limits: {
                files: options.maxFiles,
                fileSize: options.maxFileSize,
                fields: options.maxFields,
                fieldsSize: options.maxFieldSize,
            },
        })

        busboy.on('field', (name, value) => {
            try {
                form.fields[name] = JSON.parse(value)
            } catch (error) {
                form.errors.push({
                    type: 'field',
                    name,
                    value,
                    error,
                })
            }
        })

        busboy.on('file', (fieldName, file, fileName, encoding, mymeType) => {
            const id = uuid()
            const info = {
                fieldName,
                fileName,
                space: req.data.upload.space,
                uuid: id,
                encoding,
                mymeType,
                tempPath: path.join(req.data.upload.tempPath, `${req.data.upload.space}__${id}__${fileName}`),
                bytesWritten: 0,
                bytesReceived: 0,
                truncated: false,
                errors: [],
            }

            const fileStream = fs.createWriteStream(info.tempPath)

            file.on('data', data => (info.bytesReceived += data.length))

            file.on('limit', () => {
                info.errors.push(`max file size exceeded: ${options.maxFileSize}`)
                form.errors.push({
                    type: 'file',
                    ...info,
                })
            })

            // @TODO: handle fileStream error
            // try to write to a folder that is assigned to "root" with the terminal

            promises.push(new Promise((resolve) => {
                fileStream.on('close', () => {
                    info.truncated = file.truncated
                    info.bytesWritten = fileStream.bytesWritten

                    if (!file.truncated) {
                        form.files[fileName] = info
                    }

                    resolve()
                })
            }))

            file.pipe(fileStream)
        })

        busboy.on('finish', () => {
            req.data.upload.form = form
            Promise.all(promises)
                .then(() => next())
                .catch(err => next(err))
        })

        req.pipe(busboy)
    },
})
