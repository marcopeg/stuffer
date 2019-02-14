import * as dates from 'lib/dates'

describe('lib/dates', () => {
    [
        '2018-12-30',
        '2018-03-05',
    ].forEach(str =>
        it('should format a date as string', () => {
            expect(dates.asDateStr(new Date(str))).toBe(str)
        })
    )
})
