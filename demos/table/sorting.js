import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableCss } from './shared.js';

class PlDocTableSorting extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows, observer: '_rowsObserver' },
  };
  static css = tableCss;
  static template = html`
    <pl-table
      data="{{rows}}">
      <pl-table-column
        header="Сотрудник"
        field="name"
        sortable>
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department"
        sortable>
      </pl-table-column>
      <pl-table-column
        header="Оклад"
        field="salary"
        kind="number"
        format="0,0"
        align="right"
        sortable>
      </pl-table-column>
    </pl-table>
    <output
      aria-live="polite">
      [[sortLabel(rows.sorts)]]
    </output>
    `;
  _rowsObserver(rows, _old, mutation) {
    if (mutation.path !== 'rows.sorts') return;
    const sort = rows.sorts?.[0];
    const ordered = [...rows].sort((a, b) => {
      if (!sort?.sort) return a.id - b.id;
      const left = a[sort.field]; const right = b[sort.field];
      const result = typeof left === 'number' ? left - right : left.localeCompare(right, 'ru');
      return sort.sort === 'desc' ? -result : result;
    });
    this.splice('rows', 0, rows.length, ...ordered);
  }
  sortLabel(sorts) { const sort = sorts?.[0]; return sort?.sort ? `Порядок массива: ${sort.field} · ${sort.sort}` : 'Порядок массива: исходный'; }
}
customElements.define('pl-doc-table-sorting', PlDocTableSorting);
