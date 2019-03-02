/**
 * After an upload activity is completed, this logic should generate
 * some tasks files for the postprocessing daemon to take action.
 * 
 * This is not going to apply the real postprocessing, just write down
 * the tasks in a file system database for lazy processing.
 * 
 * @TODO: the list of "rules" should be possible to define at:
 * - instance level (this we have so far)
 * - space level
 * - single file level
 *
 */

import path from 'path'
import fs from 'fs-extra'
import { processorIsValid, processorGetFileName } from './processors'

const getTaskFileName = (file, rule) =>
    `${Date.now()}_${file.space}@${file.uuid}:${rule.apply}.json`

export const handler = settings => {
    const jsonSerializeOptions = process.env.NODE_ENV === 'development'
        ? { spaces: 4 }
        : {}

    return ({ files, errors, options }) => {
        // for each uploaded file
        const promises = Object
            .keys(files)
            .map(key => files[key])
            .map(file => {
                // for each requested rule
                const promises = settings.postprocess.rules
                    .filter(rule => processorIsValid(rule.apply))
                    .filter(rule => RegExp(rule.match, 'g').test(file.fileName))
                    .map(rule => {
                        const taskPath = path.join(settings.postprocess.base, 'tasks', getTaskFileName(file, rule))
                        const taskData = {
                            space: file.space,
                            uuid: file.uuid,
                            rule: rule.apply,
                            fileName: processorGetFileName(rule.apply, file),
                            options: rule.options,
                        }
                        file.fileVariants[rule.apply] = taskData.fileName
                        return fs.writeJson(taskPath, taskData, jsonSerializeOptions)
                    })
                
                return Promise.all(promises)
            })
    
        return Promise.all(promises)
    }
}
