/**
 * Checks if a custom Name was provided as form field to override the
 * automatic assigned one.
 */

import fs from 'fs-extra'
import path from 'path'
import sanitizeFilename from 'sanitize-filename'

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

            // validate custom name
            try {
                if (customName !== sanitizeFilename(customName)) {
                    throw new Error('unacceptable file name')
                }
            } catch (err) {
                return markAsError({
                    type: 'custom-name',
                    message: `failed while trying to apply a custom name - ${file.field}/${file.uuid}`,
                    details: { originalError: err },
                })
            }

            // Try to rename the file according to the new file name
            try {
                const newTempFileName = `${req.data.upload.space}__${file.uuid}__${customName}`
                const newTempPath = path.join(req.data.upload.tempPath, newTempFileName)
                await fs.move(file.tempPath, newTempPath, { overwrite: true })
                file.name = customName
                file.tempPath = newTempPath

            // Move the file to the error bucket
            } catch (err) {
                return markAsError({
                    type: 'custom-uuid',
                    message: `failed while trying to apply custom name - ${file.field}/${file.uuid}`,
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
