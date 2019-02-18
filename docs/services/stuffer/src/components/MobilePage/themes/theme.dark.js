// https://coolors.co/d8a720-52557f-37b291-e25434-bf1e36
import './theme.dark.css'

export const colors = {
    primary: '#E25434',
    darkPrimary: '#B9452B',
    lightPrimary: '#E77358',
    text: '#141414',
    textPrimary: '#EEE',
    textSecondary: '#FFF',
    accent: '#03A9F4',
    divider: '#666666',

    // additional colors
    lightText: '#333',
}

export const variables = {
    headerHeight: 90,
}

export default {
    MobilePage: {
        wrapper: {
            backgroundColor: colors.text,
            color: colors.textPrimary,
        },
    },
    PageHeader: {
        wrapper: {
            backgroundColor: colors.lightText,
            color: colors.textPrimary,
        },
    },
    PageFooter: {
        wrapper: {
            backgroundColor: colors.lightText,
            color: colors.textPrimary,
        },
    },
    Divider: {
        color: colors.divider,
        backgroundColor: colors.divider,
    },
    Button: {
        wrapper: {
            transition: 'all 0.2s ease',
        },
        'wrapper--primary': {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            color: colors.text,
        },
        'wrapper--primary--active': {
            backgroundColor: colors.lightPrimary,
            color: colors.text,
        },
        'wrapper--secondary': {
            borderColor: colors.primary,
            color: colors.primary,
        },
        'wrapper--secondary--active': {
            backgroundColor: colors.lightPrimary,
        },
        'wrapper--link': {
            color: colors.primary,
        },
        'wrapper--link--active': {
            backgroundColor: colors.lightPrimary,
        },
    },
    List: {
        wrapper: {
            borderColor: colors.divider,
        },
        item: {
            borderBottomColor: colors.divider,
        },
    },
    Loading: {
        spinner: {
            color: colors.divider,
        },
    },
}
