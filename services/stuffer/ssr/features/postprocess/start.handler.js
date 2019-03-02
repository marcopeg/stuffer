import path from 'path'
import fs from 'fs-extra'

export const handler = ({ postprocess }) =>
    fs.ensureDir(path.join(postprocess.base, 'tasks'))
