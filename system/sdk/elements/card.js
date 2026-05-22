class YiqiCard extends HTMLElement {
  connectedCallback() {
    this.className = "yiqi-card";
  }
}

customElements.define("yiqi-card", YiqiCard);
