/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import '@/components/notification-button' // define custom element

describe('<notification-button> attribute/property robustness', () => {
    let notificationButton: any

    beforeEach(() => {
        notificationButton = document.createElement('notification-button')
        document.body.appendChild(notificationButton)
    })

    afterEach(() => {
        document.body.removeChild(notificationButton)
    })

    it('should sanitize invalid count attribute to 0 and keep property and attribute synchronized', async () => {
        // Arrange: Set invalid count attribute
        notificationButton.setAttribute('count', 'NaN')

        // Act: Component processes the invalid value
        // Assert: Should fallback to 0
        expect(notificationButton.count).toBe(0)
        expect(notificationButton.getAttribute('count')).toBe('0')
    })

    it('should update both attribute and UI when count property changes', async () => {
        // Arrange: Valid count value
        const expectedCount = 5

        // Act: Update count via property
        notificationButton.count = expectedCount

        // Assert: Should reflect to attribute
        expect(notificationButton.getAttribute('count')).toBe(
            expectedCount.toString()
        )

        // And: Should update UI after microtask
        await nextTick()
        const badge = getBadgeElement(notificationButton)
        expect(badge.textContent).toBe(expectedCount.toString())
    })

    // Helper functions for better readability
    function getBadgeElement(element: any): HTMLSpanElement {
        const badge = element.querySelector('#notifBadge') as HTMLSpanElement
        expect(badge).toBeTruthy() // Ensure badge exists
        return badge
    }

    function nextTick(): Promise<void> {
        return Promise.resolve()
    }
})
