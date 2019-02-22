
export default ({ publicSpace }) => ({
    name: 'context',
    priority: 100,
    handler: (req, res, next) => {
        req.data.upload = {
            space: publicSpace,
        }
        next()
    },
})
