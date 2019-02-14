import { getThemeVar } from '../../themes/variables'

export default {
    wrapper: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderRadius: getThemeVar('___', 'borderRadius'),
    },
    item: {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'transparent',
    },
    firstItem: {},
    lastItem: {
        borderBottom: 'none',
    },
}
