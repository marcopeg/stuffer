/**
 * Just send a file out.
 * Any previous steps should have contributed in creating a "filePath"
 * that points to the thing that should actually handle the stream out.
 */

export default options => ({
    name: 'streamer',
    priority: 9999,
    handler: async (req, res) => {
        res.sendFile(req.data.download.filePath)
    },
})

