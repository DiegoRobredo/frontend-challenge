// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Ensures a global <notification-button id="notifBtn"> exists for tests that rely on it.
// Your app likely includes it already; keep this as a safety net.
Cypress.Commands.add('ensureNotifButton', () => {
    cy.document().then((doc) => {
        if (!doc.querySelector('#notifBtn')) {
            const btn = doc.createElement('notification-button')
            btn.id = 'notifBtn'
            doc.body.prepend(btn)
        }
    })
})

// Constants for better maintainability
const SELECTORS = {
    documentsSection: '[data-testid="doc-section"]',
    viewList: '[data-testid="view-list"]',
    viewGrid: '[data-testid="view-grid"]',
    listRows: '[data-testid="doc-row"]',
    gridCards: '[data-testid="doc-card"]',
    gridToggleBtn: '[data-testid="button-grid"]',
    getSortSelector: '[data-testid="sort-select"]',
} as const

Cypress.Commands.add('getDocumentsSection', () =>
    cy.get(SELECTORS.documentsSection)
)
Cypress.Commands.add('getViewList', () => cy.get(SELECTORS.viewList))
Cypress.Commands.add('getViewGrid', () => cy.get(SELECTORS.viewGrid))
Cypress.Commands.add('getGridToggleButton', () =>
    cy.get(SELECTORS.gridToggleBtn)
)
Cypress.Commands.add('getDocumentsSection', () =>
    cy.get(SELECTORS.documentsSection)
)
Cypress.Commands.add('getListRows', () => cy.get(SELECTORS.listRows))
Cypress.Commands.add('getGridCards', () => cy.get(SELECTORS.gridCards))
Cypress.Commands.add('getSortSelector', () => cy.get(SELECTORS.getSortSelector))

Cypress.Commands.add('getDocumentTitles', (selector: string) => {
    return cy.get(selector).then(($elements) =>
        Array.from($elements).map((element) => {
            return element.textContent?.trim() || ''
        })
    )
})

declare global {
    namespace Cypress {
        interface Chainable {
            getDocumentsSection(): Chainable<JQuery<HTMLElement>>
            getListRows(): Chainable<JQuery<HTMLElement>>
            getViewList(): Chainable<JQuery<HTMLElement>>
            getViewGrid(): Chainable<JQuery<HTMLElement>>
            getGridToggleButton(): Chainable<JQuery<HTMLElement>>
            ensureNotifButton(): Chainable<void>
            getListRows(): Chainable<JQuery<HTMLElement>>
            getGridCards(): Chainable<JQuery<HTMLElement>>
            getSortSelector(): Chainable<JQuery<HTMLElement>>
            getDocumentTitles(selector: string): Chainable<string[]>
        }
    }
}
