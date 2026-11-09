import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableCss } from './shared.js';

class PlDocTableSelection extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    selected: { type: Object, value: null },
  };
  static css = tableCss;
  static template = html`
    <pl-table
      data="[[rows]]"
      selected="{{selected}}">
      <pl-table-column
        header="Сотрудник"
        field="name"
        tooltip-field>
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department">
      </pl-table-column>
    </pl-table>
    <output
      aria-live="polite">
      [[describe(selected)]]
    </output>
    `;
  describe(selected) { return selected ? `Выбрана запись: ${selected.name}` : 'Выбери строку таблицы.'; }
}
customElements.define('pl-doc-table-selection', PlDocTableSelection);
