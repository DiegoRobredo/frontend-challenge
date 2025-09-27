import type { TViewMode } from '@/types/ViewMode'
import type { TDocument } from '@/types/Document'
import { DocsTable } from '../table'
import { DocsGrid } from '../grid'

export class DocumentsSection extends HTMLElement {
    private mode: TViewMode = 'list'
    private data: TDocument[] = []

    connectedCallback() {
        this.render()
        this.fetchAndFillData()
    }

    private async fetchData(): Promise<void> {
        this.data = await fetch('http://localhost:8080/documents').then((res) =>
            res.json()
        )
    }

    private fetchAndFillData = async () => {
        await this.fetchData()
        ;(
            this.querySelector('#docsTable') as DocsTable & {
                data: TDocument[]
            }
        ).data = this.data
        ;(
            this.querySelector('#docsGrid') as DocsGrid & { data: TDocument[] }
        ).data = this.data
    }

    private async render(): Promise<void> {
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
