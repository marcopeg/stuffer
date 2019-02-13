import React from 'react'
import PropTypes from 'prop-types'
import { getThemeStyle } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const getStyle = (theme, type, size, override = {}) => {
    const style = getThemeStyle(theme, 'Title')
    return {
        ...style.wrapper,
        ...(style[`wrapper--${type}`] || {}),
        ...(style[`wrapper--${size}`] || {}),
        ...override,
    }
}

const Title = ({ children, level, type, size, style, ...props }) => (
    <ThemeContext.Consumer>
        {theme =>
            React.createElement(`h${level}`, {
                ...props,
                style: getStyle(theme.name, type, size, style),
            }, children)
        }
    </ThemeContext.Consumer>
)

Title.propTypes = {
    level: PropTypes.oneOf([ 1, 2, 3, 4, 5, 6 ]),
    type: PropTypes.oneOf([ 'primary', 'secondary', 'success', 'warning', 'danger' ]),
    size: PropTypes.oneOf([ 'xs', 'sm', 'md', 'lg', 'xl' ]),
    style: PropTypes.object,
    children: PropTypes.any, // eslint-disable-line
}

Title.defaultProps = {
    level: 1,
    type: 'primary',
    size: 'md',
    style: {},
}

export default Title
