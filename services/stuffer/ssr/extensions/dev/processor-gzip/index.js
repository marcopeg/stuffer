/**
 * TEST PROCESSOR
 */
import path from 'path'
import { REGISTER_PROCESSORS } from 'features/postprocess/hooks'

export const register = ({ registerAction }) =>
    registerAction({
        hook: REGISTER_PROCESSORS,
        name: 'processor--gzip--extension',
        handler: ({ registerProcessor }) => registerProcessor({
            name: 'gzip',
            fileName: file => `${file.fileName}.zip`,
            handler: (file) => {
                console.log('*** MAKE GZIP', file)
            },
        }),
    })
