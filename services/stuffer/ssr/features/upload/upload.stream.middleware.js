/**
 * Handles the stream of the uploads to local temporary files
 */

import fs from 'fs'
import path from 'path'
import Busboy from 'busboy'

export default options => ({
    name: 'stream',
    priority: 400,
    handler: (req, res, next) => {
        const form = {
            fields: {},
            files: {},
            errors: [],
        }

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
            const info = {
                fieldName,
                fileName,
                encoding,
                mymeType,
                tempPath: path.join(req.data.upload.tempPath, fileName),
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

            fileStream.on('close', () => {
                info.truncated = file.truncated
                info.bytesWritten = fileStream.bytesWritten

                if (!file.truncated) {
                    form.files[fileName] = info
                }
            })

            file.pipe(fileStream)
        })

        busboy.on('finish', () => {
            req.data.upload.form = form
            next()
        })

        req.pipe(busboy)
    },
})
