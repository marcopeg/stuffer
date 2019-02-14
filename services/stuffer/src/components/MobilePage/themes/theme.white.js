import './theme.white.css'

export const colors = {
    primary: '#2196F3',
    darkPrimary: '#0073cc',
    lightPrimary: '#4fb2ff',
    text: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#757575',
    accent: '#03A9F4',
    divider: '#BDBDBD',
    success: 'green',
    warning: 'orange',
    danger: 'red',
}

export const variables = {
    headerHeight: 45,
    footerHeight: 45,
    borderRadius: 3,
    fontSize: 14,
}

export default {
    MobilePage: {
        wrapper: {
            backgroundColor: colors.text,
            color: colors.textPrimary,
        },
    },
    PageHeader: {
        'wrapper--light': {
            color: colors.textPrimary,
        },
        'wrapper--dark': {
            backgroundColor: colors.primary,
            color: colors.text,
        },
        'inner--light': {
            borderBottomColor: colors.divider,
        },
    },
    PageFooter: {
        'wrapper--light': {
            color: colors.textPrimary,
        },
        'wrapper--dark': {
            backgroundColor: colors.primary,
            color: colors.text,
        },
        'inner--light': {
            borderTopColor: colors.divider,
        },
    },
    Divider: {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderColor: colors.divider,
    },
    Button: {
        wrapper: {
            transition: 'all 0.2s ease',
            borderRadius: variables.borderRadius,
            fontWeight: 300,
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
    Input: {
        input: {
            fontWeight: 300,
        },
    },
    Text: {
        'wrapper--primary': { color: colors.textPrimary },
        'wrapper--secondary': { color: colors.primary },
        'wrapper--success': { color: colors.success },
        'wrapper--warning': { color: colors.warning },
        'wrapper--danger': { color: colors.danger },
        'wrapper--xs': { fontSize: variables.fontSize * 0.7 },
        'wrapper--sm': { fontSize: variables.fontSize * 0.85 },
        'wrapper--md': { fontSize: variables.fontSize },
        'wrapper--lg': { fontSize: variables.fontSize * 1.15 },
        'wrapper--xl': { fontSize: variables.fontSize * 1.3 },
    },
    Title: {
        'wrapper--primary': { color: colors.textPrimary },
        'wrapper--secondary': { color: colors.primary },
        'wrapper--success': { color: colors.success },
        'wrapper--warning': { color: colors.warning },
        'wrapper--danger': { color: colors.danger },
        'wrapper--xs': { fontSize: variables.fontSize * 0.7 },
        'wrapper--sm': { fontSize: variables.fontSize * 0.85 },
        'wrapper--md': { fontSize: variables.fontSize },
        'wrapper--lg': { fontSize: variables.fontSize * 1.15 },
        'wrapper--xl': { fontSize: variables.fontSize * 1.3 },
    },
}
