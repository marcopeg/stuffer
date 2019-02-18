import React from 'react'
import PropTypes from 'prop-types'
import { getThemeStyle } from '../../themes'
import { ThemeContext } from '../../MobilePage'
import ListItem from './ListItem'
import Title from '../Title'
import Text from '../Text'

const getItemStyle = (theme, items, item, index) => {
    if (index === 0) {
        return {
            ...getThemeStyle(theme, 'List').item,
            ...getThemeStyle(theme, 'List').firstItem,
        }
    }

    if (index === items.length - 1) {
        return {
            ...getThemeStyle(theme, 'List').item,
            ...getThemeStyle(theme, 'List').lastItem,
        }
    }

    return getThemeStyle(theme, 'List').item
}

const List = ({ keyProp, titleProp, subtitleProp, items, renderItem, onDisclose }) => (
    <ThemeContext.Consumer>
        {theme => (
            <div style={getThemeStyle(theme.name, 'List').wrapper}>
                {items.map((item, index) => (
                    renderItem ? (
                        <div
                            key={item[keyProp]}
                            style={getItemStyle(theme.name, items, item, index)}
                            onDisclose={() => onDisclose(item)}
                        >
                            renderItem(item)
                        </div>
                    ) : (
                        <div
                            key={item[keyProp]}
                            style={getItemStyle(theme.name, items, item, index)}
                        >
                            <ListItem
                                isActive={item.isActive}
                                onDisclose={onDisclose ? () => onDisclose(item) : null}
                            >
                                {subtitleProp ? <Title>{item[titleProp]}</Title> : item[titleProp]}
                                {subtitleProp ? <Text>{item[subtitleProp]}</Text> : null}
                            </ListItem>
                        </div>
                    )
                ))}
            </div>
        )}
    </ThemeContext.Consumer>
)

List.propTypes = {
    keyProp: PropTypes.string,
    titleProp: PropTypes.string,
    subtitleProp: PropTypes.string,
    items: PropTypes.array.isRequired,
    renderItem: PropTypes.func,
    onDisclose: PropTypes.func,
}

List.defaultProps = {
    keyProp: 'id',
    titleProp: 'title',
    subtitleProp: null,
    renderItem: null,
    onDisclose: null,
}

List.Item = ListItem

export default List
