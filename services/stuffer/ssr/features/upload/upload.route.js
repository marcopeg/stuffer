/**
 * Collects the results of an upload request and let other features
 * deal with the output.
 *
 */

import { createHook } from '@marcopeg/hooks'
import { UPLOAD_COMPLETED } from './hooks'

export const uploadRoute = options => async (req, res) => {
    const results = {
        files: req.data.upload.form.files,
        errors: req.data.upload.form.errors,
    }

    await createHook(UPLOAD_COMPLETED, {
        async: 'serie',
        args: {
            options: { ...options },
            ...results,
            req,
            res,
        },
    })

    res.send({
        files: Object.keys(results.files).map(field => ({
            field,
            ...results.files[field],
        })),
        errors: results.errors,
    })
}
