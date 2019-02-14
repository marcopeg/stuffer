import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'components/MobilePage'
import { getThemeStyle } from '../../themes'
import { ThemeContext } from '../../MobilePage'

const ListItem = ({ children, onDisclose }) => (
    <ThemeContext.Consumer>
        {theme => (
            <div
                style={getThemeStyle(theme.name, 'ListItem').wrapper}
                onClick={onDisclose}
            >
                <div style={getThemeStyle(theme.name, 'ListItem').body}>{children}</div>
                {onDisclose ? (
                    <div style={getThemeStyle(theme.name, 'ListItem').handler}>
                        <Icon name="AngleRight" />
                    </div>
                ) : null}
            </div>
        )}
    </ThemeContext.Consumer>
)

ListItem.propTypes = {
    children: PropTypes.any.isRequired, // eslint-disable-line
    onDisclose: PropTypes.func,
}

ListItem.defaultProps = {
    onDisclose: null,
}

export default ListItem
