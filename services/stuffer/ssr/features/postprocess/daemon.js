/**
 * @TODO: there is no error handling whatsoever
 */

import path from 'path'
import fs from 'fs-extra'
import whilst from 'async/whilst'
import { resolveFile, computeFile, lock, isFree } from 'features/store'
import { processorExec } from './processors'

const state = {
    timer: null,
    interval: 10,
    intervalOnEmpty: 5000,
    intervalOnError: 5000,
}

/**
 * Loads a task definition and checks the availability of the resource.
 * If all is free, it lock the resource already.
 */
const loadTask = async (name) => {
    const taskPath = path.join(state.tasksPath, name)
    const task = {
        name,
        path: taskPath,
        isAvailable: false,
        unlockResource: () => {},
        data: {},
    }

    try {
        task.data = await fs.readJSON(taskPath)
        const resourceLockName = `${task.data.space}/${task.data.uuid}/${task.data.originalFileNameHashed}.stuff`
        
        // Check on the resource lock name
        task.isAvailable = isFree(resourceLockName)
        if (task.isAvailable) {
            task.unlockResource = lock(resourceLockName)
        }
        
        return task
    } catch (err) {
        console.log(`ERROR: failed load task: ${name} - ${err.message}`)
        return task
    }
}

/**
 * Iterates through the available tasks and searches for a task that is
 * free, checking in-memory locking for both task name, and target resource name
 */
const getNextTask = () => new Promise(async (resolve, reject) => {
    const files = await fs.readdir(state.tasksPath)
    let currentIdx = 0
    let taskWasFound = false

    const testFn = () =>
        taskWasFound === false && currentIdx < files.length

    const iterateeFn = async (next) => {
        const file = files[currentIdx]
        const taskName = `task/${file}`
        currentIdx += 1

        // In memory lock, skip the task
        if (!isFree(taskName)) {
            next()
            return
        }

        // Good candidate, lock it and check task details
        const unlockTask = lock(taskName)
        const taskData = await loadTask(file)

        // If the details says "not available" we let the task 
        if (!taskData.isAvailable) {
            next()
            return
        }

        // Release the search with the task candidate already locked
        // and with the function to unlock it in memory
        taskWasFound = true
        next(null, {
            ...taskData,
            unlockTask,
        })
    }

    whilst(testFn, iterateeFn, (err, task) => err ? reject(err) : resolve(task))
})

// 1. pick a definition from the tasks folder
// 2. executes it
const loop = async () => {
    try {
        // Gets next unclaimed task with an available resource
        const task = await getNextTask()
        if (!task) {
            state.timer = setTimeout(loop, state.intervalOnEmpty)
            return
        }

        // Gets the task resources and run the logic.
        const sourceFilePath = await resolveFile(task.data.space, task.data.uuid, task.data.originalFileName)
        const destFilePath = await computeFile(task.data.space, task.data.uuid, task.data.fileName)
        await processorExec(task.data.rule, sourceFilePath, destFilePath, task.data)

        // Cancel the memory locks and remove the task
        task.unlockResource()
        task.unlockTask()
        await fs.unlink(task.path)

        state.timer = setTimeout(loop, state.interval)
    } catch (err) {
        console.log(`ERROR: postprocess looop - ${err.message}`)
        state.timer = setTimeout(loop, state.intervalOnError)
    }
}

export const start = ({ tasksPath }) => {
    state.tasksPath = tasksPath
    loop()
}

