import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';

export default class EmployeeList extends PlForm {
  static properties = {
    formTitle: { value: 'Сотрудники · REST' },
    rows: { type: Array, value: () => [] },
    selected: { type: Object },
    loading: { type: Boolean },
    query: { type: String, value: '' }
  };
  static css = css`
    :host { display: flex; flex-direction: column; min-height: 0; }
    pl-table { height: 420px; flex: none; }
    pl-table::part(row) { min-height: calc(var(--pl-base-size) + 1px); }
    .toolbar { padding: var(--pl-space-md); flex-wrap: wrap; }
    .search { width: 280px; }
  `;
  static template = html`
    <pl-table data="{{rows}}" selected="{{selected}}" on-row-dblclick="[[editRow]]">
      <pl-flex-layout slot="top-toolbar" class="toolbar" align="center">
        <pl-input class="search" placeholder="Фамилия или имя" value="{{query}}"></pl-input>
        <pl-button label="Найти" on-click="[[search]]" disabled="[[loading]]"></pl-button>
        <pl-button label="Сбросить" variant="link" on-click="[[resetSearch]]"></pl-button>
        <pl-button label="Добавить сотрудника" variant="primary" on-click="[[addRow]]">
          <pl-icon slot="prefix" iconset="pl-default" icon="plus" size="16"></pl-icon>
        </pl-button>
      </pl-flex-layout>
      <pl-table-column header="Сотрудник" field="fio" sortable resizable></pl-table-column>
      <pl-table-column header="Дата рождения" field="birthdate" kind="date" width="180" sortable resizable></pl-table-column>
      <pl-table-column header="Действия" width="100" action>
        <template>
          <pl-flex-layout>
            <pl-icon-button iconset="pl-default" icon="pencil" title="Открыть карточку" on-click="[[editRow]]"></pl-icon-button>
            <pl-icon-button iconset="pl-default" icon="trashcan" title="Удалить сотрудника" on-click="[[deleteRow]]"></pl-icon-button>
          </pl-flex-layout>
        </template>
      </pl-table-column>
    </pl-table>
    <pl-dataset id="dsList" data="{{rows}}" executing="{{loading}}" endpoint="/guide/employee/list"></pl-dataset>
    <pl-action id="aDelete" endpoint="/guide/employee/delete"></pl-action>
  `;

  onConnect() { return this.$.dsList.execute(); }
  search() {
    this.set('rows.filters', this.query
      ? [{ field: 'fio', operator: 'like_both', value: this.query }] : []);
    return this.$.dsList.execute();
  }
  resetSearch() { this.query = ''; return this.search(); }
  async addRow() {
    await this.open('guide.rest.card');
    await this.$.dsList.execute();
  }
  async editRow(event) {
    await this.open('guide.rest.card', { employeeId: event.model.row.id });
    await this.$.dsList.execute();
  }
  async deleteRow(event) {
    const { id, fio } = event.model.row;
    if (!await this.showConfirm(`Удалить сотрудника «${fio}»?`)) return;
    await this.$.aDelete.execute({ id });
    await this.$.dsList.execute();
  }

}
