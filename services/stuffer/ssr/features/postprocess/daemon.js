/**
 * @TODO: there is no error handling whatsoever
 */

import path from 'path'
import fs from 'fs-extra'
import { resolveFile, computeFile } from 'features/store'
import { processorExec } from './processors'

const state = {
    timer: null,
    interval: 10,
    intervalOnEmpty: 5000,
}

// 1. pick a definition from the tasks folder
// 2. executes it
const loop = async () => {
    const files = await fs.readdir(state.tasksPath)
    const target = files.filter(name => name.indexOf('json') !== -1).shift()

    if (!target) {
        state.timer = setTimeout(loop, state.intervalOnEmpty)
        return
    }

    const taskFilePath = path.join(state.tasksPath, target)
    const data = await fs.readJSON(taskFilePath)
    const sourceFilePath = await resolveFile(data.space, data.uuid, data.originalFileName)
    const destFilePath = await computeFile(data.space, data.uuid, data.fileName)
    await processorExec(data.rule, sourceFilePath, destFilePath, data)
    await fs.unlink(taskFilePath)

    state.timer = setTimeout(loop, state.interval)
}

export const start = ({ tasksPath }) => {
    state.tasksPath = tasksPath
    loop()
}

