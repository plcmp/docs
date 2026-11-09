import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-checkbox';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableVariableHeight extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
    variable: { type: Boolean, value: true },
  };
  static css = css(`${tableStyles} pl-table { height: 260px; }`);
  static template = html`
    <pl-checkbox
      caption="Строки переменной высоты"
      checked="{{variable}}">
    </pl-checkbox>
    <pl-table
      data="[[rows]]"
      variable-row-height="[[variable]]"
      skeleton-height="48px">
      <pl-table-column
        header="Комментарий"
        field="note"
        width="240">
        <template>
          <div>
            [[row.note]] [[row.note]]
          </div>
        </template>
      </pl-table-column>
      <pl-table-column
        header="Сотрудник"
        field="name">
      </pl-table-column>
    </pl-table>
    `;
}
customElements.define('pl-doc-table-variable-height', PlDocTableVariableHeight);
