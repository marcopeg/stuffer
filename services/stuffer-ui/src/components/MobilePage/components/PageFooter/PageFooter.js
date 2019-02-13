import React from 'react'
import PropTypes from 'prop-types'
import { getThemeStyle, getThemeVar } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const getWrapperStyle = (theme, mode) => {
    const styles = getThemeStyle(theme.name, 'PageFooter')
    return {
        ...styles.wrapper,
        ...styles[`wrapper--${mode}`],
        height: getThemeVar(theme.name, 'headerHeight'),
    }
}

const getInnerStyle = (theme, mode, withPadding) => {
    const styles = getThemeStyle(theme.name, 'PageFooter')
    const style = {
        ...styles.inner,
        ...styles[`inner--${mode}`],
    }

    // apply padding
    if (withPadding) {
        style.marginLeft = getThemeVar(theme.name, 'HSpace')
        style.marginRight = getThemeVar(theme.name, 'HSpace')
        style.marginTop = getThemeVar(theme.name, 'VSpace')
        style.marginBottom = getThemeVar(theme.name, 'VSpace')
    }

    return style
}

const PageFooter = ({ children, mode, withPadding }) => (
    <ThemeContext.Consumer>
        {theme => (
            <div style={getWrapperStyle(theme, mode)}>
                <div style={getInnerStyle(theme, mode, withPadding)}>
                    {children}
                </div>
            </div>
        )}
    </ThemeContext.Consumer>
)

// necessary to detect the presence inside the MobilePage wrapper
PageFooter.displayName = 'PageFooter'

PageFooter.propTypes = {
    children: PropTypes.any, // eslint-disable-line
    mode: PropTypes.oneOf([ 'dark', 'light' ]),
    withPadding: PropTypes.bool,
}

PageFooter.defaultProps = {
    mode: 'light',
    withPadding: false,
}

export default PageFooter
