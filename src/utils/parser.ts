import type { TDocument, TNotification } from '@/types'

export function fromNotificationToDocument(
    notification: TNotification
): TDocument {
    return {
        Attachments: [],
        Contributors: [
            {
                ID: notification.UserID,
                Name: notification.UserName,
            },
        ],
        CreatedAt: notification.Timestamp,
        ID: notification.DocumentID,
        Title: notification.DocumentTitle,
        Version: '1.0.0',
    }
}
