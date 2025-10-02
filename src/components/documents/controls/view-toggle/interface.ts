import type { TViewMode } from '@/types'
import { LIST, GRID } from './constants'

export function renderShell(root: HTMLElement, mode: TViewMode): void {
    root.innerHTML = `
    <div class="segmented-control" aria-label="View mode">
      <button id="button-list" class="segmented-control__button" role="tab" data-mode="list" data-testid="button-list"><i class="fa-solid fa-list" aria-hidden="true"></i></button>
      <button id="button-grid" class="segmented-control__button" role="tab" data-mode="grid" data-testid="button-grid"><i class="fa-solid fa-grip" aria-hidden="true"></i></button>
    </div>
  `
    setValue(root, mode)
}

export function getRefs(root: HTMLElement) {
    return {
        listBtn: root.querySelector('#button-list') as HTMLButtonElement | null,
        gridBtn: root.querySelector('#button-grid') as HTMLButtonElement | null,
    }
}

export function setValue(root: HTMLElement, mode: TViewMode) {
    const { listBtn, gridBtn } = getRefs(root)

    const apply = (btn: HTMLButtonElement | null, active: boolean) => {
        if (!btn) return
        btn.setAttribute('aria-selected', String(active))
        btn.tabIndex = active ? 0 : -1
    }

    apply(listBtn, mode === LIST)
    apply(gridBtn, mode === GRID)
}
