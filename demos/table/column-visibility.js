import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-button';
import '@plcmp/pl-flex-layout';
import { staffRows, tableCss } from './shared.js';

class PlDocTableColumnVisibility extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    showDepartment: { type: Boolean, value: true },
    showStarted: { type: Boolean, value: true },
    showNote: { type: Boolean, value: false }
  };
  static css = tableCss;
  static template = html`
    <pl-flex-layout align="center" wrap>
      <pl-checkbox caption="Отдел" checked="{{showDepartment}}"></pl-checkbox>
      <pl-checkbox caption="Дата приёма" checked="{{showStarted}}"></pl-checkbox>
      <pl-checkbox caption="Комментарий" checked="{{showNote}}"></pl-checkbox>
      <pl-button label="Показать все" variant="secondary" on-click="[[showAll]]"></pl-button>
    </pl-flex-layout>
    <pl-table data="[[rows]]">
      <pl-table-column header="Сотрудник" field="name" min-width="180"></pl-table-column>
      <pl-table-column header="Отдел" field="department" min-width="140" hidden="[[!showDepartment]]"></pl-table-column>
      <pl-table-column header="Дата приёма" field="started" kind="date" min-width="140" hidden="[[!showStarted]]"></pl-table-column>
      <pl-table-column header="Комментарий" field="note" min-width="240" hidden="[[!showNote]]"></pl-table-column>
    </pl-table>
  `;

  showAll() {
    this.showDepartment = true;
    this.showStarted = true;
    this.showNote = true;
  }
}
customElements.define('pl-doc-table-column-visibility', PlDocTableColumnVisibility);
