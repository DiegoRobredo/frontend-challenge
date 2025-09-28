import type { TDocument, TSortField, TDocumentVersion } from '@/types'

function SortByName(a: TDocument, b: TDocument): number {
    return a.Title.localeCompare(b.Title)
}

function SortByDate(a: TDocument, b: TDocument): number {
    return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
}

function SortByVersion(a: TDocument, b: TDocument): number {
    const toNumberArray = (version: TDocumentVersion): number[] => {
        return version.split('.').map((num) => parseInt(num, 10))
    }

    const arr1 = toNumberArray(a.Version)
    const arr2 = toNumberArray(b.Version)

    return arr1[0] - arr2[0] || arr1[1] - arr2[1] || arr1[2] - arr2[2]
}

export function sortDocuments(
    data: TDocument[],
    field: TSortField
): TDocument[] {
    const sortMethod: (a: TDocument, b: TDocument) => number = {
        name: SortByName,
        date: SortByDate,
        version: SortByVersion,
        '': () => 0,
    }[field]

    if (!sortMethod) {
        throw new Error(`Unknown sort field: ${field}`)
    }

    return [...data].sort(sortMethod)
}
