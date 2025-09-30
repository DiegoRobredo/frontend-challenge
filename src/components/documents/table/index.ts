import type { TDocument } from '@/types'
import { relativeFormatDate } from '@/utils/formater'

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
      <tr class="docs-table__row" data-id="${documents.ID}">
        <th scope="row">
          <div class="docs-table__row__header">
            <span class="doc-title docs-table__title">${documents.Title}</span>
            <span class="doc-version">Version ${documents.Version}</span>
            <span class="doc-date">Created ${relativeFormatDate(documents.CreatedAt)}</span>
            <span class="doc-date">Updated ${relativeFormatDate(documents.UpdatedAt)}</span>
          </div>
        </th>
        <td class="doc-cell"><ul class="list docs-table__list" >${contribs}</ul></td>
        <td class="doc-cell"><ul class="list docs-table__list">${atts}</ul></td>
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
