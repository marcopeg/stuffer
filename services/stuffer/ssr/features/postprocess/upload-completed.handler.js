/**
 * Generate the postprocess tasks files out of the variants
 * stored in each file meta informations.
 *
 */

import path from 'path'
import fs from 'fs-extra'
import { ulid } from 'ulid'

export const handler = settings => {
    const jsonSerializeOptions = process.env.NODE_ENV === 'development'
        ? { spaces: 4 }
        : {}

    return ({ files }) => {
        const filesP = Object.values(files).map(file => {
            const tasksP = file.meta.variants.map(variant => {
                const taskPath = path.join(settings.postprocess.base, 'tasks', `${ulid()}.json`)
                const taskData = {
                    ...variant,
                    space: file.space,
                    uuid: file.uuid,
                    originalFileName: file.fileName,
                    originalFileNameHashed: file.fileNameHashed,
                }
                return fs.writeJson(taskPath, taskData, jsonSerializeOptions)
            })

            return Promise.all(tasksP)
        })

        return Promise.all(filesP)
    }
}
