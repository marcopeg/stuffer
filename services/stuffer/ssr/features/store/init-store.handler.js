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

export const handler = async ({ store }) =>
    Promise.all([
        ensure(path.join(store.base, 'files')),
        ensure(path.join(store.base, 'meta')),
    ])
