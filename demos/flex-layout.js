import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-checkbox';

class PlDocFlexDemo extends PlElement {
  static properties = {
    vertical: { type: Boolean, value: false }
  };

  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); }
    .cell {
      padding: var(--pl-space-md) var(--pl-space-lg);
      background: var(--pl-primary-lightest);
      border: 1px solid var(--pl-primary-light);
      border-radius: var(--pl-border-radius);
      font: var(--pl-text-font);
    }
  `;

  static template = html`
    <pl-checkbox caption="Вертикальная раскладка" checked="{{vertical}}"></pl-checkbox>
    <pl-flex-layout vertical="[[vertical]]" wrap stretch gap="12">
      <div class="cell">Первый</div>
      <div class="cell">Второй</div>
      <div class="cell">Третий</div>
    </pl-flex-layout>
  `;
}

customElements.define('pl-doc-flex-demo', PlDocFlexDemo);
