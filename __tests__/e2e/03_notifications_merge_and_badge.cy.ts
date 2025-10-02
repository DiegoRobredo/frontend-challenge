/// <reference types="cypress" />

/**
 * E2E Test: Notification System Integration
 *
 * 1) Load initial docs (count from API response)
 * 2) Receive notifications (badge updates)
 * 3) Merge into list
 * 4) Keep sort consistent across views
 */

// Test data
const TEST_NOTIFICATIONS = {
    alpha: {
        Timestamp: '2020-08-12T07:30:08.28093+02:00',
        UserID: '3ffe27e5-fe2c-45ea-8b3c-879b757b0455',
        UserName: 'Alicia Wolf',
        DocumentID: 'f09acc46-3875-4eff-8831-10ccf3356420',
        DocumentTitle: 'Alpha',
    },
    zeta: {
        Timestamp: '2020-08-12T07:30:08.281305+02:00',
        UserID: 'fd525a6d-1255-4427-91fa-86af21e805d3',
        UserName: 'Cindy Weissnat',
        DocumentID: '8d9b79cc-a48c-4f62-b385-607feb4276b8',
        DocumentTitle: 'Zeta',
    },
} as const

// Helper class to throw events and interact with the notification button
class NotificationHelper {
    //Throws event to simulate incoming notification
    static dispatch(
        win: Window,
        notification:
            | typeof TEST_NOTIFICATIONS.alpha
            | typeof TEST_NOTIFICATIONS.zeta
    ) {
        const event = new win.CustomEvent('notification-received', {
            detail: { notification },
        })
        win.document.dispatchEvent(event)
    }

    //Clicks the notification button to merge notifications
    static clickButton(win: Window) {
        const button = win.document.querySelector(
            '[data-testid="notif-button"]'
        ) as HTMLButtonElement | null
        if (!button) throw new Error('Notification button not found')
        button.click()
    }

    //Gets the current badge text (number of notifications)
    static getBadgeText(win: Window): string {
        const badge = win.document.querySelector(
            '[data-testid="notif-badge"]'
        ) as HTMLElement | null
        return badge?.textContent?.trim() || '0'
    }
}

describe('Notifications: Badge Updates and Document Merging', () => {
    beforeEach(() => {
        // Intercept ONLY the real API endpoint (avoid matching ESM scripts)
        cy.intercept(
            { method: 'GET', url: 'http://localhost:8080/documents' },
            { fixture: 'documents.initial.json' }
        ).as('getDocs')

        // Disable WebSocket before app boots
        cy.visit('/', {
            onBeforeLoad(win) {
                ;(win as any).__E2E_DISABLE_WS__ = true
            },
        })

        // Capture initial count from the intercepted response and store as alias
        cy.wait('@getDocs').then(({ response }) => {
            const len = Array.isArray(response?.body)
                ? response!.body.length
                : 0
            cy.wrap(len).as('initialCount')
        })

        // Ensure notification button exists (if your layout doesn't render it globally)
        cy.ensureNotifButton()

        // Deterministic sorting
        cy.getSortSelector().select('name')
    })

    it('should update badge count and merge notifications while preserving sort order', () => {
        const N_NOTIFS = 2

        cy.window().then((win) => {
            // Initial badge is 0 (or empty)
            expect(NotificationHelper.getBadgeText(win)).to.match(/^(0|)$/)

            // Simulate two incoming notifications
            NotificationHelper.dispatch(win, TEST_NOTIFICATIONS.alpha)
            NotificationHelper.dispatch(win, TEST_NOTIFICATIONS.zeta)

            // Badge shows "2"
            expect(NotificationHelper.getBadgeText(win)).to.eq(String(N_NOTIFS))

            // Merge (click)
            NotificationHelper.clickButton(win)

            // Badge resets to "0"
            expect(NotificationHelper.getBadgeText(win)).to.eq('0')
        })

        // Assert counts and ordering using the initial count from the API
        cy.get<number>('@initialCount').then((initial) => {
            const expected = initial + N_NOTIFS

            // LIST view: count and order
            cy.getListRows().should('have.length', expected)
            cy.getDocumentTitles("[data-testid='table-title']").then(
                (titles) => {
                    expect(
                        titles[0],
                        'First document should start with "Alpha"'
                    ).to.match(/^Alpha/)
                    expect(
                        titles,
                        'Should contain both new notifications'
                    ).to.include.members([
                        TEST_NOTIFICATIONS.alpha.DocumentTitle,
                        TEST_NOTIFICATIONS.zeta.DocumentTitle,
                    ])
                }
            )

            // GRID view: count and order
            cy.getGridToggleButton().click()
            cy.getGridCards().should('have.length', expected)
            cy.getDocumentTitles("[data-testid='grid-title']").then(
                (titles) => {
                    expect(
                        titles[0],
                        'Grid view should maintain same sort order'
                    ).to.match(/^Alpha/)
                    expect(
                        titles,
                        'Grid view should contain both notifications'
                    ).to.include.members([
                        TEST_NOTIFICATIONS.alpha.DocumentTitle,
                        TEST_NOTIFICATIONS.zeta.DocumentTitle,
                    ])
                }
            )
        })
    })
})
