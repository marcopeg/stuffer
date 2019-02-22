import fs from 'fs-extra'

export const handler = ({ upload }) =>
    fs.ensureDir(upload.tempFolder)
