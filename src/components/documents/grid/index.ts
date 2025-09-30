import { relativeFormatDate } from '@/utils/formater'
import type { TDocument } from '@/types'
import { listTemplate } from '@/templates/list'

export class DocsGrid extends HTMLElement {
    private _data: TDocument[] = []

    get data() {
        return this._data
    }

    set data(value: TDocument[]) {
        this._data = Array.isArray(value) ? value : []
        this.render()
    }

    connectedCallback() {
        this.render()
    }

    private renderCard(document: TDocument): string {
        const contributors = (document.Contributors ?? []).map(
            (contributor) => contributor.Name
        )

        return `
      <article class="doc-card" data-id="${document.ID}">
        <span class="doc-title doc-card__title">${document.Title}</span>
        <span class="doc-version">Version ${document.Version}</span>
        <span class="doc-date">Created ${relativeFormatDate(document.CreatedAt)}</span>
        <span class="doc-date">Updated ${relativeFormatDate(document.UpdatedAt)}</span>
        ${listTemplate({ class: 'list docs-table__list' }, contributors)}
        ${listTemplate({ class: 'list doc-card__list' }, document.Attachments ?? [])}
      </article>
    `
    }

    private render(): void {
        const cards = this._data.map((d) => this.renderCard(d)).join('')

        this.innerHTML = `
      <div class="docs-grid">
        ${cards}
      </div>
    `
    }
}

customElements.define('docs-grid', DocsGrid)

declare global {
    interface HTMLElementTagNameMap {
        'docs-grid': DocsGrid
    }
}
