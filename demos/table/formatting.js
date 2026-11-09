import { PlElement, html } from 'polylib';
import { PlTable } from '@plcmp/pl-table/pl-table.js';
import '@plcmp/pl-table';
import { staffRows, tableCss } from './shared.js';

PlTable.registerKind('doc-currency', (value, { format }) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: format }).format(value));
class PlDocTableFormatting extends PlElement {
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
        header="Дата приёма"
        field="started"
        kind="date"
        format="DD.MM.YYYY">
      </pl-table-column>
      <pl-table-column
        header="Оклад"
        field="salary"
        kind="number"
        format="0,0"
        align="right">
      </pl-table-column>
      <pl-table-column
        header="Премия"
        field="bonus"
        kind="doc-currency"
        format="RUB"
        align="right">
      </pl-table-column>
    </pl-table>
    `;
}
customElements.define('pl-doc-table-formatting', PlDocTableFormatting);
