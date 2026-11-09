import { PlElement, html } from 'polylib';
import { componentStyles } from './component-styles.js';
import '@plcmp/pl-combobox';
import '@plcmp/pl-button';

class PlDocComboboxDemo extends PlElement {
  static properties = {
    departments: { type: Array, value: () => [
      { id: 'dev', name: 'Разработка' },
      { id: 'support', name: 'Поддержка' },
      { id: 'sales', name: 'Продажи' }
    ] },
    department: { type: String, value: 'dev' },
    selected: { type: Object },
    departmentsList: { type: Array, value: () => ['dev'] },
    selectedList: { type: Array, value: () => [] },
    cities: { type: Array, value: () => ['Казань', 'Москва', 'Самара'] },
    city: { type: String, value: 'Казань' }
  };
  static css = componentStyles;
  static template = html`
    <div class="fields">
      <pl-combobox
        id="single"
        label="Отдел"
        data="[[departments]]"
        text-property="name"
        value-property="id"
        value="{{department}}"
        selected="{{selected}}"
        required
        stretch>
      </pl-combobox>
      <pl-combobox
        id="multiple"
        label="Участники из отделов"
        data="[[departments]]"
        text-property="name"
        value-property="id"
        value-list="{{departmentsList}}"
        selected-list="{{selectedList}}"
        multi-select
        variant="tags"
        stretch>
      </pl-combobox>
      <pl-combobox
        id="custom"
        label="Город: из списка или свой"
        data="[[cities]]"
        value="{{city}}"
        allow-custom-value
        stretch>
      </pl-combobox>
    </div>
    <pre>[[state(department, selected, departmentsList, selectedList, city)]]</pre>
    <pl-button label="Выбрать поддержку" on-click="[[selectSupport]]"></pl-button>
  `;
  state(department, selected, valueList, selectedList, city) {
    return JSON.stringify({ value: department, selected, valueList, selectedList, city }, null, 2);
  }
  selectSupport() { this.department = 'support'; }
  disconnectedCallback() {
    for (const id of ['single', 'multiple', 'custom']) this.$[id].$.dd.close();
    super.disconnectedCallback();
  }
}
customElements.define('pl-doc-combobox-demo', PlDocComboboxDemo);
