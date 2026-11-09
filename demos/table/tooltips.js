import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableTooltips extends PlElement {
  static properties = {
    rows: { type: Array, value: staffRows },
  };
  static css = css(tableStyles);
  static template = html`
    <pl-table data="[[rows]]">
      <template is="extra styles">
        <style>
          pl-tooltip::part(outerBox) {
            max-width: 340px;
            padding: var(--pl-space-md);
            color: var(--pl-text-color);
            background: var(--pl-background-color);
            border: 1px solid var(--pl-grey-light);
            border-radius: var(--pl-border-radius);
            box-shadow: 0 4px 16px #0002;
          }
        </style>
      </template>
      <pl-table-column header="Сотрудник" field="name" min-width="180">
        <template is="tooltip" keep-hover>
          <style>
          .person-tooltip {
            display: grid;
            grid-template-columns: 44px minmax(0, 1fr);
            align-items: start;
            gap: var(--pl-space-md);
            width: min(340px, calc(100vw - 48px));
            box-sizing: border-box;
          }
          .avatar {
            display: grid;
            width: 44px;
            height: 44px;
            place-items: center;
            box-sizing: border-box;
            border-radius: 50%;
            background: var(--pl-grey-lightest);
            color: var(--pl-text-color);
            font-weight: 600;
          }
          .person-copy { display: grid; gap: var(--pl-space-xs); min-width: 0; }
          .person-name { font-weight: 600; }
          .person-department, .person-date { color: #647078; font-weight: 400; }
          .person-note { margin: var(--pl-space-xs) 0 0; overflow-wrap: anywhere; }
          </style>
          <div class="person-tooltip">
            <span class="avatar">[[initials(row.name)]]</span>
            <div class="person-copy">
              <strong class="person-name">[[row.name]]</strong>
              <span class="person-department">[[row.department]]</span>
              <span class="person-date">Дата приёма: [[formatDate(row.started)]]</span>
              <p class="person-note">[[row.note]]</p>
            </div>
          </div>
        </template>
      </pl-table-column>
      <pl-table-column header="Отдел" field="department" tooltip-field="note" min-width="180"></pl-table-column>
    </pl-table>
  `;

  initials(name) {
    return name.split(' ').map(part => part[0]).slice(0, 2).join('').toLocaleUpperCase('ru-RU');
  }

  formatDate(value) {
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
  }
}
customElements.define('pl-doc-table-tooltips', PlDocTableTooltips);
