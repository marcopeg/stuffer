import { runQuery } from 'features/network'
import { cookie, localStorage } from 'features/storage'
import localeQuery from './locale.query'
import { addLocale, setLocale } from './locale.reducer'

const isCacheValid = ctime => (dispatch, getState) => {
    const { locale } = getState()
    const { cacheDuration } = locale

    return (new Date() - new Date(ctime)) < cacheDuration
}

const localeExists = (desiredLocale) => (dispatch, getState) => {
    const { locale } = getState()
    const current = locale.locales[desiredLocale]

    if (!current) {
        return false
    }

    return dispatch(isCacheValid(current.ctime))
}

const getCurrentLocale = () => (dispatch, getState) => {
    const { locale } = getState()
    const cookieLocale = dispatch(cookie.get('locale', locale.locale))

    // translate from ssr compatible format stored in cookie
    const tokens = cookieLocale.toLowerCase().split('_')
    if (tokens.length === 1) {
        return tokens[0].toLowerCase()
    } else if (tokens[0] === tokens[1]) {
        return tokens[0]
    } else {
        return `${tokens[0]}-${tokens[1]}`
    }
}

const setCurrentLocale = (locale) => (dispatch) => {
    dispatch(setLocale(locale))

    // translate to ssr compatible format to be persisted in cookie
    const tokens = locale.split('-')
    const cookieLocale = [
        tokens[0].toLowerCase(),
        (tokens[1] ? tokens[1] : tokens[0]).toUpperCase(),
    ].join('_')

    dispatch(cookie.set('locale', cookieLocale))
}

const addLocaleData = (record) => (dispatch, getState) => {
    const { locale } = getState()
    const ctime = record.ctime || new Date()

    dispatch(addLocale(record.locale, record.messages, ctime))

    if (locale.cacheLocal === true) {
        dispatch(localStorage.setItem(`locale::cache::${record.locale}`, {
            ...record,
            ctime,
        }))
    }
}

export const fetchLocale = (locale) => async (dispatch) => {
    const res = await dispatch(runQuery(localeQuery, { locale }))
    return res.data.locale
}

export const loadLocale = (desiredLocale) => async (dispatch, getState) => {
    // try switch in-memory
    if (dispatch(localeExists(desiredLocale))) {
        dispatch(setCurrentLocale(desiredLocale))
        return
    }

    let cachedData = null
    let remoteData = null

    // try load from local storaged cache
    try {
        cachedData = dispatch(localStorage.getItem(`locale::cache::${desiredLocale}`))
        if (cachedData && dispatch(isCacheValid(cachedData.ctime))) {
            remoteData = cachedData
        }
    } catch (err) {} // eslint-disable-line

    // fetch from the server
    if (!remoteData) {
        try {
            remoteData = await dispatch(fetchLocale(desiredLocale))
        } catch (err) {} // eslint-disable-line
    }

    // verify remote data or fallback on pre-existing cache
    if (!remoteData) {
        console.log(`[locale] failed to load locale: ${desiredLocale}`)

        if (cachedData) {
            console.log('[locale] defaulting to an old cached definition')
            remoteData = cachedData
        } else {
            return
        }
    }

    dispatch(addLocaleData(remoteData))
    dispatch(setCurrentLocale(desiredLocale))
}

export const init = () => (dispatch) => {
    try {
        window.loadLocale = locale => dispatch(loadLocale(locale))
    } catch (err) {} // eslint-disable-line
}

export const start = () => (dispatch, getState) => {
    const { ssr } = getState()
    const current = dispatch(getCurrentLocale())
    return ssr.await(dispatch(loadLocale(current)))
}
