import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-icon-button';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableFixedColumns extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    selected: { type: String, value: 'Нажми кнопку действия.' },
  };
  static css = css(`${tableStyles} pl-table { height: 260px; }`);
  static template = html`
    <pl-table
      data="[[rows]]">
      <pl-table-column
        header="ID"
        field="id"
        width="90"
        fixed>
      </pl-table-column>
      <pl-table-column
        header="Сотрудник"
        field="name"
        width="240"
        resizable>
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department"
        width="220">
      </pl-table-column>
      <pl-table-column
        header="Комментарий"
        field="note"
        width="340">
      </pl-table-column>
      <pl-table-column
        header="Действие"
        width="110"
        action>
        <template>
          <pl-icon-button
            iconset="demo"
            icon="search"
            title="Открыть запись"
            aria-label="Открыть запись"
            variant="ghost"
            on-click="[[openRow]]">
          </pl-icon-button>
        </template>
      </pl-table-column>
    </pl-table>
    <output>
      [[selected]]
    </output>
    `;
  openRow(event) { this.selected = `Открыта запись ${event.model.row.id}: ${event.model.row.name}`; }
}
customElements.define('pl-doc-table-fixed-columns', PlDocTableFixedColumns);
