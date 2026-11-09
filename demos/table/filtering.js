import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-input';
import { staffRows, tableCss } from './shared.js';

class PlDocTableFiltering extends PlElement {
  static properties = {
    query: { type: String, value: '' },
    rows: { type: Array, value: staffRows },
  };
  static css = tableCss;
  static template = html`
    <pl-table
      data="[[filtered(rows, query)]]">
      <pl-table-column
        header="Сотрудник"
        field="name">
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department"
        min-width="180">
        <template is="filter">
          <pl-input
            aria-label="Фильтр по отделу"
            placeholder="Например, продажи"
            value="{{query}}"
            stretch>
          </pl-input>
        </template>
      </pl-table-column>
    </pl-table>
    <output>
      [[empty(rows, query)]]
    </output>
  `;

  filtered(rows, query) {
    const text = (query ?? '').trim().toLocaleLowerCase('ru-RU');
    return text
      ? rows.filter(row => row.department.toLocaleLowerCase('ru-RU').includes(text))
      : rows;
  }

  empty(rows, query) {
    return this.filtered(rows, query).length ? '' : 'Совпадений нет.';
  }
}
customElements.define('pl-doc-table-filtering', PlDocTableFiltering);
