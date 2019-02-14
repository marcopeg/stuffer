/* eslint react/prefer-stateless-function: off */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { getThemeStyle } from '../../themes'
import { ThemeContext } from '../../MobilePage'

// eslint-disable-next-line
const getStyle = (theme, type, size, block, active, style) => {
    const button = getThemeStyle(theme, 'Button')
    return {
        ...button.wrapper,
        ...button[`wrapper--${type}`],
        ...(active ? (button[`wrapper--${type}--active`] || {}) : {}),
        ...button[`wrapper--${size}`],
        ...(block ? button['wrapper--block'] : {}),
        ...style,
    }
}

class Button extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            isClicked: false,
        }
    }

    componentWillUnmount () {
        clearTimeout(this.timer)
    }

    onClick = () => {
        if (this.props.onClick) {
            this.props.onClick()
        }
        this.setState({ isClicked: true })
        this.timer = setTimeout(() => this.setState({ isClicked: false }), 200)
    }

    render () {
        const { children, type, block, linkTo, size, className, style, ...props } = this.props
        return (
            <ThemeContext.Consumer>
                {theme => {
                    const buttonProps = {
                        ...props,
                        className: `mbp-cmp-button ${className}`,
                        style: getStyle(theme.name, type, size, block, this.state.isClicked, style),
                        onClick: this.onClick,
                    }

                    const buttonContent = children || linkTo

                    return linkTo
                        ? <Link {...buttonProps} to={linkTo}>{buttonContent}</Link>
                        : <button {...buttonProps}>{buttonContent}</button>
                }}
            </ThemeContext.Consumer>
        )
    }
}

Button.propTypes = {
    children: PropTypes.any, // eslint-disable-line
    type: PropTypes.oneOf([ 'primary', 'secondary', 'link' ]),
    size: PropTypes.oneOf([ 'small', 'normal', 'big' ]),
    block: PropTypes.bool,
    linkTo: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
}

Button.defaultProps = {
    type: 'primary',
    size: 'normal',
    block: false,
    linkTo: null,
    onClick: null,
    className: '',
    style: {},
}

export default Button
