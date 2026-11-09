import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableStyling extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    cellParts: {
      type: Function,
      value: (row, column) => column.field === 'salary' ? 'salary-cell' : ''
    }
  };
  static css = css(`${tableStyles}
    pl-table { height: 320px; }
    pl-table::part(salary-cell) { background-color: var(--pl-primary-lightest); }
  `);
  static template = html`
    <pl-table data="[[rows]]" get-cell-part-name="[[cellParts]]" variable-row-height>
      <template is="extra styles">
        <style>
          .employee-stack {
            display: grid;
            gap: var(--pl-space-xs);
            width: 100%;
          }
          .employee-name { font-weight: 600; }
          .employee-department { color: #647078; font-weight: 400; }
        </style>
      </template>
      <pl-table-column header="Сотрудник" field="name" min-width="190">
        <template>
          <div class="employee-stack">
            <span class="employee-name">[[row.name]]</span>
            <span class="employee-department">[[row.department]]</span>
          </div>
        </template>
      </pl-table-column>
      <pl-table-column header="Дата приёма" field="started" kind="date" min-width="140"></pl-table-column>
      <pl-table-column header="Комментарий" field="note" min-width="300"></pl-table-column>
      <pl-table-column header="Оклад" field="salary" kind="number" format="0" min-width="140" align="right" header-align="right"></pl-table-column>
    </pl-table>
  `;
}
customElements.define('pl-doc-table-styling', PlDocTableStyling);
