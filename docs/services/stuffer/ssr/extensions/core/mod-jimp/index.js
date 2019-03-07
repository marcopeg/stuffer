
import { DOWNLOAD_MODIFIERS } from 'features/download/hooks'
import { FEATURE_NAME } from './hooks'

import resizeModifier from './resize.modifier'
import filterModifier from './filter.modifier'

export const name = 'ModJimp'
export const register = ({ settings, registerAction }) => {
    registerAction({
        hook: DOWNLOAD_MODIFIERS,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ modifiers }) => {
            modifiers.resize = resizeModifier(settings)
            modifiers.filter = filterModifier(settings)
        },
    })
}
