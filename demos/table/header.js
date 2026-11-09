import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableHeader extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = css(`${tableStyles} pl-table { height: 320px; }`);
  static template = html`
    <pl-table data="[[rows]]">
      <pl-table-column header="Сведения о сотруднике" header-align="center">
        <pl-table-column header="Профиль" header-align="center">
          <pl-table-column field="name" min-width="180">
            <template is="header">
              <strong>Сотрудник</strong>
            </template>
          </pl-table-column>
        </pl-table-column>
        <pl-table-column header="Работа" header-align="center">
          <pl-table-column header="Отдел" field="department" min-width="130"></pl-table-column>
          <pl-table-column header="Дата приёма" field="started" kind="date" min-width="130" header-align="center" align="center"></pl-table-column>
        </pl-table-column>
      </pl-table-column>
      <pl-table-column header="Вознаграждение" header-align="center">
        <pl-table-column header="Начисления" header-align="center">
          <pl-table-column header="Оклад" field="salary" kind="number" format="0" min-width="130" header-align="right" align="right"></pl-table-column>
          <pl-table-column header="Премия" field="bonus" kind="number" format="0" min-width="130" header-align="right" align="right"></pl-table-column>
        </pl-table-column>
      </pl-table-column>
    </pl-table>
  `;
}
customElements.define('pl-doc-table-header', PlDocTableHeader);
