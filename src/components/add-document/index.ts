export class NewDocumentDialog extends HTMLDialogElement {
    connectedCallback(): void {
        this.render()
    }

    render(): void {
        this.innerHTML = `
        <dialog class="dialog" id="mydialog">
        <header class="dialog-header">
          <h3>Add new document</h3>
          <button class="dialog__close-button" commandfor="mydialog" command="close" ><i class="fa-solid fa-xmark"></i></button>
        </header>
        <form class="form" method="dialog" id="documentForm">
          <formElement class="form-element">
            <label for="docTitle">Document title:</label>
            <input placeholder="Enter document title" type="text" id="docTitle" name="docTitle" required />
          </formElement>
          <formElement class="form-element">
            <label for="docContributor">Contributor:</label>
            <input placeholder="Enter contributor name" type="text" id="docContributor" name="docContributor" required />
          </formElement>
          <formElement class="form-element">
            <label for="docVersion">Version:</label>
            <input placeholder="Enter version" type="text" id="docVersion" name="docVersion" required />
          </formElement>
          <button type="submit" class="dialog__add-document">Add Document</button>
        </form>
      </dialog>
    `
    }
}

customElements.define('new-document-dialog', NewDocumentDialog, {
    extends: 'dialog',
})
declare global {
    interface HTMLElementTagNameMap {
        'new-document-dialog': NewDocumentDialog
    }
}
