/**
 * Validates the overall size of the upload attempt.
 * This can block an upload before anything gets written to disk.
 *
 * @TODO: let extensions dynamically change the $maxSize so that it
 * could be changed based on the user that is making the request?
 */
export default options => ({
    name: 'sizeLimit',
    priority: 200,
    handler: (req, res, next) => {
        if (req.headers['content-length'] > options.maxSize) {
            res.send(413, `Max upload size set to: ${options.maxSize}`)
        } else {
            next()
        }
    },
})
