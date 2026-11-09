import { PlElement, html } from 'polylib';
import '@plcmp/pl-radio-group';
import '@plcmp/pl-radio-button';
import '@plcmp/pl-radio-button/pl-radio.js';
import '@plcmp/pl-valid-observer';
import '@plcmp/pl-button';
import { componentStyles } from './component-styles.js';

class PlDocRadioDemo extends PlElement {
  static properties = {
    format: { type: String }, delivery: { type: String, value: 'email' }, invalid: { type: Boolean },
    readonly: { type: Boolean, value: false }, status: { type: String, value: 'Выбери формат отчёта' }
  };
  static css = componentStyles;
  static template = html`
    <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
    <pl-radio-group id="format" label="Формат отчёта" selected="{{format}}" required readonly="[[readonly]]">
      <pl-radio-button name="brief" label="Краткий"></pl-radio-button>
      <pl-radio-button name="full" label="Полный"></pl-radio-button>
    </pl-radio-group>
    <pl-radio-group id="delivery" label="Получение" selected="{{delivery}}" readonly="[[readonly]]">
      <pl-radio name="email" label="Почта"></pl-radio>
      <pl-radio name="download" label="Файл"></pl-radio>
    </pl-radio-group>
    <pre>[[state(format, delivery, invalid, readonly)]]</pre>
    <div class="actions">
      <pl-button label="Применить" disabled="[[invalid]]" on-click="[[apply]]"></pl-button>
      <pl-button label="Сменить режим чтения" on-click="[[toggleReadonly]]"></pl-button>
      <pl-button label="Сбросить" on-click="[[reset]]"></pl-button>
    </div>
    <output aria-live="polite">[[status]]</output>
  `;
  state(format, delivery, invalid, readonly) { return JSON.stringify({ selected: format ?? null, delivery, invalid, readonly }, null, 2); }
  apply() { this.status = `Выбран ${this.format === 'brief' ? 'краткий' : 'полный'} отчёт`; }
  toggleReadonly() { this.readonly = !this.readonly; }
  reset() { this.format = undefined; this.status = 'Выбери формат отчёта'; }
}
customElements.define('pl-doc-radio-demo', PlDocRadioDemo);
