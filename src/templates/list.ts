export function listTemplate(
    attributes: { [key: string]: string } = {},
    data: string[]
): string {
    const attrs = Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

    return `
    <ul ${attrs}>
        ${data.map((item) => `<li>${item}</li>`).join('')}
    </ul>
    `
}
