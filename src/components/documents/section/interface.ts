import type { TDocument, TViewMode } from '@/types'

export function renderShell(root: HTMLElement): void {
    root.innerHTML = `
    <header class="toolbar">
      <sort-box id="sorter"></sort-box>
      <view-toggle id="toggle"></view-toggle>
    </header>
    <section class="list-section" id="view-list" data-testid="view-list">
      <docs-table id="docs-table"></docs-table>
    </section>
    <section class="grid-section" id="view-grid" hidden inert data-testid="view-grid">
      <docs-grid id="docs-grid"></docs-grid>
    </section>
  `
}

export function getRefs(root: HTMLElement) {
    return {
        table: root.querySelector('#docs-table') as
            | HTMLElementTagNameMap['docs-table']
            | null,
        grid: root.querySelector('#docs-grid') as
            | HTMLElementTagNameMap['docs-grid']
            | null,
        listSection: root.querySelector('#view-list') as HTMLElement | null,
        gridSection: root.querySelector('#view-grid') as HTMLElement | null,
    }
}

export function showElement(el: HTMLElement) {
    el.hidden = false
    el.removeAttribute('inert')
}

export function hideElement(el: HTMLElement) {
    el.hidden = true
    el.setAttribute('inert', '')
}

export function setView(root: ParentNode, viewMode: TViewMode) {
    const listSec = root.querySelector('#view-list') as HTMLElement
    const gridSec = root.querySelector('#view-grid') as HTMLElement

    //Both sections must exist
    if (!listSec || !gridSec) return

    if (viewMode === 'list') {
        showElement(listSec)
        hideElement(gridSec)
    } else {
        showElement(gridSec)
        hideElement(listSec)
    }
}

export function setData(
    refs: Pick<ReturnType<typeof getRefs>, 'table' | 'grid'>,
    data: TDocument[]
): void {
    if (refs.table) refs.table.data = data
    if (refs.grid) refs.grid.data = data
}
