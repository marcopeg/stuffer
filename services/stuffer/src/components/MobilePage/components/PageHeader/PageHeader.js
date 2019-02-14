import React from 'react'
import PropTypes from 'prop-types'
import { getThemeStyle, getThemeVar } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const getWrapperStyle = (theme, mode) => {
    const styles = getThemeStyle(theme.name, 'PageHeader')
    return {
        ...styles.wrapper,
        ...styles[`wrapper--${mode}`],
        height: getThemeVar(theme.name, 'headerHeight'),
    }
}

const getInnerStyle = (theme, mode) => {
    const styles = getThemeStyle(theme.name, 'PageHeader')
    return {
        ...styles.inner,
        ...styles[`inner--${mode}`],
    }
}

const PageHeader = ({ children, mode }) => (
    <ThemeContext.Consumer>
        {theme => (
            <div style={getWrapperStyle(theme, mode)}>
                <div style={getInnerStyle(theme, mode)}>
                    {children}
                </div>
            </div>
        )}
    </ThemeContext.Consumer>
)

// necessary to detect the presence inside the MobilePage wrapper
PageHeader.displayName = 'PageHeader'

PageHeader.propTypes = {
    children: PropTypes.any, // eslint-disable-line
    mode: PropTypes.oneOf([ 'dark', 'light' ]),
}

PageHeader.defaultProps = {
    mode: 'light',
}

export default PageHeader
