import type { TContributor } from '@/types/Contributor'
export type TDocument = {
    Attachments: string[]
    Contributors: TContributor[]
    CreatedAt: string
    ID: string
    Title: string
    UpdatedAt?: string
    Version: string // p.ej. "5.3.15"
}
