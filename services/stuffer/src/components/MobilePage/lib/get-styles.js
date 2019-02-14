/**
 * Pick a property from a theme with memoization
 *
 */
import extend from 'extend'

const getStylesFactory = styles => {
    const getStyles = (theme, prop) => {
        const cacheName = `${theme}${prop}`
        if (getStyles[cacheName] !== undefined) {
            return getStyles[cacheName]
        }

        const baseStyle = styles.___
            ? (styles.___[prop] || {})
            : {}

        const themedStyle = (styles[theme][prop] || {})

        try {
            getStyles[cacheName] = extend(true, {}, baseStyle, themedStyle)
        } catch (e) {
            getStyles[cacheName] = {}
        }

        // console.log('get', theme, prop, getStyles[cacheName])
        return getStyles[cacheName]
    }

    return getStyles
}

export default getStylesFactory
