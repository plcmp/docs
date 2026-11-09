import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableCss } from './shared.js';

class PlDocTableMultiselect extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    selectedList: { type: Array, value: () => [] },
  };
  static css = tableCss;
  static template = html`
    <pl-table
      data="[[rows]]"
      multi-select
      selected-list="{{selectedList}}">
      <pl-table-column
        header="Выбор"
        field="id"
        width="90"
        multi-select-column>
      </pl-table-column>
      <pl-table-column
        header="Сотрудник"
        field="name">
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department">
      </pl-table-column>
    </pl-table>
    <output
      aria-live="polite">
      [[describe(selectedList)]]
    </output>
    `;
  describe(selectedList) { return `Выбрано записей: ${selectedList.length}`; }
}
customElements.define('pl-doc-table-multiselect', PlDocTableMultiselect);
