import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <header class="header">
      <notification-button></notification-button>
    </header>
    <main>
      <h1>Documents</h1>
      <div>
        <sort-box></sort-box>
        <view-toggle></view-toggle>
      </div>
      <section>
        <docs-table id="docs-table" src="http://localhost:8080/documents"></docs-table>

        <div class="actions">
          <button type="button" class="add-document" aria-label="Add document">+ Add document</button>
        </div>
      </section>
      
    </main>
  </div>
`
