import { renderShell, setCount } from './interface'
import { attachEvents } from './events'
import { EVENTS } from '@/utils/constants'

export class NotificationButton extends HTMLElement {
    static get observedAttributes() {
        return ['count'] as const
    }

    private _count = 0
    private eventsAborter: AbortController | null = null

    get count(): number {
        return this._count
    }

    set count(value: number) {
        const next = Number.isFinite(value) ? Number(value) : 0
        if (this._count === next) return
        this._count = next
        this.setAttribute('count', String(next))
        setCount(this, next)
    }

    connectedCallback(): void {
        if (this.hasAttribute('count')) {
            const parsed = Number(this.getAttribute('count'))
            this._count = Number.isFinite(parsed) ? parsed : 0
        }

        renderShell(this, this._count)
        setCount(this, this._count)

        this.eventsAborter = attachEvents(this, {
            onClick: () => this.publish(),
        })
    }

    disconnectedCallback(): void {
        this.eventsAborter?.abort()
    }

    attributeChangedCallback(
        name: string,
        _old: string | null,
        val: string | null
    ) {
        if (name === 'count') {
            const next = Number.isFinite(Number(val)) ? Number(val) : 0
            this._count = next
            setCount(this, next)
        }
    }

    private publish(): void {
        this.dispatchEvent(
            new CustomEvent(EVENTS.NOTIFICATION_CLICK, {
                detail: {},
                bubbles: true,
                composed: true,
            })
        )
    }
}

customElements.define('notification-button', NotificationButton)

declare global {
    interface HTMLElementTagNameMap {
        'notification-button': NotificationButton
    }
}
