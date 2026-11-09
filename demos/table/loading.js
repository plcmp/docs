import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-checkbox';
import { staffRows, tableCss } from './shared.js';

class PlDocTableLoading extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    refreshing: { type: Boolean, value: false },
  };
  static css = tableCss;
  static template = html`
    <pl-checkbox
      caption="Обновление"
      checked="{{refreshing}}">
    </pl-checkbox>
    <pl-table
      data="[[rows]]"
      refreshing="[[refreshing]]">
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
customElements.define('pl-doc-table-loading', PlDocTableLoading);
