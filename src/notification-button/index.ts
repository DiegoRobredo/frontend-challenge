function toInt(value: string | null, fallback = 0): number {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
}

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
        // inicializa desde atributos si existen
        if (this.hasAttribute('count')) {
            this._count = toInt(this.getAttribute('count'))
        }

        // render inicial
        this.render()

        this.badge = this.querySelector('#notifBadge') as HTMLSpanElement

        // ejemplo: reenviar el click del botón como evento del custom element
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

const tag = 'notification-button'
customElements.define(tag, NotificationButton)

// Aumenta el mapa de tipos para que TS conozca tu custom element
declare global {
    interface HTMLElementTagNameMap {
        'notification-button': NotificationButton
    }
}
