/// <reference types="cypress" />

/**
 * Flow: Load documents from API and switch between List/Grid views.
 * Validates initial rendering, API intercept, and view toggle behavior.
 */

describe('Documents: load and change view', () => {
    const EXPECTED_DOCUMENTS_COUNT = 3

    beforeEach(() => {
        // Intercept API call and use fixture
        cy.intercept('GET', 'http://localhost:8080/documents', {
            fixture: 'documents.initial.json',
        }).as('getDocs')

        cy.visit('/')
        cy.wait('@getDocs')

        // Verify documents section is loaded
        cy.getDocumentsSection().should('exist')
    })

    it('should render list view by default with correct document count', () => {
        // Verify initial state: list visible, grid hidden
        cy.getViewList().should('be.visible')
        cy.getViewGrid().should('not.be.visible')

        // Verify document count in list view
        cy.getListRows().should('have.length', EXPECTED_DOCUMENTS_COUNT)
    })

    it('should toggle from list to grid view successfully', () => {
        // Start with list view verification
        cy.getViewList().should('be.visible')
        cy.getViewGrid().should('not.be.visible')

        // Toggle to grid view
        cy.getGridToggleButton().click()

        // Verify grid view is now active
        cy.getViewGrid().should('be.visible')
        cy.getViewList().should('not.be.visible')

        // Verify document count in grid view
        cy.getGridCards().should('have.length', EXPECTED_DOCUMENTS_COUNT)
    })
})
