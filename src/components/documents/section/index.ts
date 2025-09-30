// documents-section.ts
import type { TDocument, TNotification, TSortField, TViewMode } from '@/types'
import { NotificationButton } from '@/components/notification-button'
import { applySort, mergeNotifications } from './data'
import {
    renderShell,
    getRefs,
    setData,
    setView as updateView,
} from './interface'
import { attachEvents } from './events'
import { fetchDocuments } from '@/server/documents'

export class DocumentsSection extends HTMLElement {
    private mode: TViewMode = 'list'
    private sortField: TSortField = ''
    private data: TDocument[] = []
    private notifications: TNotification[] = []
    private refs!: ReturnType<typeof getRefs>
    private notifButton: HTMLElementTagNameMap['notification-button'] | null =
        null
    private eventsAborter: AbortController | null = null

    connectedCallback() {
        renderShell(this)
        this.refs = getRefs(this)
        this.notifButton = document.querySelector(
            '#notifBtn'
        ) as NotificationButton | null

        // Listeners
        this.eventsAborter = attachEvents(this, {
            onViewChange: (mode) => this.setView(mode),
            onSortChange: (field) => this.setSort(field),
            onNotifReceived: (notification) => {
                this.notifications.push(notification)
                this.updateCounter()
            },
            onNotifClick: () => {
                this.data = mergeNotifications(this.data, this.notifications)
                this.notifications = []
                this.renderData()
                this.updateCounter()
            },
            onDocAdded: (doc) => {
                this.data.push(doc)
                this.renderData()
            },
        })

        // Render initial data
        this.fetchAndFill()

        // Initial view
        this.setView(this.mode)
    }

    disconnectedCallback() {
        this.eventsAborter?.abort()
    }

    private async fetchAndFill() {
        this.data = await fetchDocuments()
        this.renderData()
    }

    private renderData() {
        // Keep data sorted when updatings notifications or new docs
        this.data = applySort(this.data, this.sortField)
        setData(this.refs, this.data)
    }

    private setView(viewMode: TViewMode) {
        if (this.mode === viewMode) return
        this.mode = viewMode
        updateView(this, viewMode)
    }

    private setSort(field: TSortField) {
        this.sortField = field || ''
        this.renderData()
    }

    private updateCounter() {
        if (this.notifButton) this.notifButton.count = this.notifications.length
    }
}

customElements.define('documents-section', DocumentsSection)
