import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { startWS } from './server/notificationsSubscription'
import type { TNotification, TDocument, TDocumentVersion } from '@/types'
import { WS_URL } from './server/endpoints'
import { NewDocumentDialog } from '@/templates/new-document-dialog'

//TODO: Mover a otro sitio para controlar mejor el websocket
startWS((notification: TNotification) => {
    // callback al recibir datos
    document.dispatchEvent(
        new CustomEvent('notification-received', {
            detail: { notification },
            bubbles: true,
            composed: true,
        })
    )
}, WS_URL)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <header class="header">
      <notification-button class="notification-element" id="notifBtn"></notification-button>
    </header>
    <main class="main-content">
      <h1 class="main-title">Documents</h1>
      <documents-section class="documents-section"></documents-section>
      <button commandfor="new-document" command="show-modal" type="button" class="add-document_button" aria-label="Add document">+ Add document</button>
      ${NewDocumentDialog}
    </main>
`

document.querySelector('#documentForm')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const creationDate: string = new Date().toISOString()
    const dialog = document.querySelector('#new-document') as HTMLDialogElement
    const form = document.querySelector('#documentForm') as HTMLFormElement
    const formData = new FormData(form)
    const documentData: TDocument = {
        Title: formData.get('docTitle') as string,
        Contributors: [
            {
                Name: formData.get('docContributor') as string,
                ID: crypto.randomUUID(),
            },
        ],
        Attachments: [],
        //TODO: Validate version format
        Version: formData.get('docVersion') as TDocumentVersion,
        CreatedAt: creationDate,
        UpdatedAt: creationDate,
        ID: crypto.randomUUID(),
    }

    document.dispatchEvent(
        new CustomEvent('document-added', {
            detail: { document: documentData },
            bubbles: true,
            composed: true,
        })
    )

    form.reset()
    dialog.close()
})

document.querySelector('#new-document')?.addEventListener('close', () => {
    const form = document.querySelector('#documentForm') as HTMLFormElement
    form.reset()
})
