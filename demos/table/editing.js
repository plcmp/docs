import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-input';
import { staffRows, tableCss } from './shared.js';

class PlDocTableEditing extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = tableCss;
  static template = html`
    <pl-table
      data="{{rows}}">
      <pl-table-column
        header="Имя сотрудника"
        field="name"
        width="240">
        <template>
          <pl-input
            aria-label$="Имя [[row.name]]"
            value="{{row.name}}"
            stretch>
          </pl-input>
        </template>
      </pl-table-column>
      <pl-table-column
        header="Отдел"
        field="department">
      </pl-table-column>
    </pl-table>
    <output
      aria-live="polite">
      [[currentName(rows)]]
    </output>
    `;

  currentName(rows) {
    return `Модель строки: ${rows[0]?.name ?? ''}`;
  }
}
customElements.define('pl-doc-table-editing', PlDocTableEditing);
