import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-button';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableGrowing extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = css(`${tableStyles} pl-table { height: auto; }`);
  static template = html`
    <pl-button
      label="Добавить строку"
      on-click="[[addRow]]">
    </pl-button>
    <pl-table
      id="table"
      data="[[rows]]"
      growing>
      <pl-table-column
        header="Сотрудник"
        field="name">
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department">
      </pl-table-column>
    </pl-table>
    <output>
      Строк: [[rows.length]]
    </output>
  `;
  addRow() {
    this.push('rows', {
      id: 600 + this.rows.length,
      name: `Новый сотрудник ${this.rows.length + 1}`,
      department: 'Demo-company'
    });
  }
}
customElements.define('pl-doc-table-growing', PlDocTableGrowing);
