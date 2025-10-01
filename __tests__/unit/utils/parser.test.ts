import { describe, it, expect } from 'vitest'
import { fromNotificationToDocument } from '@/utils/parser'

describe('fromNotificationToDocument', () => {
    const mockNotification = {
        UserID: 'user-123',
        UserName: 'Jane Doe',
        Timestamp: '2025-10-01T10:00:00.000Z',
        DocumentID: 'doc-456',
        DocumentTitle: 'Quarterly Report',
    }

    const expectedDocument = {
        Attachments: [],
        Contributors: [{ ID: 'user-123', Name: 'Jane Doe' }],
        CreatedAt: '2025-10-01T10:00:00.000Z',
        UpdatedAt: '2025-10-01T10:00:00.000Z',
        ID: 'doc-456',
        Title: 'Quarterly Report',
        Version: '1.0.0',
    }

    describe('field mapping', () => {
        it('should transform notification to document with correct structure', () => {
            const result = fromNotificationToDocument(mockNotification as any)
            expect(result).toEqual(expectedDocument)
        })

        it('should map DocumentID to ID', () => {
            const result = fromNotificationToDocument(mockNotification as any)
            expect(result.ID).toBe(mockNotification.DocumentID)
        })

        it('should map DocumentTitle to Title', () => {
            const result = fromNotificationToDocument(mockNotification as any)
            expect(result.Title).toBe(mockNotification.DocumentTitle)
        })

        it('should use Timestamp for both CreatedAt and UpdatedAt', () => {
            const result = fromNotificationToDocument(mockNotification as any)
            expect(result.CreatedAt).toBe(mockNotification.Timestamp)
            expect(result.UpdatedAt).toBe(mockNotification.Timestamp)
        })
    })

    describe('default values', () => {
        it('should initialize Attachments as empty array', () => {
            const result = fromNotificationToDocument(mockNotification as any)
            expect(result.Attachments).toEqual([])
        })

        it('should set Version to 1.0.0', () => {
            const result = fromNotificationToDocument(mockNotification as any)
            expect(result.Version).toBe('1.0.0')
        })
    })

    describe('contributors handling', () => {
        it('should create Contributors array with user information', () => {
            const result = fromNotificationToDocument(mockNotification as any)

            expect(result.Contributors).toHaveLength(1)
            expect(result.Contributors[0]).toEqual({
                ID: mockNotification.UserID,
                Name: mockNotification.UserName,
            })
        })
    })

    describe('edge cases', () => {
        it('should handle special characters in user and document names', () => {
            const notificationWithSpecialChars = {
                ...mockNotification,
                UserName: 'Ana Pérez (New)',
                DocumentTitle: 'Note – Sprint #42 ✅',
            }

            const result = fromNotificationToDocument(
                notificationWithSpecialChars as any
            )

            expect(result.Contributors[0].Name).toBe('Ana Pérez (New)')
            expect(result.Title).toBe('Note – Sprint #42 ✅')
        })

        it('should only include expected properties in result', () => {
            const result = fromNotificationToDocument(mockNotification as any)
            const expectedKeys = [
                'Attachments',
                'Contributors',
                'CreatedAt',
                'UpdatedAt',
                'ID',
                'Title',
                'Version',
            ]

            expect(Object.keys(result).sort()).toEqual(expectedKeys.sort())
        })
    })
})
