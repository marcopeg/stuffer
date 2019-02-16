/**
 * Just send a file out
 */

// import { createHook } from '@marcopeg/hooks'
// import { DOWNLOAD_CONTEXT } from '../hooks'

export default options => ({
    name: 'out',
    priority: 9999,
    handler: async (req, res) => {
        res.send({
            data: req.data,
            params: req.params,
            query: req.query,
            // keys: Object.keys(req),
        })
    },
})

