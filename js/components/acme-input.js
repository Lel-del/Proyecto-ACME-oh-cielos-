class AcmeInput extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute("label") || "";
    const type = this.getAttribute("type") || "text";
    const placeholder = this.getAttribute("placeholder") || "";
    const required = this.hasAttribute("required") ? "required" : "";
    const readonly = this.hasAttribute("readonly") ? "readonly" : "";

    this.innerHTML = `
      <label class="label">
        <span>${label}</span>
        <input type="${type}" placeholder="${placeholder}" ${required} ${readonly} />
      </label>
    `;
  }

  get value() {
    return this.querySelector("input").value;
  }

  set value(val) {
    this.querySelector("input").value = val;
  }
}
customElements.define("acme-input", AcmeInput);