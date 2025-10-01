import { describe, it, expect } from 'vitest'
import { sortDocuments } from '@/utils/sorter'

// Helper to create test documents with sensible defaults
const createTestDocument = (overrides: Partial<any> = {}) =>
    ({
        ID: 'default-id',
        Title: 'Default Title',
        CreatedAt: '2025-01-01T00:00:00.000Z',
        UpdatedAt: '2025-01-01T00:00:00.000Z',
        Version: '1.0.0',
        Attachments: [],
        Contributors: [],
        ...overrides,
    }) as any

describe('sortDocuments', () => {
    // Test data with clear, meaningful names and dates
    const testDocuments = [
        createTestDocument({
            ID: 'doc-1',
            Title: 'Zebra Project',
            CreatedAt: '2024-01-01T00:00:00.000Z', // Oldest
            Version: '1.0.0',
        }),
        createTestDocument({
            ID: 'doc-2',
            Title: 'Alpha Release',
            CreatedAt: '2025-12-31T23:59:59.000Z', // Newest
            Version: '1.2.0',
        }),
        createTestDocument({
            ID: 'doc-3',
            Title: 'Álvaro Guide', // Special character for locale testing
            CreatedAt: '2025-06-15T12:00:00.000Z', // Middle
            Version: '2.0.0',
        }),
        createTestDocument({
            ID: 'doc-4',
            Title: 'Beta Testing',
            CreatedAt: '2024-06-01T00:00:00.000Z', // Second oldest
            Version: '1.10.3',
        }),
    ]

    describe('sorting by name', () => {
        it('should sort documents alphabetically using locale comparison', () => {
            const result = sortDocuments(testDocuments, 'name')

            const titles = result.map((doc) => doc.Title)
            expect(titles).toEqual([
                'Alpha Release',
                'Álvaro Guide',
                'Beta Testing',
                'Zebra Project',
            ])
        })
    })

    describe('sorting by date', () => {
        it('should sort documents by creation date (newest first)', () => {
            const result = sortDocuments(testDocuments, 'date')

            const documentIds = result.map((doc) => doc.ID)
            // Expected order: doc-2 (2025-12-31) > doc-3 (2025-06-15) > doc-4 (2024-06-01) > doc-1 (2024-01-01)
            expect(documentIds).toEqual(['doc-2', 'doc-3', 'doc-4', 'doc-1'])
        })
    })

    describe('sorting by version', () => {
        it('should sort documents by semantic version (ascending)', () => {
            const result = sortDocuments(testDocuments, 'version')

            const documentIds = result.map((doc) => doc.ID)
            // Expected order: 1.0.0 < 1.2.0 < 1.10.3 < 2.0.0
            expect(documentIds).toEqual(['doc-1', 'doc-2', 'doc-4', 'doc-3'])
        })

        it('should handle major version differences correctly', () => {
            const versionTestDocs = [
                createTestDocument({ ID: 'v1', Version: '10.0.0' }),
                createTestDocument({ ID: 'v2', Version: '2.5.9' }),
                createTestDocument({ ID: 'v3', Version: '2.10.0' }),
            ]

            const result = sortDocuments(versionTestDocs, 'version')

            const versions = result.map((doc) => doc.Version)
            expect(versions).toEqual(['2.5.9', '2.10.0', '10.0.0'])
        })
    })

    describe('edge cases', () => {
        it('should return unchanged copy when sort field is empty', () => {
            const originalOrder = testDocuments.map((doc) => doc.ID)

            const result = sortDocuments(testDocuments, '')

            expect(result.map((doc) => doc.ID)).toEqual(originalOrder)
            expect(result).not.toBe(testDocuments) // Should be a new array
        })

        it('should throw error for unknown sort field', () => {
            expect(() =>
                sortDocuments(testDocuments, 'invalidField')
            ).toThrowError(/Unknown sort field: invalidField/)
        })

        it('should handle documents with identical titles', () => {
            const duplicateTitleDocs = [
                createTestDocument({
                    ID: 'dup-1',
                    Title: 'Same Title',
                    Version: '1.0.0',
                }),
                createTestDocument({
                    ID: 'dup-2',
                    Title: 'Same Title',
                    Version: '1.0.1',
                }),
            ]

            const result = sortDocuments(duplicateTitleDocs, 'name')

            // Should return all documents without losing any
            expect(result).toHaveLength(2)
            expect(result.map((doc) => doc.ID).sort()).toEqual([
                'dup-1',
                'dup-2',
            ])
            expect(result).not.toBe(duplicateTitleDocs)
        })
    })

    describe('immutability', () => {
        it('should never mutate the original array', () => {
            const originalIds = testDocuments.map((doc) => doc.ID)

            // Perform multiple sorts
            sortDocuments(testDocuments, 'name')
            sortDocuments(testDocuments, 'date')
            sortDocuments(testDocuments, 'version')
            sortDocuments(testDocuments, '')

            // Original array should remain unchanged
            expect(testDocuments.map((doc) => doc.ID)).toEqual(originalIds)
        })
    })
})
