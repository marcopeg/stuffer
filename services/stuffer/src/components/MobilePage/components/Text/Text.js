import React from 'react'
import PropTypes from 'prop-types'
import { getThemeStyle } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const getStyle = (theme, type, size, override = {}) => {
    const style = getThemeStyle(theme, 'Text')
    return {
        ...style.wrapper,
        ...(style[`wrapper--${type}`] || {}),
        ...(style[`wrapper--${size}`] || {}),
        ...override,
    }
}

const Text = ({ children, type, size, style, ...props }) => (
    <ThemeContext.Consumer>
        {theme => (
            <p
                {...props}
                style={getStyle(theme.name, type, size, style)}
            >
                {children}
            </p>
        )}
    </ThemeContext.Consumer>
)

Text.propTypes = {
    type: PropTypes.oneOf([ 'primary', 'secondary', 'success', 'warning', 'danger' ]),
    size: PropTypes.oneOf([ 'xs', 'sm', 'md', 'lg', 'xl' ]),
    style: PropTypes.object,
    children: PropTypes.any, // eslint-disable-line
}

Text.defaultProps = {
    type: 'primary',
    size: 'md',
    style: {},
}

export default Text
