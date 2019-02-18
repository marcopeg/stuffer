/**
 * Removes partial uploads
 */

import fs from 'fs-extra'

export default options => ({
    name: 'cleanup',
    priority: 700,
    handler: (req, res, next) => {
        const promises = req.data.upload.form.errors
            .filter(err => err.type === 'file')
            .map(file => fs.unlink(file.tempPath))

        Promise.all(promises)
            .then(() => next())
            .catch(err => next(err))
    },
})
