import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'

vi.mock('./constants', () => ({
    MINUTE_IN_SECONDS: 60,
    HOUR_IN_SECONDS: 60 * 60,
    DAY_IN_SECONDS: 60 * 60 * 24,
    WEEK_IN_SECONDS: 60 * 60 * 24 * 7,
    MONTH_IN_SECONDS: 2592000, // 30 * 24 * 3600
    YEAR_IN_SECONDS: 31536000, // 365 * 24 * 3600
}))

import { relativeFormatDate } from '@/utils/formatter.ts'

describe('relativeFormatDate', () => {
    const TIME_UNITS = {
        second: 1,
        minute: 60,
        hour: 60 * 60,
        day: 60 * 60 * 24,
        week: 60 * 60 * 24 * 7,
        month: 2592000, // 30 days
        year: 31536000, // 365 days
    } as const

    const FIXED_NOW = new Date('2025-10-01T10:00:00.000Z')

    const createDateOffset = (seconds: number) =>
        new Date(FIXED_NOW.getTime() + seconds * 1000)

    beforeAll(() => {
        vi.useFakeTimers()
        vi.setSystemTime(FIXED_NOW)
    })

    afterAll(() => {
        vi.useRealTimers()
    })

    describe('invalid inputs', () => {
        it('returns empty string for undefined date', () => {
            expect(relativeFormatDate(undefined)).toBe('')
        })

        it('returns empty string for invalid date string', () => {
            expect(relativeFormatDate('not-a-date')).toBe('')
        })
    })

    describe('input formats', () => {
        it('accepts both Date objects and ISO strings', () => {
            const futureDate = createDateOffset(30)
            expect(relativeFormatDate(futureDate)).toBe('in 30 sec.')
            expect(relativeFormatDate(futureDate.toISOString())).toBe(
                'in 30 sec.'
            )
        })
    })

    describe('time unit boundaries', () => {
        it('formats exactly 60 seconds as minutes', () => {
            const date = createDateOffset(TIME_UNITS.minute)
            expect(relativeFormatDate(date)).toBe('in 1 min.')
        })

        it('rounds 90 seconds up to 2 minutes', () => {
            const date = createDateOffset(TIME_UNITS.minute * 1.5)
            expect(relativeFormatDate(date)).toBe('in 2 min.')
        })
    })

    describe('future dates', () => {
        const testCases = [
            { offset: 5, expected: 'in 5 sec.' },
            { offset: 30, expected: 'in 30 sec.' },
            {
                offset: TIME_UNITS.hour * 2 + TIME_UNITS.minute * 10,
                expected: 'in 2 hr.',
            },
            { offset: TIME_UNITS.day * 8, expected: 'in 1 wk.' },
            { offset: TIME_UNITS.day * 60, expected: 'in 2 mo.' },
        ]

        testCases.forEach(({ offset, expected }) => {
            it(`formats ${offset} seconds as "${expected}"`, () => {
                const date = createDateOffset(offset)
                expect(relativeFormatDate(date)).toBe(expected)
            })
        })
    })

    describe('past dates', () => {
        it('formats 45 seconds ago', () => {
            const date = createDateOffset(-45)
            expect(relativeFormatDate(date)).toBe('45 sec. ago')
        })

        it('formats 1.125 days as 1 day ago', () => {
            const offset = -(TIME_UNITS.day + TIME_UNITS.hour * 3)
            const date = createDateOffset(offset)
            expect(relativeFormatDate(date)).toBe('1 day ago')
        })

        it('formats 400 days as 1 year ago', () => {
            const date = createDateOffset(-TIME_UNITS.day * 400)
            expect(relativeFormatDate(date)).toBe('1 yr. ago')
        })
    })
})
