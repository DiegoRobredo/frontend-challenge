function toInt(value: string | null, fallback = 0): number {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
}

export class NotificationButton extends HTMLElement {
    // valores por defecto
    #count = 0

    static get observedAttributes() {
        return ['count'] as const
    }

    // --- propiedades tipadas (reflejan atributos) ---
    get count(): number {
        return this.#count
    }

    set count(value: number) {
        this.#count = value ?? 0
        this.setAttribute('count', String(this.#count))
        this.render()
    }

    // lifecycle
    connectedCallback(): void {
        // inicializa desde atributos si existen
        if (this.hasAttribute('count')) {
            this.#count = toInt(this.getAttribute('count'))
        }

        // render inicial
        this.render()

        // ejemplo: reenviar el click del botón como evento del custom element
        const button = this.querySelector('button')
        button?.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent('notif-click', {
                    bubbles: true,
                    composed: true,
                })
            )
        })
    }

    attributeChangedCallback(
        name: string,
        _oldVal: string | null,
        newVal: string | null
    ): void {
        if (name === 'count') {
            this.#count = toInt(newVal)
        }

        this.render()
    }

    render(): void {
        this.innerHTML = `
      <button type="button" class="notif-btn">
        <span class="icon-wrapper">
          <i class="fa-solid fa-bell" aria-hidden="true"></i>
          <span class="badge" aria-label="Notifications badge">${this.#count}</span>
        </span>
        <span class="btn-text">New document added</span>
      </button>
    `
    }
}

// evita redefinir en HMR
const tag = 'notification-button'
if (!customElements.get(tag)) {
    customElements.define(tag, NotificationButton)
}

// Augmenta el mapa de tipos para que TS conozca tu custom element
declare global {
    interface HTMLElementTagNameMap {
        'notification-button': NotificationButton
    }
}
