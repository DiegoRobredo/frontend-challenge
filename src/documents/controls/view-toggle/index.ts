import type { TViewMode } from '@/types/ViewMode'

export class ViewToggle extends HTMLElement {
    private _mode: TViewMode = 'list'
    private btnList!: HTMLButtonElement
    private btnGrid!: HTMLButtonElement

    private onClick = (ev: Event) => {
        const target = ev.currentTarget as HTMLButtonElement
        this.setMode(target.id as TViewMode, true)
    }

    get mode(): TViewMode {
        return this._mode
    }

    set mode(m: TViewMode) {
        this.setMode(m, false)
    }

    connectedCallback() {
        this.render()

        //TODO: Refactor to support more buttons dynamically
        this.btnList = this.querySelector('#list') as HTMLButtonElement
        this.btnGrid = this.querySelector('#grid') as HTMLButtonElement

        this.btnList.addEventListener('click', this.onClick)
        this.btnGrid.addEventListener('click', this.onClick)

        this.applyAriaState(this._mode)
    }

    //TODO: Enable adding more buttons by children insertion in html
    private render(): void {
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
    }

    disconnectedCallback() {
        this.btnList?.removeEventListener('click', this.onClick)
        this.btnGrid?.removeEventListener('click', this.onClick)
    }

    private setMode(value: TViewMode, notify: boolean) {
        if (value !== 'list' && value !== 'grid') return
        if (this._mode === value) return

        this._mode = value
        this.applyAriaState(value)
        if (notify) {
            this.dispatchEvent(
                new CustomEvent('view-change', {
                    detail: { mode: value },
                    bubbles: true,
                    composed: true,
                })
            )
        }
    }

    //Change ARIA attributes and tabindex depending on the active mode
    //TODO: Open to multiple choices (not only two)
    private applyAriaState(active: TViewMode) {
        const isList = active === 'list'
        this.btnList.setAttribute('aria-selected', String(isList))
        this.btnGrid.setAttribute('aria-selected', String(!isList))
        this.btnList.tabIndex = isList ? 0 : -1
        this.btnGrid.tabIndex = isList ? -1 : 0
    }
}

customElements.define('view-toggle', ViewToggle)
declare global {
    interface HTMLElementTagNameMap {
        'view-toggle': ViewToggle
    }
}
