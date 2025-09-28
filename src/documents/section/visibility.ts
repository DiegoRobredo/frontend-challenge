import type { TViewMode } from '@/types/ViewMode'

function showElement(el: HTMLElement) {
    el.hidden = false
    el.removeAttribute('inert')
}

function hideElement(el: HTMLElement) {
    el.hidden = true
    el.setAttribute('inert', '')
}

export function changeView(root: ParentNode, viewMode: TViewMode) {
    const listSec = root.querySelector('#view-list') as HTMLElement
    const gridSec = root.querySelector('#view-grid') as HTMLElement

    if (viewMode === 'list') {
        showElement(listSec)
        hideElement(gridSec)
    } else {
        showElement(gridSec)
        hideElement(listSec)
    }
}
