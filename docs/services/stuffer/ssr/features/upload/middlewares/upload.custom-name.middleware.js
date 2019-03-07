/**
 * Checks if a custom Name was provided as form field to override the
 * automatic assigned one.
 */

import path from 'path'
import fs from 'fs-extra'
import validator from 'validator'
import { hashFileName } from 'lib/hash-file-name'

const VALID_CHARS = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-_.'

export default options => ({
    name: 'custom-name',
    priority: 550,
    handler: (req, res, next) => {
        const files = req.data.upload.form.files
        const applyCustomName = fieldName => new Promise(async (resolve, reject) => {
            const file = files[fieldName]
            const customName = req.data.upload.form.fields[`${file.field}_name`]

            if (!customName) {
                return resolve()
            }

            const markAsError = (error) => {
                file.success = false
                file.errors.push(error)
                req.data.upload.form.errors.push({ type: 'file', ...file })
                delete req.data.upload.form.files[fieldName]
                reject()
            }

            // #14 Validate custom name
            if (!validator.isWhitelisted(customName, VALID_CHARS)) {
                return markAsError({
                    type: 'custom-name',
                    message: 'file name not allowed',
                })
            }

            // Try to rename the file according to the new file name
            try {
                const fileNameHashed = hashFileName(customName)
                const newTempFileName = `${file.space}__${file.uuid}__${fileNameHashed}.stuff`
                const newTempPath = path.join(req.data.upload.tempPath, newTempFileName)
                await fs.move(file.tempPath, newTempPath, { overwrite: true })

                // update file's details
                file.fileNameOriginal = file.fileName
                file.fileNameHashed = fileNameHashed
                file.fileName = customName
                file.tempPath = newTempPath

            // Move the file to the error bucket
            } catch (err) {
                return markAsError({
                    type: 'custom-name',
                    message: `failed to apply custom name: ${file.field}/${customName} - ${err.message}`,
                    details: { originalError: err },
                })
            }

            resolve()
        })

        Promise.all(Object.keys(files).map(applyCustomName))
            .then(() => next())
            .catch(err => next(err))
    },
})
