/**
 * Cherry pick icons that are needed in the app.
 *
 * @TODO: right not this adds ~1MB to the production bundle!
 * we need to implement custom icons or to import mjs somehow.
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from '../../MobilePage'

import {
    FaAngleRight,
    FaCheck,
    FaPlay,
    FaPause,
    FaTimes,
} from 'react-icons/fa'

const mapping = {
    AngleRight: FaAngleRight,
    Check: FaCheck,
    Play: FaPlay,
    Pause: FaPause,
    Stop: FaTimes,
}

const Icon = ({ name, ...props }) => (
    <ThemeContext.Consumer>
        {theme => {
            return mapping[name]
                ? React.createElement(mapping[name], props)
                : <span>{name}</span>
        }}
    </ThemeContext.Consumer>
)

Icon.propTypes = {
    name: PropTypes.oneOf([
        'AngleRight',
        'Check',
        'Pause',
        'Play',
        'Stop',
    ]),
}

Icon.defaultProps = {
    name: '',
}

export default Icon
