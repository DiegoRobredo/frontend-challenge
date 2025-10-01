import {
    MINUTE_IN_SECONDS,
    HOUR_IN_SECONDS,
    DAY_IN_SECONDS,
    WEEK_IN_SECONDS,
    MONTH_IN_SECONDS,
    YEAR_IN_SECONDS,
} from './constants'

export function relativeFormatDate(date: Date | string | undefined): string {
    if (!date) return ''

    const targetDate = new Date(date)
    if (targetDate.toString() === 'Invalid Date') {
        return ''
    }

    const now = new Date()

    const diffInMs = Math.floor((-now.getTime() + targetDate.getTime()) / 1000)
    const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' })

    if (Math.abs(diffInMs) >= YEAR_IN_SECONDS)
        return rtf.format(Math.round(diffInMs / YEAR_IN_SECONDS), 'year')
    if (Math.abs(diffInMs) >= MONTH_IN_SECONDS)
        return rtf.format(Math.round(diffInMs / MONTH_IN_SECONDS), 'month')
    if (Math.abs(diffInMs) >= WEEK_IN_SECONDS)
        return rtf.format(Math.round(diffInMs / WEEK_IN_SECONDS), 'week')
    if (Math.abs(diffInMs) >= DAY_IN_SECONDS)
        return rtf.format(Math.round(diffInMs / DAY_IN_SECONDS), 'day')
    if (Math.abs(diffInMs) >= HOUR_IN_SECONDS)
        return rtf.format(Math.round(diffInMs / HOUR_IN_SECONDS), 'hour')
    if (Math.abs(diffInMs) >= MINUTE_IN_SECONDS)
        return rtf.format(Math.round(diffInMs / MINUTE_IN_SECONDS), 'minute')

    return rtf.format(Math.round(diffInMs), 'second')
}
