import { PlElement, html } from 'polylib';
import { componentStyles } from './component-styles.js';
import '@plcmp/pl-combobox';

class PlDocComboboxTreeDemo extends PlElement {
  static properties = {
    rows: { type: Array, value: () => [
      { id: 'office', parent: null, name: 'Головной офис', _opened: true },
      { id: 'dev', parent: 'office', name: 'Разработка' },
      { id: 'support', parent: 'office', name: 'Поддержка' },
      { id: 'branch', parent: null, name: 'Филиал', _opened: true },
      { id: 'sales', parent: 'branch', name: 'Продажи' }
    ] },
    value: { type: String, value: null }
  };
  static css = componentStyles;
  static template = html`
    <pl-combobox
      id="tree"
      label="Подразделение"
      data="[[rows]]"
      tree
      select-only-leaf
      key-property="id"
      pkey-property="parent"
      text-property="name"
      value-property="id"
      value="{{value}}"
      stretch>
    </pl-combobox>
    <output>[[describe(value)]]</output>
  `;
  describe(value) {
    return value === null ? 'Выбери конечное подразделение' : `value = ${value}`;
  }
  disconnectedCallback() {
    this.$.tree.$.dd.close();
    super.disconnectedCallback();
  }
}
customElements.define('pl-doc-combobox-tree-demo', PlDocComboboxTreeDemo);
