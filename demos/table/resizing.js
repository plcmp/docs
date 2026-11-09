import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableCss } from './shared.js';

class PlDocTableResizing extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows }
  };
  static css = tableCss;
  static template = html`
    <pl-table data="[[rows]]">
      <pl-table-column header="Сотрудник" field="name" width="240" min-width="160" resizable></pl-table-column>
      <pl-table-column header="Отдел" field="department" width="180" min-width="120" resizable></pl-table-column>
      <pl-table-column header="Комментарий" field="note" min-width="240" resizable></pl-table-column>
    </pl-table>
  `;
}
customElements.define('pl-doc-table-resizing', PlDocTableResizing);
