/**
 * Checks if a custom UUID was provided as form field to override the
 * automatic assigned one.
 */

import fs from 'fs-extra'
import path from 'path'

export default options => ({
    name: 'custom-uuid',
    priority: 500,
    handler: (req, res, next) => {
        const files = req.data.upload.form.files
        const applyCustomUUID = fieldName => new Promise(async (resolve, reject) => {
            const file = files[fieldName]
            const customUUID = req.data.upload.form.fields[`${file.field}_uuid`]

            if (!customUUID) {
                return resolve()
            }

            const markAsError = (error) => {
                file.success = false
                file.errors.push(error)
                req.data.upload.form.errors.push({ type: 'file', ...file })
                delete req.data.upload.form.files[fieldName]
                reject()
            }

            // @TODO: should we check if the file exists and fail the upload?
            // this involves both:
            // - temp upload file
            // - storage target file

            // Try to rename the file according to the new file name
            try {
                const newTempFileName = `${req.data.upload.space}__${customUUID}__${file.name}`
                const newTempPath = path.join(req.data.upload.tempPath, newTempFileName)
                await fs.move(file.tempPath, newTempPath, { overwrite: true })
                file.uuid = customUUID
                file.tempPath = newTempPath

            // Move the file to the error bucket
            } catch (err) {
                return markAsError({
                    type: 'custom-uuid',
                    message: `failed while trying to apply custom uuid - ${file.field}/${customUUID}`,
                    details: { originalError: err },
                })
            }

            resolve()
        })

        Promise.all(Object.keys(files).map(applyCustomUUID))
            .then(() => next())
            .catch(err => next(err))
    },
})
