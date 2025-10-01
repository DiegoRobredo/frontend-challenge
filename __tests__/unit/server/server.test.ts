import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

import { fetchDocuments } from '@/server/documents'

describe.only('documents service (error cases)', () => {
    let mockFetch: ReturnType<typeof vi.fn>
    const originalFetch = globalThis.fetch

    beforeEach(() => {
        mockFetch = vi.fn()
        globalThis.fetch = mockFetch
    })

    afterEach(() => {
        globalThis.fetch = originalFetch
        vi.restoreAllMocks()
    })

    describe('when network request fails', () => {
        it('should throw the original network error', async () => {
            // Arrange
            const networkError = new Error('Network connection failed')
            mockFetch.mockRejectedValue(networkError)

            // Act
            const fetchPromise = fetchDocuments()

            // Assert
            await expect(fetchPromise).rejects.toThrow(
                'Network connection failed'
            )
            expect(mockFetch).toHaveBeenCalledTimes(1)
        })
    })
})
