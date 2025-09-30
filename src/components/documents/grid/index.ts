import { relativeFormatDate } from '@/utils/formater'
import type { TDocument } from '@/types'

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
        //TODO: DRY
        const contributors = (document.Contributors ?? [])
            .map((contributor) => `<li>${contributor.Name}</li>`)
            .join('')

        //TODO: DRY
        const attachments = (document.Attachments ?? [])
            .map((attachment) => `<li>${attachment}</li>`)
            .join('')

        return `
      <article class="doc-card" data-id="${document.ID}">
        <span class="doc-title doc-card__title">${document.Title}</span>
        <span class="doc-version">Version ${document.Version}</span>
        <span class="doc-date">Created ${relativeFormatDate(document.CreatedAt)}</span>
        <span class="doc-date">Updated ${relativeFormatDate(document.UpdatedAt)}</span>

        <ul class="list doc-card__list">
          ${contributors}
        </ul>

        <ul class="list doc-card__list">
          ${attachments}
        </ul>
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
