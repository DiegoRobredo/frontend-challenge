// components/view-toggle.ts
type ViewMode = 'list' | 'grid'

export class ViewToggle extends HTMLElement {
    private _value: ViewMode = 'list'
    private btnList!: HTMLButtonElement
    private btnGrid!: HTMLButtonElement

    // handler únicos para poder quitarlos en disconnectedCallback
    private onClick = (ev: Event) => {
        const target = ev.currentTarget as HTMLButtonElement
        this.setValue(target.id as ViewMode, true)
    }

    // API pública (solo propiedad; no reflejamos a atributos)
    get value(): ViewMode {
        return this._value
    }

    set value(v: ViewMode) {
        this.setValue(v, false)
    }

    connectedCallback() {
        // Render inicial
        this.innerHTML = `
      <div class="segmented-control" role="tablist" aria-label="View mode">
        <button class="segmented-control__button" role="tab"
                aria-selected="true" aria-controls="list-tab" id="list">
          <i class="fa-solid fa-list" aria-hidden="true"></i>
          <span class="sr-only">List view</span>
        </button>
        <button class="segmented-control__button" role="tab"
                aria-selected="false" aria-controls="grid-tab" id="grid" tabindex="-1">
          <i class="fa-solid fa-grip" aria-hidden="true"></i>
          <span class="sr-only">Grid view</span>
        </button>
      </div>
    `

        // refs
        this.btnList = this.querySelector('#list') as HTMLButtonElement
        this.btnGrid = this.querySelector('#grid') as HTMLButtonElement

        // listeners
        this.btnList.addEventListener('click', this.onClick)
        this.btnGrid.addEventListener('click', this.onClick)

        // sincroniza estado inicial (por si setearon .value antes de conectarse)
        this.applyAriaState(this._value)
    }

    disconnectedCallback() {
        this.btnList?.removeEventListener('click', this.onClick)
        this.btnGrid?.removeEventListener('click', this.onClick)
    }

    // --- helpers ---
    private setValue(v: ViewMode, notify: boolean) {
        if (v !== 'list' && v !== 'grid') return
        if (this._value === v) return

        this._value = v
        this.applyAriaState(v)
        if (notify) {
            this.dispatchEvent(
                new CustomEvent('view-change', {
                    detail: { value: v },
                    bubbles: true,
                    composed: true,
                })
            )
        }
    }

    private applyAriaState(active: ViewMode) {
        const isList = active === 'list'
        this.btnList.setAttribute('aria-selected', String(isList))
        this.btnGrid.setAttribute('aria-selected', String(!isList))
        this.btnList.tabIndex = isList ? 0 : -1
        this.btnGrid.tabIndex = isList ? -1 : 0
    }
}

// registro seguro
const tag = 'view-toggle'
if (!customElements.get(tag)) customElements.define(tag, ViewToggle)

// Tipado global (si prefieres, muévelo a types/custom-elements.d.ts)
declare global {
    interface HTMLElementTagNameMap {
        'view-toggle': ViewToggle
    }
}
