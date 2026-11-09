import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import '@plcmp/pl-button';
import '@plcmp/pl-flex-layout';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableFilteringToolbar extends PlElement {
  static properties = {
    query: { type: String, value: '' },
    department: { type: String, value: null },
    rows: { type: Array, value: staffRows }
  };
  static css = css(`${tableStyles}
    pl-table { height: 320px; }
    pl-input { flex: 1 1 240px; min-width: 0; }
    pl-combobox { flex: 0 1 220px; min-width: 0; }
    pl-button { flex: 0 0 auto; }
  `);
  static template = html`
    <pl-table data="[[filtered(rows, query, department)]]">
      <pl-flex-layout slot="top-toolbar" align="center" gap="8" wrap>
        <pl-input
          aria-label="Поиск по имени или отделу"
          placeholder="Имя или отдел"
          value="{{query}}"
          stretch>
        </pl-input>
        <pl-combobox
          aria-label="Фильтр по отделу"
          placeholder="Все отделы"
          data="[[departments(rows)]]"
          text-property="name"
          value-property="id"
          value="{{department}}"
          stretch>
        </pl-combobox>
        <pl-button
          label="Сбросить фильтры"
          variant="ghost"
          on-click="[[resetFilters]]">
        </pl-button>
      </pl-flex-layout>
      <pl-table-column header="Сотрудник" field="name"></pl-table-column>
      <pl-table-column header="Отдел" field="department" min-width="180"></pl-table-column>
    </pl-table>
    <output>[[empty(rows, query, department)]]</output>
  `;

  filtered(rows, query, department) {
    const text = (query ?? '').trim().toLocaleLowerCase('ru-RU');
    return rows.filter((row) => {
      const matchesText = !text
        || row.name.toLocaleLowerCase('ru-RU').includes(text)
        || row.department.toLocaleLowerCase('ru-RU').includes(text);
      return matchesText && (!department || row.department === department);
    });
  }

  empty(rows, query, department) {
    return this.filtered(rows, query, department).length ? '' : 'Совпадений нет.';
  }

  departments(rows) {
    return [
      { id: null, name: 'Все отделы' },
      ...Array.from(new Set(rows.map(row => row.department)), name => ({ id: name, name }))
    ];
  }

  resetFilters() {
    this.query = '';
    this.department = null;
  }
}
customElements.define('pl-doc-table-filtering-toolbar', PlDocTableFilteringToolbar);
