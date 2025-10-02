/// <reference types="cypress" />

import { debug } from 'console'

/**
 * E2E #4 — Add new document via dialog
 *
 * Flow:
 * 1) Load initial documents (read count from API response)
 * 2) Sort by name
 * 3) Click "+ Add document" (data-testid="new-document") to open dialog
 * 4) Fill form and submit (dispatches `document-added`)
 * 5) Assert list/grid have initialCount + 1 and contain the new title
 * 6) Assert ordering by name is preserved
 */

// Test data constants
const TEST_DOCUMENT = {
    title: 'ZZZ New Document', // Chosen to sort at the end
    contributor: 'E2E Bot',
    version: '1.0.0',
} as const

// Page object selectors
const SELECTORS = {
    addDocumentButton: '[data-testid="button-new-document"]',
    dialog: '[data-testid="dialog-new-document"]',
    form: {
        title: '[data-testid="form-title"]',
        contributor: '[data-testid="form-contributor"]',
        version: '[data-testid="form-version"]',
        submitButton: '[data-testid="form-submit"]',
    },
} as const

// Helper functions
class DocumentHelpers {
    static openAddDocumentDialog() {
        cy.get(SELECTORS.addDocumentButton).should('be.visible').click()

        this.assertDialogIsOpen()
    }

    static fillDocumentForm(document = TEST_DOCUMENT) {
        cy.get(SELECTORS.form.title).clear().type(document.title)
        cy.get(SELECTORS.form.contributor).clear().type(document.contributor)
        cy.get(SELECTORS.form.version).clear().type(document.version)
    }

    static submitForm() {
        cy.get(SELECTORS.form.submitButton).click()
        this.assertDialogIsClosed()
    }

    static assertDialogIsOpen() {
        cy.get(SELECTORS.dialog)
            .should('exist')
            .and(($dlg) => {
                const htmlDialog = $dlg.get(0) as HTMLDialogElement
                expect(htmlDialog.open, 'dialog is open').to.be.true
            })
    }

    static assertDialogIsClosed() {
        cy.get(SELECTORS.dialog).should(($dlg) => {
            const htmlDialog = $dlg.get(0) as HTMLDialogElement
            expect(htmlDialog.open, 'dialog is closed').to.be.false
        })
    }

    static assertDocumentCountAndOrder(
        expectedCount: number,
        newTitle: string
    ) {
        // Assert list view
        cy.getListRows().should('have.length', expectedCount)

        cy.getDocumentTitles("[data-testid='table-title']").then((titles) => {
            expect(titles, 'list includes the new document').to.include(
                newTitle
            )
            expect(
                titles[titles.length - 1],
                'new title is last by name in list'
            ).to.eq(newTitle)
        })

        // Switch to grid view and assert
        cy.getGridToggleButton().click()
        cy.getGridCards().should('have.length', expectedCount)

        cy.getDocumentTitles("[data-testid='grid-title']").then((titles) => {
            expect(titles, 'grid includes the new document').to.include(
                newTitle
            )
            expect(
                titles[titles.length - 1],
                'new title is last by name in grid'
            ).to.eq(newTitle)
        })
    }
}

describe('Add document via dialog: ordered insertion and presence in both views', () => {
    beforeEach(() => {
        // Setup API intercept
        cy.intercept(
            { method: 'GET', url: 'http://localhost:8080/documents' },
            { fixture: 'documents.initial.json' }
        ).as('getDocs')

        // Visit app with WebSocket disabled for determinism
        cy.visit('/', {
            onBeforeLoad(win) {
                ;(win as any).__E2E_DISABLE_WS__ = true
            },
        })

        // Capture initial document count
        cy.wait('@getDocs').then(({ response }) => {
            const documentCount = Array.isArray(response?.body)
                ? response!.body.length
                : 0
            cy.wrap(documentCount).as('initialCount')
        })

        // Set deterministic sorting
        cy.getSortSelector().select('name')
    })

    it('adds a new document via dialog and maintains alphabetical order across views', () => {
        debugger
        // Open the add document dialog
        DocumentHelpers.openAddDocumentDialog()

        debugger
        // Fill and submit the form
        DocumentHelpers.fillDocumentForm()
        DocumentHelpers.submitForm()

        // Verify document was added and order is maintained
        cy.get<number>('@initialCount').then((initialCount) => {
            const expectedCount = initialCount + 1
            DocumentHelpers.assertDocumentCountAndOrder(
                expectedCount,
                TEST_DOCUMENT.title
            )
        })
    })
})
