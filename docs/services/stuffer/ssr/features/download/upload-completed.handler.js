/**
 * Hooks into the upload feature and calculates the final url and
 * informations to the file retrieve.
 */

import prettyBytes from 'pretty-bytes'
import urlencode from 'urlencode'
import { createHook } from '@marcopeg/hooks'
import { DOWNLOAD_FILE_INFO } from './hooks'

export const handler = ({ download }) => async ({ files, errors, options }) => {
    const { mountPoint } = download
    const serverUrl = `${download.baseUrl}${mountPoint === '/' ? '' : mountPoint}`

    for (const field in files) {
        const file = files[field]

        const baseUrl = [
            serverUrl,
            urlencode(file.space),
            urlencode(file.uuid),
        ].join('/')

        files[field] = {
            fileName: file.fileName,
            space: file.space,
            uuid: file.uuid,
            checksum: file.meta.checksum,
            mimeType: file.mimeType,
            encoding: file.encoding,
            size: prettyBytes(file.bytesWritten),
            bytes: file.bytesWritten,
            url: {
                original: [ baseUrl, urlencode(file.fileName) ].join('/'),
            },
            meta: file.meta.data,
        }

        createHook(DOWNLOAD_FILE_INFO, { args: {
            baseUrl,
            fileInfo: file,
            fileManifest: files[field],
        }})
    }
}
