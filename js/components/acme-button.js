class AcmeButton extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute("type") || "primary";
    const isSubmit = this.getAttribute("submit") === "true";
    this.innerHTML = `
      <button class="btn ${type === 'alt' ? 'btn--alt' : ''}" type="${isSubmit ? 'submit' : 'button'}">
        <slot></slot>
      </button>
    `;
  }
}
customElements.define("acme-button", AcmeButton);