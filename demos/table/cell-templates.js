import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-flex-layout';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableCellTemplate extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = css(`${tableStyles} pl-table { height: 400px; }`);
  static template = html`
    <pl-table
      data="[[rows]]"
      variable-row-height>
      <template is="extra styles">
        <style>
          .cell-title { font-weight: 600; line-height: 1.4; }
          .cell-subtitle { color: #647078; font-size: 12px; line-height: 1.4; }
          .cell-stack { padding-block: 4px; }
        </style>
      </template>
      <pl-table-column
        header="Сотрудник"
        field="name"
        min-width="190">
        <template>
          <pl-flex-layout class="cell-stack" vertical gap="4">
            <span class="cell-title">[[row.name]]</span>
            <span class="cell-subtitle">[[row.department]]</span>
          </pl-flex-layout>
        </template>
      </pl-table-column>
      <pl-table-column
        header="Работа в компании"
        field="started"
        min-width="260">
        <template>
          <pl-flex-layout class="cell-stack" vertical gap="4">
            <span class="cell-title">С [[date(row.started)]]</span>
            <span class="cell-subtitle">[[row.note]]</span>
          </pl-flex-layout>
        </template>
      </pl-table-column>
      <pl-table-column header="Оклад и премия" field="salary" width="180" header-align="right" align="right">
        <template>
          <pl-flex-layout class="cell-stack" vertical align="flex-end" gap="4">
            <span class="cell-title">[[money(row.salary)]]</span>
            <span class="cell-subtitle">Премия: [[money(row.bonus)]]</span>
          </pl-flex-layout>
        </template>
      </pl-table-column>
    </pl-table>
    `;

  date(value) {
    return new Date(value).toLocaleDateString('ru-RU');
  }

  money(value) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency', currency: 'RUB', maximumFractionDigits: 0
    }).format(value);
  }
}
customElements.define('pl-doc-table-cell-template', PlDocTableCellTemplate);
