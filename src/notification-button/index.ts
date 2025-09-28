export class NotificationButton extends HTMLElement {
    private _count: number = 0
    private badge: HTMLSpanElement | null = null

    static get observedAttributes() {
        return ['count'] as const
    }

    get count(): number {
        return this._count
    }

    set count(value: number) {
        this._count = value ?? 0
        this.setAttribute('count', String(this._count))
        this.updateCounter()
    }

    // lifecycle
    connectedCallback(): void {
        if (this.hasAttribute('count')) {
            this._count = Number(this.getAttribute('count'))
        }

        this.render()

        this.badge = this.querySelector('#notifBadge') as HTMLSpanElement

        const button = this.querySelector('button')
        button?.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent('notification-click', {
                    bubbles: true,
                    composed: true,
                })
            )
        })
    }

    private updateCounter(): void {
        if (this.badge) this.badge.textContent = String(this._count)
    }

    render(): void {
        this.innerHTML = `
      <button type="button" class="notif-btn">
        <span class="icon-wrapper">
          <i class="fa-solid fa-bell" aria-hidden="true"></i>
          <span id="notifBadge" class="badge" aria-label="Notifications badge">${this._count}</span>
        </span>
        <span class="btn-text">New document added</span>
      </button>
    `
    }
}

customElements.define('notification-button', NotificationButton)
declare global {
    interface HTMLElementTagNameMap {
        'notification-button': NotificationButton
    }
}
