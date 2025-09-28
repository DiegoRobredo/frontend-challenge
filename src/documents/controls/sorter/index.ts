import type { TSortField } from '@/types'

export class SortBox extends HTMLElement {
    private _field: TSortField = ''
    private sortSelector: HTMLSelectElement | null = null

    get field(): TSortField {
        return this._field
    }

    set field(val: TSortField) {
        this._field = val
        this.setAttribute('field', val)
    }

    connectedCallback() {
        this._field = (this.getAttribute('field') as TSortField) || ''
        this.render()

        this.sortSelector = this.querySelector('#sort')

        this.sortSelector?.addEventListener('change', (e) => {
            const select = e.currentTarget as HTMLSelectElement
            this.field = select.value as TSortField

            this.dispatchEvent(
                new CustomEvent('sort-change', {
                    detail: { field: this._field },
                    bubbles: true,
                    composed: true,
                })
            )
        })
    }

    render() {
        this.innerHTML = `
      <div class="sort-box">
        <label for="sort">Sort by:</label>
        <select name="sort" id="sort">
          <option value="" disabled ${this._field === '' ? 'selected' : ''} hidden>
            Select sorting…
          </option>
          <option value="name" ${this._field === 'name' ? 'selected' : ''}>Name</option>
          <option value="date" ${this._field === 'date' ? 'selected' : ''}>Date</option>
          <option value="version" ${this._field === 'version' ? 'selected' : ''}>Version</option>
        </select>
      </div>
    `
    }
}

customElements.define('sort-box', SortBox)

declare global {
    interface HTMLElementTagNameMap {
        'sort-box': SortBox
    }
}
