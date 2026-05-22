import { api } from "../core/api.js";
import { formatCurrency } from "../core/utils.js";

class YiqiMetric extends HTMLElement {
  async connectedCallback() {
    const entity = this.getAttribute("entity");
    const field = this.getAttribute("field");

    const data = await api.get(entity);
    const total = data.reduce((acc, r) => acc + (r[field] || 0), 0);

    this.innerHTML = `<div class="yiqi-metric">${formatCurrency(total)}</div>`;
  }
}

customElements.define("yiqi-metric", YiqiMetric);
