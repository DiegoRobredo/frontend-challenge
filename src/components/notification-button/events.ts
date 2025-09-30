type Handlers = {
    onClick: () => void
}

export function attachEvents(root: HTMLElement, handlers: Handlers) {
    const ac = new AbortController()
    const { signal } = ac

    root.addEventListener(
        'click',
        (e) => {
            const target = e.target as HTMLElement | null
            if (!target) return

            const button = target.closest(
                '#notifButton'
            ) as HTMLButtonElement | null
            if (!button) return

            handlers.onClick()
        },
        { signal }
    )

    return ac
}
