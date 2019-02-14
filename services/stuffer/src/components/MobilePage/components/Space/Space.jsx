import React from 'react'
import PropTypes from 'prop-types'
import { getThemeStyle } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const Space = ({ type, ...props }) => (
    <ThemeContext.Consumer>
        {theme => (
            <div style={getThemeStyle(theme.name, 'space')[type]} />
        )}
    </ThemeContext.Consumer>
)

Space.propTypes = {
    type: PropTypes.oneOf([ 'vertical', 'horizontal' ]),
}

Space.defaultProps = {
    type: 'vertical',
}

export default Space
