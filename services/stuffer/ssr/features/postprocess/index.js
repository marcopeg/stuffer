import urlencode from 'urlencode'

import { INIT_FEATURE, START_FEATURE } from '@marcopeg/hooks'
import { UPLOAD_MIDDLEWARES, UPLOAD_COMPLETED, UPLOAD_FILE_INFO, UPLOAD_FILE_META } from 'features/upload/hooks'
import { DOWNLOAD_FILE_INFO } from 'features/download/hooks'
import { FEATURE_NAME } from './hooks'

import { handler as initHandler } from './init.handler'
import { handler as startHandler } from './start.handler'
import { handler as uploadCompletedHandler } from './upload-completed.handler'
import uploadVariantsMid from './upload.variants.middleware'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: INIT_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: initHandler,
    })
    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: startHandler,
    })

    // upload: extend the file info with an empty list of variants
    registerAction({
        hook: UPLOAD_FILE_INFO,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ fileInfo }) => {
            fileInfo.variants = []
        },
    })

    // upload: add the variants informations to the file meta
    registerAction({
        hook: UPLOAD_FILE_META,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ file, fileMeta }) => {
            fileMeta.variants = file.variants
        },
    })

    // download: decorate the file info with the variants urls
    registerAction({
        hook: DOWNLOAD_FILE_INFO,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ baseUrl, fileInfo, fileManifest }) => {
            fileInfo.variants.forEach(variant => {
                const fileName = urlencode(variant.fileName)
                fileManifest.url[variant.rule] = [ baseUrl, fileName ].join('/')
            })
        },
    })

    registerAction({
        hook: UPLOAD_MIDDLEWARES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ addUploadMiddleware }) => {
            addUploadMiddleware(uploadVariantsMid(settings))
        },
    })

    registerAction({
        hook: UPLOAD_COMPLETED,
        name: FEATURE_NAME,
        trace: __filename,
        handler: uploadCompletedHandler(settings),
    })
}
