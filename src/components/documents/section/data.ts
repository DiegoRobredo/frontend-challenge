import type { TSortField, TDocument, TNotification } from '@/types'
import { sortDocuments } from '@/utils/sorter'
import { fromNotificationToDocument } from '@/utils/parser'

export function mergeNotifications(
    docs: TDocument[],
    notifs: TNotification[]
): TDocument[] {
    return docs.concat(notifs.map(fromNotificationToDocument))
}

export function applySort(docs: TDocument[], field: TSortField): TDocument[] {
    return sortDocuments(docs, field)
}
