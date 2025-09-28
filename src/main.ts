import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { startWS } from './server/notificationsSubscription'
import type { TNotification } from '@/types/Notification'

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
  <div class="container">
    <header class="header">
      <notification-button id="notifBtn"></notification-button>
    </header>
    <main>
      <h1>Documents</h1>
      <documents-section></documents-section>
      <div class="actions">
        <button type="button" class="add-document" aria-label="Add document">+ Add document</button>
      </div>
      
    </main>
  </div>
`
