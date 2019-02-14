/**
 * Removes partial uploads
 */

import fs from 'fs'

const deletePartialFile = file => new Promise((resolve, reject) => {
    fs.unlink(file.tempPath, (err) => {
        if (err) {
            file.deleted = true
            file.deleteError = err
            reject(err)
        } else {
            file.deleted = true
            resolve()
        }
    })
})

export default options => ({
    name: 'cleanup',
    priority: 600,
    handler: (req, res, next) => {
        const promises = req.data.upload.form.errors
            .filter(err => err.type === 'file')
            .map(file => deletePartialFile(file))

        Promise.all(promises)
            .then(() => next())
            .catch(err => next(err))
    },
})
