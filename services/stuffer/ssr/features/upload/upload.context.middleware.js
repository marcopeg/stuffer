import uuid from 'uuid/v4'

export default options => ({
    name: 'context',
    priority: 100,
    handler: (req, res, next) => {
        req.data.upload = {
            space: 'public',
            uuid: uuid(),
        }
        next()
    },
})
