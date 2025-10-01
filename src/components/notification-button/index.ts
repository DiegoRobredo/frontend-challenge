import { renderShell, setCount } from './interface'
import { attachEvents } from './events'
import { EVENTS } from '@/utils/constants'
import { normalizeCount, reflectAttrIfNeeded } from './logic'

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
        this.setAttribute('count', !isNaN(next) ? String(next) : '0')
        setCount(this, next)
    }

    connectedCallback(): void {
        // Initialize count from attribute if present
        if (this.hasAttribute('count')) {
            const normalized = normalizeCount(this.getAttribute('count'))
            this._count = normalized
            reflectAttrIfNeeded(this, 'count', String(normalized))
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
        _new: string | null
    ) {
        if (name !== 'count') return
        const normalized = normalizeCount(_new)

        if (_new !== String(normalized)) {
            reflectAttrIfNeeded(this, 'count', String(normalized))
            return
        }

        if (this._count !== normalized) {
            this._count = normalized
            setCount(this, normalized)
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
