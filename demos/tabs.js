import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-tabpanel';
import '@plcmp/pl-icon';
import '@plcmp/pl-input';
import '@plcmp/pl-checkbox';

class PlDocTabsDemo extends PlElement {
  static properties = {
    selected: { type: String, value: 'profile' },
    name: { type: String, value: 'Анна Смирнова' },
    email: { type: String, value: 'anna@example.org' },
    allowContacts: { type: Boolean, value: true },
    message: { type: String, value: '' }
  };
  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); }
    pl-tabpanel { height: 190px; min-width: 0; }
    .page { padding: var(--pl-space-sm); display: grid; gap: var(--pl-space-md); }
    output { font: var(--pl-text-font); }
  `;
  static template = html`
    <pl-checkbox caption="Разрешить переход к контактам" checked="{{allowContacts}}"></pl-checkbox>
    <pl-tabpanel id="tabs" selected="{{selected}}">
      <pl-tab name="profile" header="Сотрудник">
        <pl-icon slot="prefix" iconset="demo" icon="person" size="16" title="Сотрудник"></pl-icon>
        <div class="page"><pl-input label="Имя" value="{{name}}" stretch></pl-input></div>
      </pl-tab>
      <pl-tab name="contacts">
        <span slot="header">Контакты</span>
        <pl-icon slot="suffix" iconset="demo" icon="mail" size="16" title="Почта"></pl-icon>
        <div class="page"><pl-input label="Почта" value="{{email}}" stretch></pl-input></div>
      </pl-tab>
      <pl-tab name="archive" header="Архив" disabled><div class="page">Архив недоступен</div></pl-tab>
    </pl-tabpanel>
    <output>selected = [[selected]]</output>
    <output aria-live="polite">[[message]]</output>
  `;
  connectedCallback() {
    super.connectedCallback();
    this.$.tabs.beforeSelect = tab => {
      const allowed = tab.name !== 'contacts' || this.allowContacts;
      this.message = allowed ? '' : 'Переход остановлен в beforeSelect';
      return allowed;
    };
  }
}
customElements.define('pl-doc-tabs-demo', PlDocTabsDemo);
