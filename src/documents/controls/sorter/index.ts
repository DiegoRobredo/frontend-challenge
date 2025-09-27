// components/sort-box.ts
export class SortBox extends HTMLElement {
    // Valor interno
    private _value: string = 'newest'

    static get observedAttributes() {
        return ['value']
    }

    get value(): string {
        return this._value
    }

    set value(val: string) {
        this._value = val
        this.setAttribute('value', val)
        this.render()
    }

    connectedCallback() {
        // Valor inicial desde atributo o por defecto
        this._value = this.getAttribute('value') ?? 'newest'
        this.render()

        // Listener del select (delegado)
        this.querySelector<HTMLSelectElement>('#sort')?.addEventListener(
            'change',
            (e) => {
                const select = e.currentTarget as HTMLSelectElement
                this.value = select.value

                // Emite evento personalizado para que <app-root> pueda escucharlo
                this.dispatchEvent(
                    new CustomEvent('sort-change', {
                        detail: { value: this._value },
                        bubbles: true,
                        composed: true,
                    })
                )
            }
        )
    }

    attributeChangedCallback(
        _name: string,
        _old: string | null,
        newVal: string | null
    ) {
        if (newVal !== null) {
            this._value = newVal
            this.render()
        }
    }

    render() {
        this.innerHTML = `
      <div class="sort-box">
        <label for="sort">Sort by:</label>
        <select name="sort" id="sort">
          <option value="newest" ${this._value === 'newest' ? 'selected' : ''}>Name</option>
          <option value="oldest" ${this._value === 'oldest' ? 'selected' : ''}>Date</option>
          <option value="a-z" ${this._value === 'a-z' ? 'selected' : ''}>Version</option>
        </select>
      </div>
    `
    }
}

// Registrar solo si no existe (útil en HMR)
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
