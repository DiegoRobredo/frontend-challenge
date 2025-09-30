import type { TSortField } from '@/types'

type Handlers = {
    onChange: (field: TSortField) => void
}

export function attachEvents(host: HTMLElement, handlers: Handlers) {
    const ac = new AbortController()
    const { signal } = ac

    host.addEventListener(
        'change',
        (e) => {
            const target = e.target as HTMLElement | null
            if (!(target instanceof HTMLSelectElement)) return

            handlers.onChange(target.value as TSortField)
        },
        { signal }
    )

    return ac
}
