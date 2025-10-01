/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
    renderShell as renderGridShell,
    setData as setGridData,
} from '@/components/documents/grid/interface'

interface TestDocument {
    ID: string
    Title: string
    Version: string
    CreatedAt?: string | null
    UpdatedAt?: string | null
    Contributors?: any[] | null
    Attachments?: any[] | null
}

describe('Documents Grid Component - Optional Fields Handling', () => {
    let gridContainer: HTMLDivElement

    beforeEach(() => {
        gridContainer = document.createElement('div')
        renderGridShell(gridContainer)
    })

    it('should render documents with missing optional fields without errors', () => {
        // Arrange
        const documentsWithMissingFields: TestDocument[] = [
            {
                ID: 'doc-1',
                Title: 'Document with undefined fields',
                Version: '1.0',
                CreatedAt: undefined,
                UpdatedAt: null,
                Contributors: undefined,
                Attachments: null,
            },
            {
                ID: 'doc-2',
                Title: 'Document with missing arrays',
                Version: '2.0',
                CreatedAt: '2023-01-01',
                UpdatedAt: '2023-01-02',
                // Contributors and Attachments completely missing
            },
        ]

        // Act & Assert
        expect(() =>
            setGridData(gridContainer, documentsWithMissingFields)
        ).not.toThrow()

        const renderedCards = gridContainer.querySelectorAll('article.doc-card')
        expect(renderedCards).toHaveLength(2)
    })

    it('should handle completely empty data arrays', () => {
        // Arrange
        const emptyData: TestDocument[] = []

        // Act & Assert
        expect(() => setGridData(gridContainer, emptyData)).not.toThrow()

        const renderedCards = gridContainer.querySelectorAll('article.doc-card')
        expect(renderedCards).toHaveLength(0)
    })
})
