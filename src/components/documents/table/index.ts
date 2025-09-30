import type { TDocument } from '@/types'
import { renderShell, setData } from './interface'

export class DocsTable extends HTMLElement {
    private _data: TDocument[] = []

    get data(): TDocument[] {
        return this._data
    }

    set data(value: TDocument[]) {
        // Normalize to an array to avoid runtime errors
        this._data = Array.isArray(value) ? value : []
        setData(this, this._data)
    }

    connectedCallback() {
        renderShell(this)
        setData(this, this._data)
    }
}

customElements.define('docs-table', DocsTable)

declare global {
    interface HTMLElementTagNameMap {
        'docs-table': DocsTable
    }
}
