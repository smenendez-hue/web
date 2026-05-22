import { renderForm } from "../ui/form.js";

class YiqiForm extends HTMLElement {
  connectedCallback() {
    const fields = JSON.parse(this.getAttribute("fields") || "[]");
    this.innerHTML = renderForm(fields);
  }
}

customElements.define("yiqi-form", YiqiForm);
