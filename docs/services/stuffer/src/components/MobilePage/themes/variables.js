import { variables as antd } from './theme.antd'
import { variables as white } from './theme.white'
import { variables as dark } from './theme.dark'
import { variables as c1 } from './theme.c1'

export const defaults = {
    headerHeight: 60,
    footerHeight: 60,
    VSpace: 10,
    HSpace: 10,
    text__small: 12,
    text__normal: 16,
    text__big: 20,
    borderRadius: 5,
    dividerSizeXS: '20%',
    dividerSizeSM: '35%',
    dividerSizeMD: '50%',
    dividerSizeLG: '65%',
    dividerSizeXL: '80%',
}

export const variables = {
    ___: defaults,
    antd,
    white,
    dark,
    c1,
}

export const getThemeVar = (theme, name) => {
    let v1
    // eslint-disable-next-line
    try { v1 = variables[theme][name] } catch (err) {}
    if (v1 !== undefined) return v1
    if (variables.___[name] !== undefined) return variables.___[name]
    console.error(`[MobilePage] themes.getThemeVar("${name}") is not defined`)
}
