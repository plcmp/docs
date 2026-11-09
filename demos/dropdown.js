import { PlElement, html } from 'polylib';
import { componentStyles } from './component-styles.js';
import '@plcmp/pl-dropdown';
import '@plcmp/pl-button';

class PlDocDropdownDemo extends PlElement {
  static properties = { choice: { type: String, value: 'Действие ещё не выбрано' } };
  static css = componentStyles;
  static template = html`
    <pl-button id="anchor" label="Действия с отчётом" on-click="[[toggle]]"></pl-button>
    <pl-dropdown id="menu" direction="down">
      <div class="stack">
        <pl-button label="Скачать" iconset="demo" icon="download" on-click="[[download]]"></pl-button>
        <pl-button label="Настроить" iconset="demo" icon="settings" on-click="[[settings]]"></pl-button>
      </div>
    </pl-dropdown>
    <output aria-live="polite">[[choice]]</output>
  `;
  toggle() {
    if (this.$.menu.opened) {
      this.$.menu.close();
    } else {
      this.$.menu.open(this.$.anchor);
    }
  }
  download() {
    this.choice = 'Выбрано: скачать отчёт';
    this.$.menu.close();
  }
  settings() {
    this.choice = 'Выбрано: настроить отчёт';
    this.$.menu.close();
  }
  disconnectedCallback() {
    this.$.menu.close();
    super.disconnectedCallback();
  }
}
customElements.define('pl-doc-dropdown-demo', PlDocDropdownDemo);
