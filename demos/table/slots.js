import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-button';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableSlots extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    selected: { type: Object, value: null },
  };
  static css = css(`${tableStyles} pl-table { height: 340px; }`);
  static template = html`
    <pl-table data="{{rows}}" selected="{{selected}}">
      <pl-flex-layout slot="top-toolbar" stretch justify="space-between" align="center" gap="12" wrap>
        <strong>Сотрудники</strong>
        <pl-flex-layout align="center" gap="8" wrap>
          <pl-button label="Добавить" variant="secondary" on-click="[[addRow]]"></pl-button>
          <pl-button label="Удалить выбранного" variant="ghost" disabled="[[!selected]]" on-click="[[deleteSelected]]"></pl-button>
        </pl-flex-layout>
      </pl-flex-layout>
      <pl-table-column header="Сотрудник" field="name" min-width="180"></pl-table-column>
      <pl-table-column header="Отдел" field="department" min-width="160"></pl-table-column>
      <pl-flex-layout slot="bottom-toolbar" stretch justify="space-between" align="center" gap="12" wrap>
        <span>Строк: [[rows.length]] · [[selectedEmployee(selected)]]</span>
        <pl-button label="Восстановить список" variant="ghost" on-click="[[restoreRows]]"></pl-button>
      </pl-flex-layout>
    </pl-table>
  `;

  addRow() {
    const id = this.rows.reduce((max, row) => Math.max(max, row.id), 800) + 1;
    this.push('rows', {
      id,
      name: `Сотрудник Demo-company ${id}`,
      department: 'Demo-company',
      started: '2026-11-09',
      salary: 100000,
      bonus: 5000,
      note: 'Добавлено из примера слотов таблицы.'
    });
  }

  deleteSelected() {
    const index = this.rows.indexOf(this.selected);
    if (index < 0) return;
    this.splice('rows', index, 1);
    this.selected = null;
  }

  restoreRows() {
    this.rows = staffRows();
    this.selected = null;
  }

  selectedEmployee(selected) {
    return selected ? `${selected.name} — ${selected.department}` : 'Строка не выбрана.';
  }
}
customElements.define('pl-doc-table-slots', PlDocTableSlots);
