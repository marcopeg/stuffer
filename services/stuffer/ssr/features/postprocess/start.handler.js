import path from 'path'
import fs from 'fs-extra'
import { start as startDaemon } from './daemon'

export const handler = async ({ postprocess }) => {
    const tasksPath = path.join(postprocess.base, 'tasks')
    await fs.ensureDir(tasksPath)
    startDaemon({
        tasksPath,
    })
}
