import fs from 'fs-extra'

const getMetaName = file =>
    process.env.NODE_ENV === 'development'
        ? `${file.name}__meta.json`
        : 'meta.json'

export const handler = ({ base }) => async ({ file }) => {
    file.fullPath = [
        base,
        'files',
        file.space,
        file.uuid,
        file.name,
    ].join('/')

    file.metaPath = [
        base,
        'meta',
        file.space,
        file.uuid,
        getMetaName(file),
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
