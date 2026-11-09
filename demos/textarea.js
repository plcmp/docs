import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-textarea';
import '@plcmp/pl-button';

class PlDocTextareaDemo extends PlElement {
  static properties = {
    text: { type: String, value: '' },
    invalid: { type: Boolean, value: true },
    result: { type: String, value: 'Введи текст, чтобы проверить обязательное поле.' }
  };

  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); min-width: 0; }
    output { font: var(--pl-text-font); overflow-wrap: anywhere; }
  `;

  static template = html`
    <pl-textarea label="Комментарий" placeholder="Что нужно уточнить?"
      value="{{text}}" invalid="{{invalid}}" required stretch hide-resizer></pl-textarea>
    <output aria-live="polite">[[describe(text, invalid)]]</output>
    <pl-button label="Проверить значение" disabled="[[invalid]]" on-click="[[confirm]]"></pl-button>
    <output aria-live="polite">[[result]]</output>
  `;

  describe(text, invalid) {
    return `Символов: ${text.length}. invalid = ${Boolean(invalid)}`;
  }

  confirm() {
    this.result = `Текущее значение: ${this.text}`;
  }
}

customElements.define('pl-doc-textarea-demo', PlDocTextareaDemo);
