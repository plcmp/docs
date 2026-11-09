import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableCss } from './shared.js';

class PlDocTableAlignment extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = tableCss;
  static template = html`
    <pl-table data="[[rows]]">
      <pl-table-column
        header="Сотрудник"
        field="name"
        min-width="180"
        header-align="left"
        align="left">
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department"
        min-width="150"
        header-align="center"
        align="center">
      </pl-table-column>
      <pl-table-column
        header="Дата приёма"
        field="started"
        kind="date"
        format="DD.MM.YYYY"
        min-width="140"
        header-align="center"
        align="center">
      </pl-table-column>
      <pl-table-column
        header="Оклад"
        field="salary"
        kind="number"
        format="0"
        min-width="130"
        header-align="left"
        align="right">
      </pl-table-column>
      <pl-table-column
        header="Премия"
        field="bonus"
        kind="number"
        format="0"
        min-width="130"
        header-align="right"
        align="right">
      </pl-table-column>
    </pl-table>
  `;
}
customElements.define('pl-doc-table-alignment', PlDocTableAlignment);
