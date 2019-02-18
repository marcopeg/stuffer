import fs from 'fs-extra'

export const handler = ({ base }) => async ({ file }) => {
    file.metaPath = [
        base,
        'meta',
        file.space,
        `${file.uuid}.json`,
    ].join('/')

    // Read file meta
    try {
        file.meta = await fs.readJson(file.metaPath)
    } catch (err) {
        file.exists = false
        return file.errors.push({
            type: 'meta',
            details: 'can not read meta',
            originalError: err,
        })
    }
}
