import type { TDocument } from '@/types'
import { relativeFormatDate } from '@/utils/formater'
import { listTemplate } from '@/templates/list'

export function renderShell(root: HTMLElement): void {
    root.innerHTML = `
    <div class="docs-grid" id="docsGridContainer"></div>
  `
}

export function getRefs(root: HTMLElement) {
    return {
        container: root.querySelector(
            '#docsGridContainer'
        ) as HTMLDivElement | null,
    }
}

export function renderCard(doc: TDocument): string {
    const contributors = (doc.Contributors ?? []).map((c) => c.Name)
    const attachments = doc.Attachments ?? []

    return `
    <article class="doc-card" data-id="${doc.ID}">
      <span class="doc-title doc-card__title">${doc.Title}</span>
      <span class="doc-version">Version ${doc.Version}</span>
      <span class="doc-date">Created ${relativeFormatDate(doc.CreatedAt)}</span>
      <span class="doc-date">Updated ${relativeFormatDate(doc.UpdatedAt)}</span>
      ${gridListTemplate(contributors)}
      ${gridListTemplate(attachments)}
    </article>
  `
}

export function renderCards(data: TDocument[]): string {
    return (data ?? []).map(renderCard).join('')
}

export function gridListTemplate(items: string[]): string {
    return listTemplate({ class: 'list doc-card__list' }, items)
}

export function setData(root: HTMLElement, data: TDocument[]): void {
    //TODO: Parse html to avoid XSS
    const { container } = getRefs(root)
    if (!container) return
    container.innerHTML = renderCards(data)
}
