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
            name: file.name,
            checksum: file.meta.checksum,
            type: file.mimeType,
            encoding: file.encoding,
            size: prettyBytes(file.bytesWritten),
            bytes: file.bytesWritten,
            url: {
                base: baseUrl,
                original: [ baseUrl, urlencode(file.name) ].join('/'),
            },
            meta: file.meta.data,
        }
    }
}
