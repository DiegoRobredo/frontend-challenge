import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

import {
    setView,
    showElement,
    hideElement,
} from '@/components/documents/section/interface'

describe('Documents Section DOM Helpers', () => {
    afterEach(() => {
        // Clean up DOM after each test
        document.body.innerHTML = ''
    })

    describe('setView()', () => {
        it('should handle missing view sections gracefully', () => {
            const emptyRoot = document.createElement('div')

            expect(() => setView(emptyRoot, 'list' as string)).not.toThrow()
            expect(() => setView(emptyRoot, 'grid' as string)).not.toThrow()
        })
    })

    describe('Element visibility helpers', () => {
        let testElement: HTMLElement

        beforeEach(() => {
            testElement = document.createElement('section')
        })

        it('should hide element and make it inert when hideElement() is called', () => {
            hideElement(testElement)

            expect(testElement.hidden).toBe(true)
            expect(testElement.getAttribute('inert')).toBe('')
        })

        it('should show element and remove inert when showElement() is called', () => {
            // First hide the element
            hideElement(testElement)

            // Then show it
            showElement(testElement)

            expect(testElement.hidden).toBe(false)
            expect(testElement.hasAttribute('inert')).toBe(false)
        })

        it('should be safe to call hideElement() multiple times', () => {
            hideElement(testElement)
            hideElement(testElement)

            expect(testElement.hidden).toBe(true)
            expect(testElement.getAttribute('inert')).toBe('')
        })

        it('should be safe to call showElement() multiple times', () => {
            hideElement(testElement) // Start hidden

            showElement(testElement)
            showElement(testElement)

            expect(testElement.hidden).toBe(false)
            expect(testElement.hasAttribute('inert')).toBe(false)
        })
    })
})
