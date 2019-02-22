import { verify as verifyJwt } from 'ssr/services/jwt'

export default (settings) => ({ addDownloadMiddleware }) => {
    const { isAnonymousDownloadEnabled, isCrossSpaceDownloadEnabled } = settings.auth
    addDownloadMiddleware({
        name: 'validate-auth',
        priority: 150,
        handler: async (req, res, next) => {
            const auth = {
                token: null,
                space: null,
            }

            // Validate JWT token
            try {
                const jwt = req.query['__auth'] || req.headers.authorization
                if (jwt) {
                    auth.token = jwt.split(' ').pop()
                    auth.space = (await verifyJwt(auth.token)).space
                }
            } catch (err) {
                res.status(403).send('Access denied for Bearer')
                return
            }

            // Block anonymous download
            if (!isAnonymousDownloadEnabled && !auth.space) {
                res.status(403).send('Access denied for @anonymous')
                return
            }

            // Block cross space download
            if (!isAnonymousDownloadEnabled && !isCrossSpaceDownloadEnabled && auth.space !== req.data.download.space) {
                res.status(403).send('Access denied')
                return
            }

            req.data.auth = auth
            next()
        },
    })
}
