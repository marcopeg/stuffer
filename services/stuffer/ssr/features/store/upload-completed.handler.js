/**
 * Hooks into the upload feature and moves all the uploaded files to
 * the store base folder.
 */

import fs from 'fs-extra'
import path from 'path'
import { get } from './settings'

const getMetaName = file =>
    process.env.NODE_ENV === 'development'
        ? `${file.name}__meta.json`
        : 'meta.json'

export const handler = async ({ files, errors, options }) => {
    const base = get('base')

    for (const field in files) {
        const file = files[field]
        try {
            const fileBase = path.join(base, 'files', file.space, file.uuid)
            const filePath = path.join(fileBase, file.name)

            const metaBase = path.join(base, 'meta', file.space, file.uuid)
            const metaPath = path.join(metaBase, getMetaName(file))

            await fs.ensureDir(fileBase)
            await fs.ensureDir(metaBase)
            await fs.move(file.tempPath, filePath, { overwrite: true })
            await fs.move(file.metaPath, metaPath, { overwrite: true })

            delete file['tempPath']
            file.fullPath = filePath
            file.metaPath = metaPath
        } catch (err) {
            file.errors.push({
                type: 'fmove',
                details: 'could not move file from temp folder to store',
                originalError: err,
            })
            errors.push({
                type: 'file',
                ...file,
            })
            delete files[field]
        }
    }
}
