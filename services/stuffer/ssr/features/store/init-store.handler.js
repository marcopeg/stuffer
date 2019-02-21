import path from 'path'
import fs from 'fs-extra'

export const handler = ({ base }) => async () =>
    Promise.all([
        fs.ensureDir(path.join(base, 'files')),
        fs.ensureDir(path.join(base, 'meta')),
    ])
