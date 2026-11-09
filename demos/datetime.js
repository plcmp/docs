import { PlElement, html } from 'polylib';
import { componentStyles } from './component-styles.js';
import '@plcmp/pl-datetime';
import '@plcmp/pl-button';

class PlDocDatetimeDemo extends PlElement {
  static properties = {
    date: { value: () => new Date(2026, 10, 16) },
    meeting: { value: () => new Date(2026, 10, 16, 14, 30) },
    min: { value: () => new Date(2026, 10, 1) },
    max: { value: () => new Date(2026, 10, 30, 23, 59) },
    restricted: { value: () => [new Date(2026, 10, 12), new Date(2026, 10, 13)] },
    invalid: { type: Boolean }
  };
  static css = componentStyles;
  static template = html`
    <div class="fields">
      <pl-datetime
        id="date"
        label="Дата в ноябре"
        value="{{date}}"
        min="[[min]]"
        max="[[max]]"
        restricted="[[restricted]]"
        invalid="{{invalid}}"
        required
        stretch>
      </pl-datetime>
      <pl-datetime
        id="meeting"
        label="Начало встречи"
        type="datetime"
        value="{{meeting}}"
        stretch>
      </pl-datetime>
    </div>
    <pre>[[state(date, meeting, invalid)]]</pre>
    <pl-button label="Назначить 20 ноября, 10:15" on-click="[[reschedule]]"></pl-button>
  `;
  state(date, meeting, invalid) {
    const format = value => value ? value.toLocaleString('ru-RU') : null;
    return JSON.stringify({ date: format(date), meeting: format(meeting), invalid }, null, 2);
  }
  reschedule() {
    this.date = new Date(2026, 10, 20);
    this.meeting = new Date(2026, 10, 20, 10, 15);
  }
  disconnectedCallback() {
    this.$.date.$.dd.close();
    this.$.meeting.$.dd.close();
    super.disconnectedCallback();
  }
}
customElements.define('pl-doc-datetime-demo', PlDocDatetimeDemo);
