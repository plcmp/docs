import { PlElement, html, css } from 'polylib';

class PlDocCounter extends PlElement {
  static properties = {
    count: { type: Number, value: 0 }
  };

  static css = css`
    :host { display: flex; align-items: center; gap: var(--pl-space-lg); }
    button {
      padding: var(--pl-space-sm) var(--pl-space-md);
      border: 1px solid var(--pl-primary-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-primary-lightest);
      color: var(--pl-text-color);
      cursor: pointer;
      font: var(--pl-text-font);
    }
    output { font: var(--pl-text-font); }
  `;

  static template = html`
    <button type="button" on-click="[[increment]]">Увеличить</button>
    <output aria-live="polite">Счётчик: [[count]]</output>
  `;

  increment() {
    this.count += 1;
  }
}

customElements.define('pl-doc-counter', PlDocCounter);
