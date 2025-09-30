import { LIST, GRID } from './constants'
import type { TViewMode } from '@/types'

type Handlers = {
    onChange: (mode: TViewMode) => void
}

export function attachEvents(root: HTMLElement, handlers: Handlers) {
    const ac = new AbortController()
    const { signal } = ac

    root.addEventListener(
        'click',
        (e) => {
            const target = e.target as HTMLElement | null
            if (!target) return

            const btn = target.closest(
                'button[data-mode]'
            ) as HTMLButtonElement | null
            if (!btn) return

            const mode = btn.getAttribute('data-mode') as TViewMode
            if (mode !== LIST && mode !== GRID) return

            handlers.onChange(mode)
        },
        { signal }
    )

    return ac
}
