import './theme.c1.css'

export const colors = {
    primary: '#9C27B0',
    darkPrimary: '#7B1FA2',
    lightPrimary: '#E1BEE7',
    text: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#757575',
    accent: '#009688',
    divider: '#E1BEE7',
}

export const variables = {}

export default {
    MobilePage: {
        wrapper: {
            backgroundColor: colors.primary,
            color: colors.text,
        },
    },
    Divider: {
        borderColor: colors.divider,
    },
    Button: {
        wrapper: {
            transition: 'all 0.2s ease',
        },
        'wrapper--primary': {
            backgroundColor: colors.lightPrimary,
            borderColor: colors.lightPrimary,
            color: colors.primary,
        },
        'wrapper--primary--active': {
            backgroundColor: colors.primary,
            color: colors.text,
        },
        'wrapper--secondary': {
            borderColor: colors.text,
            color: colors.text,
        },
        'wrapper--secondary--active': {
            backgroundColor: colors.lightPrimary,
        },
        'wrapper--link': {
            color: colors.text,
        },
        'wrapper--link--active': {
            backgroundColor: colors.lightPrimary,
        },
    },
    List: {
        wrapper: {
            borderColor: colors.lightPrimary,
        },
        item: {
            borderBottomColor: colors.lightPrimary,
        },
    },
    Loading: {
        spinner: {
            color: colors.lightPrimary,
        },
    },
}
