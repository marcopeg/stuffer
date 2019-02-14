
export const getFullMonth = date =>
    `${date.getMonth() + 1}`.padStart(2, '0')

export const getFullDate = date =>
    `${date.getDate()}`.padStart(2, '0')

export const asDateStr = date =>
    `${date.getFullYear()}-${getFullMonth(date)}-${getFullDate(date)}`

export const today = () => new Date()

export const todayStr = () => asDateStr(today())
