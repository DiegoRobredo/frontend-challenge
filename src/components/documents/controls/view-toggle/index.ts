import type { TViewMode, ViewChangeDetail } from '@/types'
import { EVENTS } from '@/utils/constants'
import { renderShell, setValue } from './interface'
import { attachEvents } from './events'
import { MODE, LIST, GRID } from './constants'

export class ViewToggle extends HTMLElement {
    static get observedAttributes() {
        return [MODE]
    }

    private _mode: TViewMode = LIST
    private eventsAborter: AbortController | null = null

    get mode(): TViewMode {
        return this._mode
    }

    set mode(val: TViewMode) {
        const nextValue = (val ?? LIST) as TViewMode
        if (nextValue !== LIST && nextValue !== GRID) return
        //Same value, do nothing
        if (this._mode === nextValue) return

        this._mode = nextValue
        this.setAttribute(MODE, nextValue)
        setValue(this, nextValue)
    }

    connectedCallback() {
        const attr = (this.getAttribute(MODE) as TViewMode) || this._mode
        this._mode = attr === GRID ? GRID : LIST

        renderShell(this, this._mode)

        this.eventsAborter = attachEvents(this, {
            onChange: (mode) => {
                this.mode = mode
                this.publish()
            },
        })
    }

    disconnectedCallback() {
        this.eventsAborter?.abort()
    }

    attributeChangedCallback(
        name: string,
        _old: string | null,
        val: string | null
    ) {
        if (name === MODE) {
            const next = (val as TViewMode) === GRID ? GRID : LIST
            this._mode = next
            setValue(this, next)
        }
    }

    private publish() {
        const detail: ViewChangeDetail = { mode: this._mode }
        this.dispatchEvent(
            new CustomEvent(EVENTS.VIEW_CHANGE, {
                detail,
                bubbles: true,
                composed: true,
            })
        )
    }
}

customElements.define('view-toggle', ViewToggle)

declare global {
    interface HTMLElementTagNameMap {
        'view-toggle': ViewToggle
    }
}
