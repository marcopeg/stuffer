/**
 * Queue a single file for upload, generally this happens in response
 * to an upload that got correctly handled bu the "store" feature.
 */

import { push } from './pool'

export default ({ file }) =>
    push([
        file.space,
        file.uuid,
        `${file.meta.nameB64}.stuff`,
    ].join('/'))
