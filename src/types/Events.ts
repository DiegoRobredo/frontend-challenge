import type { TSortField } from '@/types/SortField'
import type { TNotification } from '@/types/Notification'
import type { TDocument } from '@/types/Document'
import type { TViewMode } from '@/types'

export type ViewChangeDetail = { mode: TViewMode }
export type SortChangeDetail = { field: TSortField }
export type NotifDetail = { notification: TNotification }
export type DocAddedDetail = { document: TDocument }
