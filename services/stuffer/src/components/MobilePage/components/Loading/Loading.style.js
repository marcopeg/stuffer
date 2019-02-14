import { getThemeVar } from '../../themes/variables'
import { flexCentered } from '../../lib/mixins'

export default {
    wrapper: {
        ...flexCentered,
        display: 'inline-flex',
        marginBottom: getThemeVar('___', 'VSpace') / 2,
        overflow: 'hidden',
    },
    'wrapper--block': {
        display: 'flex',
    },
    'wrapper--small': {
        width: 30,
        height: 25,
    },
    'wrapper--normal': {
        width: 60,
        height: 35,
    },
    'wrapper--big': {
        width: 60,
        height: 50,
    },

    spinner: {},
    'spinner--small': {
        width: 30,
        height: 10,
    },
    'spinner--normal': {
        width: 60,
        height: 25,
    },
    'spinner--big': {
        width: 60,
        height: 40,
    },
}
