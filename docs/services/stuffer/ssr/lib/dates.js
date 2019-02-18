
const zeroPad = d => ('0' + d).slice(-2)

export const date2obj = date => ({
    YYYY: date.getUTCFullYear(),
    MM: zeroPad(date.getMonth() + 1),
    DD: zeroPad(date.getDate()),
    hh: zeroPad(date.getHours()),
    mm: zeroPad(date.getMinutes()),
    ss: zeroPad(date.getSeconds()),
})

export const date2pg = date => {
    const obj = date2obj(date)
    return `${obj.YYYY}-${obj.MM}-${obj.DD} ${obj.hh}:${obj.mm}:${obj.ss}`
}
