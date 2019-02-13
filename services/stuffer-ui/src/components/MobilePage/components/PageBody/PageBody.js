import React from 'react'
import PropTypes from 'prop-types'
import ContainerDimension from 'react-container-dimensions'
import { getThemeStyle, getThemeVar } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const getWrapperStyle = (theme, { noScroll, flex }) => {
    const headerHeight = getThemeVar(theme.name, 'headerHeight')
    const footerHeight = getThemeVar(theme.name, 'footerHeight')
    const style = { ...getThemeStyle(theme.name, 'PageBody').wrapper }

    // flexbox body
    if (flex) {
        style.display = 'flex'
    }

    // scrolling
    if (!noScroll) {
        style.overflow = 'scroll'
        style.WebkitOverflowScrolling = 'touch'
    }

    // header & footer spacing
    const wrapperHeight = theme.height || '100%'
    if (theme.hasHeader && theme.hasFooter) {
        style.height = `calc(${wrapperHeight} - ${headerHeight}px - ${footerHeight}px)`
    } else if (theme.hasHeader) {
        style.height = `calc(${wrapperHeight} - ${headerHeight}px)`
    } else if (theme.hasFooter) {
        style.height = `calc(${wrapperHeight} - ${footerHeight}px)`
    } else {
        style.height = wrapperHeight
    }

    return style
}

const getInnerStyle = (theme, { withPadding, flex }) => {
    const style = { ...getThemeStyle(theme.name, 'PageBody').inner }

    // apply padding
    if (withPadding) {
        style.marginLeft = getThemeVar(theme.name, 'HSpace')
        style.marginRight = getThemeVar(theme.name, 'HSpace')
        style.marginTop = getThemeVar(theme.name, 'VSpace')
        style.marginBottom = getThemeVar(theme.name, 'VSpace')
    }

    // flexbox body
    if (flex) {
        style.flex = 1
        style.display = 'flex'
    }

    return style
}

const MobilePageBody = ({ children, ...props }) => {
    return (
        <ThemeContext.Consumer>
            {theme => {
                const content = typeof children === 'function'
                    ? (
                        <ContainerDimension>
                            {(dimensions) =>
                                React.createElement(children, {
                                    ...dimensions,
                                    theme,
                                })
                            }
                        </ContainerDimension>
                    )
                    : (
                        <div style={getInnerStyle(theme, props)}>
                            {children}
                        </div>
                    )

                return (
                    <div style={getWrapperStyle(theme, props)}>
                        {content}
                    </div>
                )
            }}
        </ThemeContext.Consumer>
    )
}

// necessary to detect the presence inside the MobilePage wrapper
MobilePageBody.displayName = 'MobilePageBody'

MobilePageBody.propTypes = {
    children: PropTypes.any.isRequired, // eslint-disable-line
    noScroll: PropTypes.bool,
    withPadding: PropTypes.bool,
    flex: PropTypes.bool,
}

MobilePageBody.defaultProps = {
    noScroll: false,
    withPadding: false,
    flex: false,
}

export default MobilePageBody
