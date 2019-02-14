import fs from 'fs'
import path from 'path'

export default options => ({
    name: 'meta',
    priority: 500,
    handler: (req, res, next) => {
        const makeMetaFile = fileName => new Promise((resolve, reject) => {
            const fileInfo = req.data.upload.form.files[fileName]

            const metaData = {
                custom: req.data.upload.form.fields[fileName] || {},
            }

            const metaFilePath = path.join(req.data.upload.tempPath, `${fileInfo.space}__${fileInfo.uuid}__${fileName}__meta.json`)

            fs.writeFile(metaFilePath, JSON.stringify(metaData), 'utf8', (err) => {
                if (err) {
                    fileInfo.errors.push(`could not write meta - ${err.message}`)
                    reject(err)
                } else {
                    fileInfo.metaPath = metaFilePath
                    resolve()
                }
            })
        })

        Promise.all(Object.keys(req.data.upload.form.files).map(makeMetaFile))
            .then(() => next())
            .catch(err => next(err))
    },
})
