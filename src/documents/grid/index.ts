import type { TDocument } from '@/types/Document'

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
        <h3 class="doc-card__title">${document.Title}</h3>
        <div class="doc-card__version">Version ${document.Version}</div>

        <ul class="doc-card__list doc-card__contributors">
          ${contributors}
        </ul>

        <ul class="doc-card__list doc-card__attachments">
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

// registro seguro
const tag = 'docs-grid'
if (!customElements.get(tag)) customElements.define(tag, DocsGrid)

// Tipos globales
declare global {
    interface HTMLElementTagNameMap {
        'docs-grid': DocsGrid
    }
}
