/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
    renderShell as renderTableShell,
    setData as setTableData,
} from '@/components/documents/table/interface'

describe('Document Table Component - Optional Fields Handling', () => {
    let tableContainer: HTMLDivElement

    beforeEach(() => {
        tableContainer = document.createElement('div')
        renderTableShell(tableContainer)
    })

    it('should handle documents with missing or null optional fields', () => {
        // Arrange: Create test data with various missing/null optional fields
        const documentsWithMissingFields = [
            {
                ID: 'doc-001',
                Title: 'Document Alpha',
                Version: '1.0',
                CreatedAt: undefined,
                UpdatedAt: null,
                Contributors: undefined,
                Attachments: null,
            },
            {
                ID: 'doc-002',
                Title: 'Document Beta',
                Version: '2.0',
                CreatedAt: '2024-01-01',
                UpdatedAt: '2024-01-02',
                // Contributors and Attachments properties completely missing
            },
        ]

        // Act & Assert: Should not throw when rendering incomplete data
        expect(() => {
            setTableData(tableContainer, documentsWithMissingFields)
        }).not.toThrow()

        // Verify that all documents are rendered despite missing fields
        const renderedRows = tableContainer.querySelectorAll(
            'tbody tr.docs-table__row'
        )
        expect(renderedRows).toHaveLength(documentsWithMissingFields.length)
    })

    it('should render table with complete document data', () => {
        // Arrange: Create test data with all fields present
        const completeDocuments = [
            {
                ID: 'doc-003',
                Title: 'Complete Document',
                Version: '3.0',
                CreatedAt: '2024-01-01',
                UpdatedAt: '2024-01-02',
                Contributors: ['user1', 'user2'],
                Attachments: ['file1.pdf', 'file2.doc'],
            },
        ]

        // Act
        setTableData(tableContainer, completeDocuments)

        // Assert
        const renderedRows = tableContainer.querySelectorAll(
            'tbody tr.docs-table__row'
        )
        expect(renderedRows).toHaveLength(1)
    })

    it('should handle completely empty data arrays', () => {
        // Arrange
        const emptyData: any[] = []

        // Act & Assert
        expect(() => {
            setTableData(tableContainer, emptyData)
        }).not.toThrow()

        // Verify that no rows are rendered for empty data
        const renderedRows = tableContainer.querySelectorAll(
            'tbody tr.docs-table__row'
        )
        expect(renderedRows).toHaveLength(0)
    })
})
