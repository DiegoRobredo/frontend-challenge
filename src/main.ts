import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { startWS } from './server/notificationsSubscription'
import type { TNotification, TDocument, TDocumentVersion } from '@/types'

//TODO: Poner en .env y mover a otro sitio para controlar mejor el websocket
const url = 'ws://localhost:8080/notifications'
startWS((notification: TNotification) => {
    // callback al recibir datos
    document.dispatchEvent(
        new CustomEvent('notification-received', {
            detail: { notification },
            bubbles: true,
            composed: true,
        })
    )
}, url)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <header class="header">
      <notification-button id="notifBtn"></notification-button>
    </header>
    <main>
      <h1>Documents</h1>
      <documents-section></documents-section>
      <button commandfor="mydialog" command="show-modal" type="button" class="add-document" aria-label="Add document">+ Add document</button>
      <dialog id="mydialog">
        <form method="dialog" id="documentForm">
          <label for="docTitle">Document title:</label>
          <input type="text" id="docTitle" name="docTitle" required />
          <label for="docContributor">Contributor:</label>
          <input type="text" id="docContributor" name="docContributor" required />
          <label for="docVersion">Version:</label>
          <input type="text" id="docVersion" name="docVersion" required />
          <button type="submit" cli>Add Document</button>
          </form>
          <button commandfor="mydialog" command="close" >Close</button>
      </dialog>
    </main>
`
document.querySelector('#documentForm')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const creationDate: string = new Date().toISOString()
    const formData = new FormData(e.target as HTMLFormElement)
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
})

document.querySelector('#mydialog')?.addEventListener('close', () => {
    const formData = document.querySelector('#documentForm') as HTMLFormElement
    formData.reset()
})
