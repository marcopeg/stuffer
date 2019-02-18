import path from 'path'
import mkdirp from 'mkdirp'

const ensure = fpath => new Promise((resolve, reject) => {
    mkdirp(fpath, (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }
    })
})

export const handler = ({ base }) => async () =>
    Promise.all([
        ensure(path.join(base, 'files')),
        ensure(path.join(base, 'meta')),
    ])
