/// <reference types="cypress" />

import { debug } from 'console'

/**
 * E2E Test: Verify that document sorting persists when switching between list and grid views
 *
 * Test Flow:
 * 1. Load documents page with unsorted data
 * 2. Apply sort by name (ascending)
 * 3. Verify sort order in list view
 * 4. Switch to grid view
 * 5. Verify same sort order is maintained in grid view
 */

describe('Documents: Sort Persistence Across View Changes', () => {
    const EXPECTED_SORTED_TITLES = ['Bravo', 'Charlie', 'Delta']
    const SORT_FIELD = 'name'

    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:8080/documents', {
            fixture: 'documents.initial.json',
        }).as('getDocs')
        cy.visit('/')
        cy.wait('@getDocs')
    })

    it('should maintain sort order when switching from list to grid view', () => {
        // Apply sort by name
        cy.getSortSelector().select(SORT_FIELD)

        // Verify sort order in list view
        cy.getDocumentTitles('[data-testid="table-title"]').then((titles) => {
            expect(titles).to.deep.equal(EXPECTED_SORTED_TITLES)
        })

        // Switch to grid view
        cy.getGridToggleButton().click()

        // Verify same sort order is maintained in grid view
        cy.getDocumentTitles('[data-testid="grid-title"]').should(
            'deep.equal',
            EXPECTED_SORTED_TITLES
        )
    })
})
