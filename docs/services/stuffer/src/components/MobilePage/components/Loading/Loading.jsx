import React from 'react'
import PropTypes from 'prop-types'
import ReactSpinner from 'react-loader-spinner'
import { getThemeStyle } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const Loading = ({ children, type, size, block, style, ...props }) => (
    <ThemeContext.Consumer>
        {theme => {
            const styles = getThemeStyle(theme.name, 'Loading')
            const wrapper = {
                ...styles.wrapper,
                ...(block ? styles['wrapper--block'] : {}),
                ...(styles[`wrapper--${size}`] || {}),
                ...style,
            }
            const spinner = {
                ...styles.spinner,
                ...(styles[`spinner--${size}`] || {}),
            }
            return (
                <div
                    {...props}
                    style={wrapper}
                >
                    <ReactSpinner
                        type={type}
                        color={spinner.color}
                        width={spinner.width}
                        height={spinner.height}
                    />
                </div>
            )
        }}
    </ThemeContext.Consumer>
)

Loading.propTypes = {
    type: PropTypes.oneOf([
        'Audio',
        'Ball-Triangle',
        'Bars',
        'Circles',
        'Grid',
        'Hearts',
        'Oval',
        'Puff',
        'Rings',
        'TailSpin',
        'ThreeDots',
    ]),
    size: PropTypes.oneOf([
        'small',
        'normal',
        'big',
    ]),
    block: PropTypes.bool,
    style: PropTypes.object,
}

Loading.defaultProps = {
    type: 'Oval',
    size: 'normal',
    block: false,
    style: {},
}

export default Loading
