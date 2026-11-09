import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-input';
import '@plcmp/pl-checkbox';

class PlDocBindingsDemo extends PlElement {
  static properties = {
    name: { type: String, value: 'Анна' },
    enabled: { type: Boolean, value: true }
  };

  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); }
    output { font: var(--pl-text-font); overflow-wrap: anywhere; }
  `;

  static template = html`
    <pl-checkbox caption="Разрешить редактирование" checked="{{enabled}}"></pl-checkbox>
    <pl-input label="Имя" value="{{name}}" disabled="[[!enabled]]" stretch></pl-input>
    <output aria-live="polite">[[greeting(name)]]</output>
  `;

  greeting(name) {
    return name ? `Привет, ${name}!` : 'Введи имя';
  }
}

customElements.define('pl-doc-bindings-demo', PlDocBindingsDemo);
