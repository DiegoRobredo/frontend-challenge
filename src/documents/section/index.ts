import type { TViewMode } from '@/types/ViewMode'
import { ViewToggle } from '../controls/view-toggle'

export class DocumentsSection extends HTMLElement {
    private mode: TViewMode = 'list'

    private toggle!: ViewToggle

    connectedCallback() {
        this.render()
    }

    private render(): void {
        this.innerHTML = `
      <header class="toolbar">
        <view-toggle id="toggle"></view-toggle>
        <sort-box id="sorter"></sort-box>
      </header>

      <section id="view-list">
        <docs-table id="docsTable"></docs-table>
      </section>

      <section id="view-grid" hidden inert>
        <docs-grid id="docsGrid"></docs-grid>
      </section>
    `

        this.toggle = this.querySelector('#toggle') as ViewToggle

        // 1) Cambiar vista según el toggle
        this.addEventListener('view-change', (e) => {
            const viewMode = (e as CustomEvent<{ mode: TViewMode }>).detail.mode
            this.setView(viewMode)
        })

        this.setView(this.mode)
    }

    private setView(viewMode: TViewMode) {
        if (this.mode === viewMode) return
        this.mode = viewMode

        const listSec = this.querySelector('#view-list') as HTMLElement
        const gridSec = this.querySelector('#view-grid') as HTMLElement

        const show = (el: HTMLElement) => {
            el.hidden = false
            el.removeAttribute('inert')
        }
        const hide = (el: HTMLElement) => {
            el.hidden = true
            el.setAttribute('inert', '')
        }

        if (viewMode === 'list') {
            show(listSec)
            hide(gridSec)
        } else {
            show(gridSec)
            hide(listSec)
        }
    }
}

if (!customElements.get('documents-section'))
    customElements.define('documents-section', DocumentsSection)

declare global {
    interface HTMLElementTagNameMap {
        'documents-section': DocumentsSection
    }
}
