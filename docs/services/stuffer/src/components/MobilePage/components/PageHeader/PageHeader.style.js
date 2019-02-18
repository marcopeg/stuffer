import { getThemeVar } from '../../themes/variables'

export default {
    wrapper: {
        display: 'flex',
        height: getThemeVar('___', 'headerHeight'),
    },
    inner: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'transparent',
        fontWeight: 300,
    },
    'wrapper--light': {},
    'wrapper--dark': {},
    'inner--light': {},
    'inner--dark': {},
}
