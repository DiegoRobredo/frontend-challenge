import type { TSortField } from '@/types'

export function renderShell(root: HTMLElement, field: TSortField): void {
    root.innerHTML = `
    <div class="sort-box">
      <label class="label" for="sort">Sort by:</label>
      <select class="select" name="sort" id="sort">
        <option value="" disabled ${field === '' ? 'selected' : ''} hidden>
          Select sorting…
        </option>
        <option value="name" ${field === 'name' ? 'selected' : ''}>Name</option>
        <option value="date" ${field === 'date' ? 'selected' : ''}>Date</option>
        <option value="version" ${field === 'version' ? 'selected' : ''}>Version</option>
      </select>
    </div>
  `
}

export function getRefs(host: HTMLElement) {
    return {
        select: host.querySelector('#sort') as HTMLSelectElement | null,
    }
}

export function setSelectValue(
    select: HTMLSelectElement | null,
    field: TSortField
) {
    if (!select) return
    select.value = field || ''
}
