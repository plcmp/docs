import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-virtual-scroll';
import '@plcmp/pl-button';

class PlDocVirtualDemo extends PlElement {
  static properties = {
    rows: { type: Array, value: () => Array.from({ length: 1000 }, (_, index) => ({
      id: index + 1, name: `Сотрудник ${index + 1}`,
      note: index % 3 === 0 ? 'Участвует в разработке продукта и помогает коллегам из других отделов.' : 'Разработка'
    })) },
    variable: { type: Boolean, value: false },
    rendered: { type: Number, value: 0 },
    selected: { type: String, value: 'Нажми на строку' }
  };
  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); min-width: 0; }
    .actions { display: flex; flex-wrap: wrap; gap: var(--pl-space-sm); }
    pl-virtual-scroll { height: 280px; border: 1px solid var(--pl-grey-light); border-radius: var(--pl-border-radius); }
    .row { display: grid; align-content: center; box-sizing: border-box; width: 100%; height: 44px; padding: var(--pl-space-sm) var(--pl-space-md); border-bottom: 1px solid var(--pl-grey-light); cursor: pointer; }
    .row:hover { background: var(--pl-primary-lightest); }
    .row.variable { height: auto; min-height: 44px; gap: var(--pl-space-xs); }
    .row strong { font-weight: 600; }
    .note { font-size: 12px; color: var(--pl-grey-dark); }
    output { font: var(--pl-text-font); }
  `;
  static template = html`
    <div class="actions">
      <pl-button label="К началу" on-click="[[start]]"></pl-button>
      <pl-button label="Прокрутить ниже" on-click="[[next]]"></pl-button>
      <pl-button label="Изменить первую строку" on-click="[[rename]]"></pl-button>
    </div>
    <pl-virtual-scroll id="list" items="{{rows}}" as="employee" variable-row-height="[[variable]]" on-scroll="[[countRendered]]">
      <template>
        <div class$="[[rowClass(variable)]]" on-click="[[select]]">
          <strong>[[employee.name]]</strong>
          <span class="note" hidden$="[[!variable]]">[[employee.note]]</span>
        </div>
      </template>
    </pl-virtual-scroll>
    <output>Всего [[rows.length]] строк · элементов в DOM: [[rendered]]</output>
    <output aria-live="polite">[[selected]]</output>
  `;
  connectedCallback() { super.connectedCallback(); requestAnimationFrame(() => { if (this.isConnected) { this.$.list.render(); this.countRendered(); } }); }
  rowClass(variable) { return variable ? 'row variable' : 'row'; }
  countRendered() { queueMicrotask(() => { if (this.isConnected) this.rendered = this.$.list.canvas.childElementCount; }); }
  start() { this.$.list.scrollTop = 0; }
  next() { this.$.list.scrollTop += 2200; }
  rename() { this.set('rows.0.name', 'Анна Смирнова'); this.start(); }
  select(event) { this.selected = `Выбран: ${event.model.employee.name}, id = ${event.model.employee.id}`; }
}
customElements.define('pl-doc-virtual-demo', PlDocVirtualDemo);
