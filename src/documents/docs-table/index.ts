// components/docs-table.ts
import type { TDocument } from '@/types/Document'

export class DocsTable extends HTMLElement {
    private _data: TDocument[] = []
    private _src: string | null = null
    private abortCtrl: AbortController | null = null
    private isLoading = false
    private lastError: string | null = null

    static get observedAttributes() {
        return ['src']
    }

    /** URL del endpoint REST */
    get src(): string | null {
        return this._src
    }

    set src(value: string | null) {
        if (value === this._src) return
        this._src = value
        if (value) this.setAttribute('src', value)
        else this.removeAttribute('src')
        this.fetchAndRender() // dispara carga al cambiar la URL
    }

    connectedCallback() {
        // Render inicial (estado vacío/loading)
        this.render()

        // Si hay src en atributo, iniciamos carga
        const attrSrc = this.getAttribute('src')
        if (attrSrc) {
            this._src = attrSrc
            this.fetchAndRender()
        }
    }

    disconnectedCallback() {
        this.abortCtrl?.abort()
        this.abortCtrl = null
    }

    attributeChangedCallback(
        name: string,
        _old: string | null,
        value: string | null
    ) {
        if (name === 'src') {
            this._src = value
            this.fetchAndRender()
        }
    }

    /** Permite refrescar manualmente desde fuera */
    public async reload() {
        await this.fetchAndRender()
    }

    // ----------------- Networking -----------------

    private async fetchAndRender() {
        if (!this._src) {
            this._data = []
            this.isLoading = false
            this.lastError = null
            this.render()
            return
        }

        // Cancela request anterior si hubiera
        this.abortCtrl?.abort()
        this.abortCtrl = new AbortController()

        this.isLoading = true
        this.lastError = null
        this.render()

        try {
            const res = await fetch(this._src, {
                signal: this.abortCtrl.signal,
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const json = await res.json()
            if (!Array.isArray(json))
                throw new Error('Invalid payload: expected array')
            // (Aquí podrías validar estructura con zod si lo deseas)
            this._data = json as TDocument[]
            this.isLoading = false
            this.lastError = null
            this.render()
            this.dispatchEvent(
                new CustomEvent('load-success', {
                    detail: { count: this._data.length },
                })
            )
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') return // petición cancelada: no tocar UI

            this.isLoading = false
            this.lastError = String((err as Error)?.message ?? err)
            this._data = []
            this.render()
            this.dispatchEvent(
                new CustomEvent('load-error', {
                    detail: { error: this.lastError },
                })
            )
        }
    }

    // ----------------- Render -----------------

    /** Escapar texto por seguridad */
    private escapeHtml(rawText: string): string {
        const str = String(rawText ?? '')
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }

    private renderRow(documents: TDocument): string {
        const title = this.escapeHtml(documents.Title)
        const version = this.escapeHtml(documents.Version)
        const contribs = (documents.Contributors ?? [])
            .map((c) => `<li>${this.escapeHtml(c.Name)}</li>`)
            .join('')
        const atts = (documents.Attachments ?? [])
            .map((a) => `<li>${this.escapeHtml(a)}</li>`)
            .join('')

        return `
      <tr data-id="${this.escapeHtml(documents.ID)}">
        <th scope="row">
          <div>
            <a href="#" class="doc-title">${title}</a>
            <div class="doc-meta">Version ${version}</div>
          </div>
        </th>
        <td><ul>${contribs}</ul></td>
        <td><ul>${atts}</ul></td>
      </tr>
    `
    }

    private renderTable(): string {
        const rows = this._data.map((d) => this.renderRow(d)).join('')
        return `
      <table class="docs-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Contributors</th>
            <th scope="col">Attachments</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="3"><em>No documents</em></td></tr>`}
        </tbody>
      </table>
    `
    }

    private render() {
        // Estados básicos: loading / error / table
        if (this.isLoading) {
            this.innerHTML = `
        <div class="docs-table__loading" role="status" aria-live="polite">Loading documents…</div>
      `
            return
        }

        if (this.lastError) {
            this.innerHTML = `
        <div class="docs-table__error" role="alert">
          Failed to load documents: ${this.escapeHtml(this.lastError)}
          ${this._src ? `<button class="docs-table__retry" type="button">Retry</button>` : ''}
        </div>
      `
            // Wire retry
            this.querySelector<HTMLButtonElement>(
                '.docs-table__retry'
            )?.addEventListener('click', () => this.fetchAndRender())
            return
        }

        // OK
        this.innerHTML = this.renderTable()

        // Reenviar click en título como evento del componente
        this.querySelectorAll<HTMLAnchorElement>('.doc-title').forEach((a) => {
            a.addEventListener('click', (ev) => {
                ev.preventDefault()
                const tr = (ev.currentTarget as HTMLElement).closest('tr')
                const id = tr?.getAttribute('data-id') ?? ''
                this.dispatchEvent(
                    new CustomEvent('doc-click', {
                        detail: { id },
                        bubbles: true,
                        composed: true,
                    })
                )
            })
        })
    }
}

// Registro seguro
const tag = 'docs-table'
if (!customElements.get(tag)) customElements.define(tag, DocsTable)

// Tipado global (si prefieres, muévelo a types/custom-elements.d.ts)
declare global {
    interface HTMLElementTagNameMap {
        'docs-table2': DocsTable
    }
}
