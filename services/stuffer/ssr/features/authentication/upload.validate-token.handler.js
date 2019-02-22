/**
 * It validates a JWT Token, the token should contain a "space"
 * if the token is valid, the upload will target that space.
 *
 * If the token is NOT VALID, an error will be thrown.
 *
 * In case NO TOKEN is provided, the upload may be accepted depending
 * on the "Public Upload" option being enabled, in that case it will
 * target the public fol
 */

import { verify as verifyJwt } from 'services/jwt'

export default (settings) => ({ addUploadMiddleware }) => {
    const { isAnonymousUploadEnabled } = settings.auth
    addUploadMiddleware({
        name: 'validate-auth',
        priority: 150,
        handler: async (req, res, next) => {
            const auth = {
                token: null,
                space: null,
            }

            // Validate JWT token
            try {
                if (req.headers.authorization) {
                    auth.token = req.headers.authorization.split(' ').pop()
                    auth.space = (await verifyJwt(auth.token)).space
                    req.data.upload.space = auth.space
                }
            } catch (err) {
                res.status(403).send('Access denied for Bearer')
                return
            }

            // Block upload to public space if globally disabled
            if (!auth.space && !isAnonymousUploadEnabled) {
                res.status(403).send('Access denied for @public')
                return
            }

            req.data.auth = auth
            next()
        },
    })
}
