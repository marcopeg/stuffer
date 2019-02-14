
export const jsonEncode = v => v ? JSON.stringify(v) : null
export const jsonDecode = v => v ? JSON.parse(v) : null
export const json2sql = data => JSON.stringify(data || {}).replace(/'/g, '\'\'')
