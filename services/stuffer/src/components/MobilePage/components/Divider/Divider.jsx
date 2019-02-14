import React from 'react'
import PropTypes from 'prop-types'
import { getThemeStyle, getThemeVar } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const getStyle = (theme, override = {}) => ({
    ...getThemeStyle(theme, 'Divider'),
    ...override,
})

const Divider = ({ children, size, width, style, ...props }) => (
    <ThemeContext.Consumer>
        {theme => (
            <hr
                width={size ? getThemeVar(theme.name, `dividerSize${size.toUpperCase()}`) : width}
                {...props}
                style={getStyle(theme.name, style)}
            />
        )}
    </ThemeContext.Consumer>
)

Divider.propTypes = {
    children: PropTypes.any, // eslint-disable-line
    size: PropTypes.oneOf([ 'xs', 'sm', 'md', 'lg', 'xl' ]),
    width: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

Divider.defaultProps = {
    size: null,
    width: '100%',
}

export default Divider
