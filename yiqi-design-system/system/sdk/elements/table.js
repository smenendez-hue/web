import { api } from "../core/api.js";
import { renderTable } from "../ui/table.js";

class YiqiTable extends HTMLElement {
  async connectedCallback() {
    const entity = this.getAttribute("entity");
    const data = await api.get(entity);
    this.innerHTML = renderTable(data);
  }
}

customElements.define("yiqi-table", YiqiTable);
