import type { TViewMode } from '@/types/ViewMode'
import type { TSortField } from '@/types/SortField'
import type { TDocument } from '@/types/Document'
import type { TNotification } from '@/types/Notification'
import { DocsTable } from '../table'
import { DocsGrid } from '../grid'
import { NotificationButton } from '../../notification-button'
import { sortDocuments } from '@/utils/sorter'
import { fromNotificationToDocument } from '@/utils/parser'
import { changeView } from './visibility'

export class DocumentsSection extends HTMLElement {
    private mode: TViewMode = 'list'
    private sortField: TSortField = ''
    private data: TDocument[] = []
    private notifButton: NotificationButton | null = null
    private table: DocsTable | null = null
    private grid: DocsGrid | null = null
    private notifications: TNotification[] = []

    connectedCallback() {
        this.render()

        this.table = this.querySelector('#docsTable') as DocsTable
        this.grid = this.querySelector('#docsGrid') as DocsGrid
        this.notifButton = document.querySelector(
            '#notifBtn'
        ) as NotificationButton

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

        document.addEventListener('notification-received', (e) => {
            const notification = (
                e as CustomEvent<{ notification: TNotification }>
            ).detail.notification
            this.notifications.push(notification)
            this.updateCounter()
        })

        document.addEventListener('notification-click', () => {
            this.data = this.data.concat(
                this.notifications.map(fromNotificationToDocument)
            )
            this.renderContainersData()
            this.notifications = []
            this.updateCounter()
        })

        this.addEventListener('refresh-data', () => {
            this.fetchAndFillData()
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
        //Filtramos al renderizar el contenido para mantener la ordenación en caso de agregar nuevos documentos desde las notificaciones o al cargar un nuevo documento
        const sorted = sortDocuments(this.data, this.sortField)
        this.data = sorted

        if (this.table) this.table.data = this.data
        if (this.grid) this.grid.data = this.data
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

        this.setView(this.mode)
    }

    private setView(viewMode: TViewMode) {
        if (this.mode === viewMode) return
        this.mode = viewMode

        changeView(this, viewMode)
    }

    private setSort(field: TSortField): void {
        if (!field) return this.renderContainersData()
        this.sortField = field

        this.renderContainersData()
    }

    private updateCounter(): void {
        if (this.notifButton) {
            this.notifButton.count = this.notifications.length
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
