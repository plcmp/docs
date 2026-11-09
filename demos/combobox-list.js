import { PlElement, html } from 'polylib';
import { componentStyles } from './component-styles.js';
import '@plcmp/pl-combobox/pl-combobox-list.js';

class PlDocComboboxListDemo extends PlElement {
  static properties = {
    rows: { type: Array, value: () => [
      { value: 'dev', text: 'Разработка' },
      { value: 'support', text: 'Поддержка' }
    ] },
    selected: { type: Object, value: null }
  };
  static css = componentStyles;
  static template = html`
    <pl-combobox-list
      data="[[rows]]"
      _vdata="[[rows]]"
      text-property="text"
      value-property="value"
      on-select="[[select]]">
    </pl-combobox-list>
    <pre>[[json(selected)]]</pre>
  `;
  select(event) { this.selected = event.detail.model; }
  json(value) { return JSON.stringify(value, null, 2); }
}
customElements.define('pl-doc-combobox-list-demo', PlDocComboboxListDemo);
