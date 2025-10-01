export function normalizeCount(input: unknown): number {
    const n = Number(input)
    if (!Number.isFinite(n) || n < 0) return 0
    return Math.floor(n)
}

export function reflectAttrIfNeeded(
    el: Element,
    name: string,
    value: string
): void {
    if (el.getAttribute(name) !== value) el.setAttribute(name, value)
}
