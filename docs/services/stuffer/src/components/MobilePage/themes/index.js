// https://www.materialpalette.com/indigo/blue
import getStyles from '../lib/get-styles'

// basic components definitions
import MobilePage from '../MobilePage.style'
import PageHeader from '../components/PageHeader/PageHeader.style'
import PageFooter from '../components/PageFooter/PageFooter.style'
import PageBody from '../components/PageBody/PageBody.style'
import Title from '../components/Title/Title.style'
import Text from '../components/Text/Text.style'
import Space from '../components/Space/Space.style'
import Divider from '../components/Divider/Divider.style'
import Button from '../components/Button/Button.style'
import Input from '../components/Input/Input.style'
import List from '../components/List/List.style'
import ListItem from '../components/List/ListItem.style'
import Loading from '../components/Loading/Loading.style'

// teme variations
import antd from './theme.antd'
import white from './theme.white'
import dark from './theme.dark'
import c1 from './theme.c1'

export const availableThemes = [
    'antd',
    'white',
    'dark',
    'c1',
]

const styles = {
    ___: {
        MobilePage,
        PageHeader,
        PageFooter,
        PageBody,
        Title,
        Text,
        Space,
        Divider,
        Button,
        Input,
        List,
        ListItem,
        Loading,
    },
    antd,
    white,
    dark,
    c1,
}

export const getThemeStyle = getStyles(styles)
export { getThemeVar } from './variables'
