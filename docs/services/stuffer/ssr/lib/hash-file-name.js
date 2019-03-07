// @TODO: is short hash enough, or should we go for an sha1/256 or similar?

import shortHash from 'short-hash'
export const hashFileName = shortHash

// Old implementation was in a modified base64:
// export const hashFileName = (fileName) =>
//     Buffer
//         .from(fileName)
//         .toString('base64')
//         .replace(/\//g, '@')
        