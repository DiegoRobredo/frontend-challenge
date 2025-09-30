import type { TSortField, SortChangeDetail } from '@/types'
import { EVENTS } from '@/utils/constants'
import { renderShell, getRefs, setSelectValue } from './interface'
import { attachEvents } from './events'
import { FIELD } from './constants'

export class SortBox extends HTMLElement {
    static get observedAttributes() {
        return [FIELD]
    }

    private _field: TSortField = ''
    private refs!: ReturnType<typeof getRefs>
    private eventsAborter: AbortController | null = null

    get field(): TSortField {
        return this._field
    }

    set field(val: TSortField) {
        const next = (val ?? '') as TSortField
        if (this._field === next) return
        this._field = next
        this.setAttribute(FIELD, next)
        setSelectValue(this.refs?.select ?? null, next)
    }

    connectedCallback() {
        this._field = (this.getAttribute(FIELD) as TSortField) || this._field

        renderShell(this, this._field)
        this.refs = getRefs(this)

        this.eventsAborter = attachEvents(this, {
            onChange: (field) => {
                this.field = field
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
        if (name === FIELD) {
            this._field = (val as TSortField) || ''
            setSelectValue(this.refs?.select ?? null, this._field)
        }
    }

    private publish() {
        const detail: SortChangeDetail = { field: this._field }
        this.dispatchEvent(
            new CustomEvent(EVENTS.SORT_CHANGE, {
                detail,
                bubbles: true,
                composed: true,
            })
        )
    }
}

customElements.define('sort-box', SortBox)

declare global {
    interface HTMLElementTagNameMap {
        'sort-box': SortBox
    }
}
