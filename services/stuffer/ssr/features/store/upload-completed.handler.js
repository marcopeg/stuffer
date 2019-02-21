/**
 * Hooks into the upload feature and moves all the uploaded files to
 * the store base folder.
 */

import fs from 'fs-extra'
import path from 'path'
import { createHook } from '@marcopeg/hooks'
import { STORE_FILE_MOVED } from './hooks'

export const handler = ({ base }) => async ({ files, errors, options }) => {
    for (const field in files) {
        const file = files[field]
        try {
            const fileBase = path.join(base, 'files', file.space, file.uuid)
            const filePath = path.join(fileBase, `${file.nameB64}.stuff`)

            const metaBase = path.join(base, 'meta', file.space)
            const metaPath = path.join(metaBase, `${file.uuid}.json`)

            await fs.ensureDir(fileBase)
            await fs.ensureDir(metaBase)
            await fs.move(file.tempPath, filePath, { overwrite: true })
            await fs.move(file.metaPath, metaPath, { overwrite: true })

            delete file['tempPath']
            file.fullPath = filePath
            file.metaPath = metaPath

            // let remote storage plugins hook in to upload and move the stuff
            await createHook(STORE_FILE_MOVED, {
                async: 'serie',
                args: { file },
            })
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
