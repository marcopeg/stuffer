import { getThemeVar } from '../../themes/variables'

export default {
    vertical: {
        marginTop: getThemeVar('___', 'VSpace') / 2,
        marginBottom: getThemeVar('___', 'VSpace') / 2,
    },
    horizontal: {
        marginLeft: getThemeVar('___', 'HSpace') / 2,
        marginRight: getThemeVar('___', 'HSpace') / 2,
    },
}
