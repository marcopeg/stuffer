import glob from 'glob'

export default (path, options) => new Promise((resolve, reject) => {
    glob(path, options, (err, files) => {
        if (err) {
            reject(err)
        } else {
            resolve(files)
        }
    })
})