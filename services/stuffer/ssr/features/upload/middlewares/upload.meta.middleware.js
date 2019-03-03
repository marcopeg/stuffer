/**
 * Creates the upload meta file
 */

import fs from 'fs-extra'
import path from 'path'
import md5File from 'md5-file'
import { createHook } from '@marcopeg/hooks'
import { UPLOAD_FILE_META } from '../hooks'

export default options => ({
    name: 'meta',
    priority: 600,
    handler: (req, res, next) => {
        const makeMetaFile = fieldName => new Promise((resolve, reject) => {
            const file = req.data.upload.form.files[fieldName]
            const fileChecksum = req.data.upload.form.fields[`${fieldName}_checksum`]

            const fileMeta = {
                createdAt: (new Date()).toISOString(),
                space: file.space,
                uuid: file.uuid,
                fileName: file.fileName,
                fileNameHashed: file.fileNameHashed,
                fileNameOriginal: file.fileNameOriginal === file.fileName
                    ? null
                    : file.fileNameOriginal,
                type: file.mimeType,
                encoding: file.encoding,
                bytes: file.bytesWritten,
                checksum: null,
                data: (req.data.upload.form.fields[`${fieldName}_meta`] || {}),
            }

            // Extend upload file Meta
            createHook(UPLOAD_FILE_META, { args: {
                file,
                fileMeta,
            }})

            const markAsError = (error) => {
                file.success = false
                file.errors.push(error)
                req.data.upload.form.errors.push({ type: 'file', ...file })
                delete req.data.upload.form.files[fieldName]
                reject()
            }

            // generate server checksum
            try {
                fileMeta.checksum = md5File.sync(file.tempPath)
            } catch (err) {
                return markAsError({
                    type: 'checksum',
                    message: 'failed while trying to generate a checksum',
                    details: { originalError: err },
                })
            }

            // [optional] validate client checksum, if provided
            if (fileChecksum && fileChecksum !== fileMeta.checksum) {
                return markAsError({
                    type: 'checksum',
                    message: 'checksum validation failed',
                    details: null,
                })
            }

            // serialize to disk
            const jsonSerializeOptions = process.env.NODE_ENV === 'development'
                ? { spaces: 4 }
                : {}

            const metaFileName = `${file.space}__${file.uuid}__${file.fileNameHashed}.json`
            const metaFilePath = path.join(req.data.upload.tempPath, metaFileName)
            fs.writeJson(metaFilePath, fileMeta, jsonSerializeOptions, (err) => {
                if (err) {
                    markAsError({
                        type: 'fwrite',
                        message: `could not write meta file - ${err.message}`,
                        details: {
                            filePath: metaFilePath,
                            fileContent: fileMeta,
                            originalError: err,
                        },
                    })
                } else {
                    file.metaPath = metaFilePath
                    file.meta = fileMeta
                    resolve()
                }
            })
        })

        Promise.all(Object.keys(req.data.upload.form.files).map(makeMetaFile))
            .then(() => next())
            .catch(err => next(err))
    },
})
