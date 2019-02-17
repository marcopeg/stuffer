/**
 * Creates the upload meta file
 */

import fs from 'fs-extra'
import path from 'path'
import md5File from 'md5-file'

export default options => ({
    name: 'meta',
    priority: 600,
    handler: (req, res, next) => {
        const makeMetaFile = fieldName => new Promise((resolve, reject) => {
            const fileInfo = req.data.upload.form.files[fieldName]
            console.log('****', fileInfo.tempPath)
            const fileName = fileInfo.name
            const fileChecksum = req.data.upload.form.fields[`${fieldName}_checksum`]

            const fileMeta = {
                name: fileInfo.name,
                type: fileInfo.mimeType,
                encoding: fileInfo.encoding,
                bytes: fileInfo.bytesWritten,
                checksum: null,
                data: (req.data.upload.form.fields[`${fieldName}_meta`] || {}),
            }

            const markAsError = (error) => {
                fileInfo.success = false
                fileInfo.errors.push(error)
                req.data.upload.form.errors.push({ type: 'file', ...fileInfo })
                delete req.data.upload.form.files[fieldName]
                reject()
            }

            // generate server checksum
            try {
                fileMeta.checksum = md5File.sync(fileInfo.tempPath)
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

            const metaFileName = `${fileInfo.space}__${fileInfo.uuid}__${fileName}__meta.json`
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
                    fileInfo.metaPath = metaFilePath
                    fileInfo.meta = fileMeta
                    resolve()
                }
            })
        })

        Promise.all(Object.keys(req.data.upload.form.files).map(makeMetaFile))
            .then(() => next())
            .catch(err => next(err))
    },
})
