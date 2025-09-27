import type { TSortField } from '@/types/SortField'

export class SortBox extends HTMLElement {
    // Valor interno
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
        // Valor inicial desde atributo o por defecto
        this._field = (this.getAttribute('field') as TSortField) || ''
        this.render()

        this.sortSelector = this.querySelector('#sort')
        // Listener del select
        this.sortSelector?.addEventListener('change', (e) => {
            const select = e.currentTarget as HTMLSelectElement
            this.field = select.value as TSortField

            // Emite evento personalizado para que <app-root> pueda escucharlo
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

const tag = 'sort-box'
if (!customElements.get(tag)) {
    customElements.define(tag, SortBox)
}

// Declaración global de tipo
declare global {
    interface HTMLElementTagNameMap {
        'sort-box': SortBox
    }
}
