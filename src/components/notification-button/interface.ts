export function renderShell(root: HTMLElement, count: number): void {
    root.innerHTML = `
    <button type="button" class="notif-btn" id="notifButton" data-testid="notif-button">
      <span class="icon-wrapper">
        <i class="fa-solid fa-bell" aria-hidden="true"></i>
        <span id="notifBadge" class="badge" aria-label="Notifications badge" data-testid="notif-badge">${count}</span>
      </span>
      <span class="notif-btn__text">New document added</span>
    </button>
  `
}

export function getRefs(root: HTMLElement) {
    return {
        button: root.querySelector('#notifButton') as HTMLButtonElement | null,
        badge: root.querySelector('#notifBadge') as HTMLSpanElement | null,
    }
}

export function setCount(root: HTMLElement, count: number): void {
    const { badge } = getRefs(root)
    if (!badge) return
    badge.textContent = String(count ?? 0)
}
