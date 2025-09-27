import type { TViewMode } from '@/types/ViewMode'
import type { TSortField } from '@/types/SortField'
import type { TDocument, TDocumentVersion } from '@/types/Document'
import { DocsTable } from '../table'
import { DocsGrid } from '../grid'

export class DocumentsSection extends HTMLElement {
    private mode: TViewMode = 'list'
    private data: TDocument[] = []
    private table: DocsTable | null = null
    private grid: DocsGrid | null = null

    connectedCallback() {
        this.render()

        this.table = this.querySelector('#docsTable') as DocsTable
        this.grid = this.querySelector('#docsGrid') as DocsGrid

        // Cambiar vista según el toggle
        this.addEventListener('view-change', (e) => {
            const viewMode = (e as CustomEvent<{ mode: TViewMode }>).detail.mode
            this.setView(viewMode)
        })

        // Cambiar los datos según la ordenación
        this.addEventListener('sort-change', (e) => {
            const field = (e as CustomEvent<{ field: TSortField }>).detail.field
            this.setSort(field)
        })

        this.fetchAndFillData()
    }

    private async fetchData(): Promise<void> {
        this.data = await fetch('http://localhost:8080/documents').then((res) =>
            res.json()
        )
    }

    private async fetchAndFillData(): Promise<void> {
        await this.fetchData()
        this.renderContainersData()
    }

    private renderContainersData(): void {
        if (this.table) this.table.data = this.data
        if (this.grid) this.grid.data = this.data
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

    private setSort(field: TSortField): void {
        if (!field) return this.renderContainersData()

        //TODO: Refactor to improve cleanliness
        // Sort based on field
        const sorted = [...this.data].sort((a, b) => {
            if (field === 'name') {
                return a.Title.localeCompare(b.Title)
            } else if (field === 'date') {
                return (
                    new Date(b.CreatedAt).getTime() -
                    new Date(a.CreatedAt).getTime()
                )
            } else if (field === 'version') {
                return this.compareVersions(a.Version, b.Version)
            }
            return 0
        })

        this.data = sorted
        this.renderContainersData()
    }

    compareVersions(v1: TDocumentVersion, v2: TDocumentVersion): number {
        const toNumberArray = (version: TDocumentVersion): number[] => {
            return version.split('.').map((num) => parseInt(num, 10))
        }

        const arr1 = toNumberArray(v1)
        const arr2 = toNumberArray(v2)

        return arr1[0] - arr2[0] || arr1[1] - arr2[1] || arr1[2] - arr2[2]
    }
}

if (!customElements.get('documents-section'))
    customElements.define('documents-section', DocumentsSection)

declare global {
    interface HTMLElementTagNameMap {
        'documents-section': DocumentsSection
    }
}
