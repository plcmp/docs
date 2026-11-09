import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-input';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-button';

class PlDocTemplateDemo extends PlElement {
  static properties = {
    show: { type: Boolean, value: true },
    selected: { type: String, value: 'Пока ничего не выбрано' },
    rows: { type: Array, value: () => [
      { id: 1, title: 'Изучить биндинги' },
      { id: 2, title: 'Проверить реактивность' }
    ] }
  };

  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); }
    output { font: var(--pl-text-font); }
  `;

  static template = html`
    <pl-checkbox caption="Показать поля" checked="{{show}}"></pl-checkbox>
    <template d:if="[[show]]">
      <pl-input label="d:if — сохраняет введённое" stretch></pl-input>
    </template>
    <template d:if="[[show]]" d:restamp>
      <pl-input label="d:restamp — создаёт поле заново" stretch></pl-input>
    </template>
    <template d:repeat="[[rows]]" d:as="row">
      <pl-button label="[[row.title]]" on-click="[[selectRow]]"></pl-button>
    </template>
    <output aria-live="polite">[[selected]]</output>
  `;

  selectRow(event) {
    this.selected = event.model.row.title;
  }
}

customElements.define('pl-doc-template-demo', PlDocTemplateDemo);
