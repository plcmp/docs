import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-button';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableFixedHeight extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = css(`${tableStyles} pl-table { height: 220px; }`);
  static template = html`
    <pl-button
      label="Добавить ещё 5 строк"
      on-click="[[addRow]]">
    </pl-button>
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
    <output>
      Строк: [[rows.length]] · высота ограничена, строки прокручиваются внутри таблицы.
    </output>
    `;
  addRow() {
    for (let index = 0; index < 5; index++) {
      const id = 700 + this.rows.length;
      this.push('rows', {
        id,
        name: `Новый сотрудник ${this.rows.length + 1}`,
        department: 'Demo-company',
        started: '2026-11-09',
        salary: 100000,
        bonus: 0,
        note: 'Добавлено из примера.'
      });
    }
  }
}
customElements.define('pl-doc-table-fixed-height', PlDocTableFixedHeight);
