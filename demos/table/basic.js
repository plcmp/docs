import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableCss } from './shared.js';

class PlDocTableBasic extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = tableCss;
  static template = html`
    <pl-table
      data="[[rows]]">
      <pl-table-column
        header="Сотрудник"
        field="name">
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department">
      </pl-table-column>
    </pl-table>
    `;
}
customElements.define('pl-doc-table-basic', PlDocTableBasic);
