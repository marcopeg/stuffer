/**
 * Hooks into the upload feature and calculates the final url and
 * informations to the file retrieve.
 */

import prettyBytes from 'pretty-bytes'
import urlencode from 'urlencode'

export const handler = settings => async ({ files, errors, options }) => {
    const { mountPoint } = settings
    const serverUrl = `${settings.baseUrl}${mountPoint === '/' ? '' : mountPoint}`

    for (const field in files) {
        const file = files[field]

        const baseUrl = [
            serverUrl,
            urlencode(file.space),
            urlencode(file.uuid),
        ].join('/')

        files[field] = {
            fileName: file.fileName,
            checksum: file.meta.checksum,
            mimeType: file.mimeType,
            encoding: file.encoding,
            size: prettyBytes(file.bytesWritten),
            bytes: file.bytesWritten,
            url: {
                base: baseUrl,
                original: [ baseUrl, urlencode(file.fileName) ].join('/'),
            },
            meta: file.meta.data,
        }

        // Add the file variants urls
        Object.keys(file.fileVariants).forEach(key =>
            files[field].url[key] = [ baseUrl, urlencode(file.fileVariants[key]) ].join('/')
        )
    }
}
