// components/docs-table.ts
import type { TDocument } from '@/types/Document'

export class DocsTable extends HTMLElement {
    private _data: TDocument[] = []

    connectedCallback() {
        // Render inicial (estado vacío/loading)
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

    private async render(): Promise<void> {
        this._data = await fetch('http://localhost:8080/documents').then(
            (res) => res.json()
        )

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

// Registro seguro
const tag = 'docs-table'
if (!customElements.get(tag)) customElements.define(tag, DocsTable)

// Tipado global (si prefieres, muévelo a types/custom-elements.d.ts)
declare global {
    interface HTMLElementTagNameMap {
        'docs-table': DocsTable
    }
}
