// documents.events.ts
import type {
    ViewChangeDetail,
    SortChangeDetail,
    NotifDetail,
    DocAddedDetail,
} from '@/types/index.ts'

import { EVENTS } from '@/utils/constants'

type Handlers = {
    onViewChange: (mode: ViewChangeDetail['mode']) => void
    onSortChange: (field: SortChangeDetail['field']) => void
    onNotifReceived: (n: NotifDetail['notification']) => void
    onNotifClick: () => void
    onDocAdded: (doc: DocAddedDetail['document']) => void
}

// Attach event listeners to one AbortController to facilitate cleanup on disconnect
export function attachEvents(
    host: HTMLElement,
    handlers: Handlers
): AbortController {
    const ac = new AbortController()
    const { signal } = ac

    host.addEventListener(
        EVENTS.VIEW_CHANGE,
        (e: Event) => {
            handlers.onViewChange(
                (e as CustomEvent<ViewChangeDetail>).detail.mode
            )
        },
        { signal }
    )

    host.addEventListener(
        EVENTS.SORT_CHANGE,
        (e: Event) => {
            handlers.onSortChange(
                (e as CustomEvent<SortChangeDetail>).detail.field
            )
        },
        { signal }
    )

    document.addEventListener(
        EVENTS.NOTIFICATION_RECEIVED,
        (e: Event) => {
            handlers.onNotifReceived(
                (e as CustomEvent<NotifDetail>).detail.notification
            )
        },
        { signal }
    )

    document.addEventListener(
        EVENTS.NOTIFICATION_CLICK,
        () => {
            handlers.onNotifClick()
        },
        { signal }
    )

    document.addEventListener(
        EVENTS.DOCUMENT_ADDED,
        (e: Event) => {
            handlers.onDocAdded(
                (e as CustomEvent<DocAddedDetail>).detail.document
            )
        },
        { signal }
    )

    return ac
}
