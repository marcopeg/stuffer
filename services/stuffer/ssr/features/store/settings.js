const ctx = { settings: {} }

export const init = (settings = {}) => {
    ctx.settings = { ...settings }
}

export const get = key => {
    if (ctx.settings[key] === undefined) {
        throw new Error(`[store/settings] key "${key}" not defined`)
    }

    return ctx.settings[key]
}
