import type { TDocument } from '@/types'

export class DocsTable extends HTMLElement {
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

    private renderRow(documents: TDocument): string {
        const contribs = (documents.Contributors ?? [])
            .map((contributor) => `<li>${contributor.Name}</li>`)
            .join('')
        const atts = (documents.Attachments ?? [])
            .map((attachment) => `<li>${attachment}</li>`)
            .join('')

        return `
      <tr data-id="${documents.ID}">
        <th scope="row">
          <div>
            <a href="#" class="doc-title">${documents.Title}</a>
            <span class="doc-meta">Version ${documents.Version}</span>
          </div>
        </th>
        <td><ul>${contribs}</ul></td>
        <td><ul>${atts}</ul></td>
      </tr>
    `
    }

    private render(): void {
        const rows = this._data.map((d) => this.renderRow(d)).join('')
        this.innerHTML = `
      <table class="docs-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Contributors</th>
            <th scope="col">Attachments</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `
    }
}

customElements.define('docs-table', DocsTable)

declare global {
    interface HTMLElementTagNameMap {
        'docs-table': DocsTable
    }
}
