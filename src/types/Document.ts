import type { TContributor } from '@/types'

type Version = `${number}.${number}.${number}`

export type TDocumentVersion = Version

export type TDocument = {
    Attachments: string[]
    Contributors: TContributor[]
    CreatedAt: string
    ID: string
    Title: string
    UpdatedAt?: string
    Version: Version
}
