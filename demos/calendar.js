import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-datetime/pl-calendar.js';
import '@plcmp/pl-datetime/pl-datetime-month-selector.js';
import '@plcmp/pl-datetime/pl-datetime-year-selector.js';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-iconset-default';

class PlDocCalendarDemo extends PlElement {
  static properties = {
    month: { value: () => new Date(2026, 10, 1) },
    selected: { value: () => new Date(2026, 10, 16) },
    restricted: { value: () => [new Date(2026, 10, 12), new Date(2026, 10, 13)] }
  };
  static css = css`
    :host {
      display: grid;
      justify-items: start;
      gap: var(--pl-space-lg);
    }

    .navigation {
      display: flex;
      flex-wrap: wrap;
      gap: var(--pl-space-lg);
    }

    output { font: var(--pl-text-font); }
  `;
  static template = html`
    <div class="navigation">
      <pl-datetime-month-selector date="{{month}}"></pl-datetime-month-selector>
      <pl-datetime-year-selector date="{{month}}"></pl-datetime-year-selector>
    </div>
    <pl-calendar
      id="calendar"
      date="[[month]]"
      selected="[[selected]]"
      restricted="[[restricted]]">
    </pl-calendar>
    <output>[[describe(selected)]]</output>
  `;
  constructor() {
    super();
    this._selectDay = event => {
      this.selected = event.detail.day.toDate();
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.$.calendar.addEventListener('on-day-click', this._selectDay);
  }
  disconnectedCallback() {
    this.$.calendar.removeEventListener('on-day-click', this._selectDay);
    super.disconnectedCallback();
  }
  describe(value) { return `Выбрано: ${value.toLocaleDateString('ru-RU')}`; }
}
customElements.define('pl-doc-calendar-demo', PlDocCalendarDemo);
