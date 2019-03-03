/**
 * Handles the stream of the uploads to local temporary files
 */

import fs from 'fs'
import path from 'path'
import Busboy from 'busboy'
import { ulid } from 'ulid'
import { createHook } from '@marcopeg/hooks'
import { hashFileName } from 'lib/hash-file-name'
import { UPLOAD_FILE_INFO } from '../hooks'

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
            // handle meta fields
            if (name.includes('_meta')) {
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
            }

            // handle custom fields
            if (name.includes('_checksum') || name.includes('_uuid') || name.includes('_name')) {
                form.fields[name] = value
            }
        })

        busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
            const fileNameHashed = hashFileName(fileName)
            const uuid = ulid()
            const tempFileName = `${req.data.upload.space}__${uuid}__${fileNameHashed}.stuff`
            const tempPath = path.join(req.data.upload.tempPath, tempFileName)
            const info = {
                success: null,
                fileName,
                fileNameHashed,
                uuid,
                space: req.data.upload.space,
                field: fieldName,
                encoding,
                mimeType,
                bytesReceived: 0,
                bytesWritten: 0,
                tempPath,
                metaPath: null,
                errors: [],
            }

            // Extend upload file info
            createHook(UPLOAD_FILE_INFO, { args: {
                fileInfo: info,
            }})

            const fileStream = fs.createWriteStream(tempPath)

            // Handle input stream events
            file.on('data', data => (info.bytesReceived += data.length))
            file.on('limit', () => {
                info.success = false
                info.errors.push({
                    type: 'limit',
                    message: `max file size exceeded: ${options.maxFileSize}`,
                    details: { ...options },
                })
                form.errors.push({
                    type: 'file',
                    ...info,
                })
            })

            // Handle write stream events
            fileStream.on('close', () => {
                info.success = !file.truncated
                info.bytesWritten = fileStream.bytesWritten

                if (!file.truncated) {
                    form.files[fieldName] = info
                }
            })

            // @TODO: handle fileStream error
            // try to write to a folder that is assigned to "root" with the terminal

            // Pipe the file and wait for it's write completion.
            promises.push(new Promise(resolve => fileStream.on('close', resolve)))
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
