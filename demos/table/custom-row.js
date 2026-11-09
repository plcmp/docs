import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import { PlPopover } from '@plcmp/pl-popover';
import '@plcmp/pl-button';
import { staffRows, tableStyles } from './shared.js';

class PlDocTableEmployeePopover extends PlPopover {
  static template = html`<slot></slot>`;
  static css = css`
    :host {
      display: none;
      position: absolute;
      inset: unset;
      margin: 0;
      padding: var(--pl-space-lg);
      width: min(320px, calc(100vw - 32px));
      box-sizing: border-box;
      background: var(--pl-background-color);
      color: var(--pl-text-color);
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      box-shadow: 0 4px 16px #0002;
    }
    :host([visible]) { display: block; }
  `;
}
customElements.define('pl-doc-table-employee-popover', PlDocTableEmployeePopover);

class PlDocTableEmployeeSummary extends PlElement {
  static properties = {
    row: { type: Object }
  };

  static css = css`
    :host {
      display: block;
      container-type: inline-size;
      width: 100%;
      box-sizing: border-box;
    }
    .summary {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) minmax(220px, 2fr) minmax(210px, 1.5fr) auto;
      align-items: center;
      gap: var(--pl-space-md);
      width: 100%;
      box-sizing: border-box;
      padding: var(--pl-space-md);
      border-bottom: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      color: var(--pl-text-color);
    }
    .identity, .description, .amounts { min-width: 0; }
    .identity, .description { display: grid; gap: var(--pl-space-xs); }
    .identity strong, .amount strong { font-weight: 600; }
    .identity span, .description time, .amount span { color: #647078; font-weight: 400; }
    .description p { margin: 0; overflow-wrap: anywhere; }
    .amounts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pl-space-md); }
    .amount { display: grid; gap: var(--pl-space-xs); }
    .popover-content { display: grid; gap: var(--pl-space-md); min-width: 0; }
    .popover-content p { margin: 0; overflow-wrap: anywhere; }
    .popover-money { display: grid; gap: var(--pl-space-xs); }
    .summary > pl-button { justify-self: end; }
    @container (max-width: 760px) {
      .summary { grid-template-columns: minmax(0, 1fr); align-items: start; }
      .amounts { max-width: 360px; }
      .summary > pl-button { justify-self: start; }
    }
  `;

  static template = html`
    <article class="summary">
      <div class="identity">
        <strong>[[row.name]]</strong>
        <span>[[row.department]]</span>
      </div>
      <div class="description">
        <p>[[row.note]]</p>
        <time>Дата приёма: [[formatDate(row.started)]]</time>
      </div>
      <div class="amounts">
        <div class="amount">
          <strong>[[formatMoney(row.salary)]]</strong>
          <span>Оклад</span>
        </div>
        <div class="amount">
          <strong>[[formatMoney(row.bonus)]]</strong>
          <span>Премия</span>
        </div>
      </div>
      <pl-button id="detailsButton" label="Подробнее" variant="ghost" on-click="[[openDetails]]"></pl-button>
    </article>
    <pl-doc-table-employee-popover id="detailsPopover" top-layer direction="down">
      <div class="popover-content">
        <strong>[[row.name]]</strong>
        <span>[[row.department]]</span>
        <p>[[row.note]]</p>
        <time>Дата приёма: [[formatDate(row.started)]]</time>
        <div class="popover-money">
          <span>Оклад: [[formatMoney(row.salary)]]</span>
          <span>Премия: [[formatMoney(row.bonus)]]</span>
        </div>
        <pl-button label="Закрыть" variant="ghost" on-click="[[closeDetails]]"></pl-button>
      </div>
    </pl-doc-table-employee-popover>
  `;

  formatDate(value) {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
  }

  formatMoney(value) {
    if (value == null) return '';
    return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  }

  openDetails() {
    this.$.detailsPopover.show(this.$.detailsButton);
  }

  closeDetails() {
    this.$.detailsPopover.hide();
  }

  disconnectedCallback() {
    if (this.$.detailsPopover.visible) this.closeDetails();
    super.disconnectedCallback();
  }
}
customElements.define('pl-doc-table-employee-summary', PlDocTableEmployeeSummary);

class PlDocTableCustomRow extends PlElement {
  static properties = {
    rows: { type: Array, value: () => [] },
    customTemplate: { type: Object, value: () => html`<pl-doc-table-employee-summary row="[[row]]"></pl-doc-table-employee-summary>` },
  };
  static css = css(`${tableStyles} pl-table { height: 440px; }`);
  static template = html`
    <pl-table data="[[rows]]" custom-row-template="[[customTemplate]]" variable-row-height>
      <pl-table-column header="Сотрудники Demo-company" field="name"></pl-table-column>
    </pl-table>
  `;

  connectedCallback() {
    super.connectedCallback();
    // Инициализация свойств Polylib отложена: ждём подключения шаблона перед первой порцией данных.
    setTimeout(() => {
      if (this.isConnected) this.rows = staffRows();
    }, 0);
  }
}
customElements.define('pl-doc-table-custom-row', PlDocTableCustomRow);
