import type { TDocument } from '@/types'
import { relativeFormatDate } from '@/utils/formater'
import { listTemplate } from '@/templates/list'

export function renderShell(root: HTMLElement): void {
    root.innerHTML = `
    <table class="docs-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Contributors</th>
          <th scope="col">Attachments</th>
        </tr>
      </thead>
      <tbody id="docsTableBody"></tbody>
    </table>
  `
}

export function getRefs(root: HTMLElement) {
    return {
        tbody: root.querySelector(
            '#docsTableBody'
        ) as HTMLTableSectionElement | null,
    }
}

export function renderRow(doc: TDocument): string {
    const contribs = (doc.Contributors ?? []).map((c) => c.Name)
    const attachments = doc.Attachments ?? []

    return `
    <tr class="docs-table__row" data-id="${doc.ID}">
      <th scope="row">
        <div class="docs-table__row__header">
          <span class="doc-title docs-table__title">${doc.Title}</span>
          <span class="doc-version">Version ${doc.Version}</span>
          <span class="doc-date">Created ${relativeFormatDate(doc.CreatedAt)}</span>
          <span class="doc-date">Updated ${relativeFormatDate(doc.UpdatedAt)}</span>
        </div>
      </th>
      <td class="doc-cell">
        ${tableListTemplate(contribs)}
      </td>
      <td class="doc-cell">
        ${tableListTemplate(attachments)}
      </td>
    </tr>
  `
}

export function tableListTemplate(items: string[]): string {
    return listTemplate({ class: 'list docs-table__list' }, items)
}

export function renderRows(data: TDocument[]): string {
    return (data ?? []).map(renderRow).join('')
}

export function setData(root: HTMLElement, data: TDocument[]): void {
    //TODO: Add html escape to avoid XSS
    const { tbody } = getRefs(root)
    if (!tbody) return
    tbody.innerHTML = renderRows(data)
}
