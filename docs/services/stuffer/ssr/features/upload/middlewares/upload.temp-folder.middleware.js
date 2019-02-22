/**
 * Ensures that the destination folder for the upload exists.
 *
 * @TODO: we may want to let extensions to be able to change the
 * granularity of the per date btree index
 */

import path from 'path'
import fs from 'fs-extra'

const getTodayTokens = () => {
    const date = new Date()
    const Y = date.getFullYear()
    const M = date.getMonth() + 1
    const D = date.getDate()
    const m = date.getMinutes()
    const s = date.getSeconds()

    return {
        Y: String(Y),
        M: M > 9 ? String(M) : `0${M}`,
        D: D > 9 ? String(D) : `0${D}`,
        m: m > 9 ? String(m) : `0${m}`,
        s: s > 9 ? String(s) : `0${s}`,
    }
}

export default options => ({
    name: 'tempFolder',
    priority: 300,
    handler: (req, res, next) => {
        const tokens = getTodayTokens()
        const tempIndex = `${tokens.Y}-${tokens.M}-${tokens.D}`

        req.data.upload.tempPath = path.join(options.tempFolder, tempIndex)
        fs.ensureDir(req.data.upload.tempPath, next)
    },
})
