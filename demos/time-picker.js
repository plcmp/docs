import { PlElement, html } from 'polylib';
import { componentStyles } from './component-styles.js';
import '@plcmp/pl-datetime/pl-time-picker.js';
import '@plcmp/pl-button';

class PlDocTimePickerDemo extends PlElement {
  static properties = {
    hour: { type: Number, value: 14 }, minute: { type: Number, value: 30 },
    mode: { type: String, value: 'hours' }, completed: { type: String, value: '' }
  };
  static css = componentStyles;
  static template = html`
    <div class="actions">
      <pl-button label="Часы" on-click="[[hours]]"></pl-button>
      <pl-button label="Минуты" on-click="[[minutes]]"></pl-button>
      <output>[[describe(hour, minute, mode)]]</output>
    </div>
    <pl-time-picker id="clock" value-hour="{{hour}}" value-minute="{{minute}}" mode="{{mode}}" on-done="[[done]]"></pl-time-picker>
    <output aria-live="polite">[[completed]]</output>
  `;
  hours() { this.mode = 'hours'; }
  minutes() { this.mode = 'minutes'; }
  describe(hour, minute, mode) { return `${`${hour}`.padStart(2, '0')}:${`${minute}`.padStart(2, '0')} · ${mode}`; }
  done() { this.completed = 'Выбор минут завершён: получено событие done'; }
}
customElements.define('pl-doc-time-picker-demo', PlDocTimePickerDemo);
