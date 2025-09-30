import type { TDocument } from '@/types'
import { DOCUMENTS_API_URL } from '@/server/endpoints'

export async function fetchDocuments(): Promise<TDocument[]> {
    const res = await fetch(DOCUMENTS_API_URL)
    return res.json()
}
