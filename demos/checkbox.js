import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-button';

class PlDocCheckboxDemo extends PlElement {
  static properties = {
    enabled: { type: Boolean, value: false }
  };

  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); }
    output { font: var(--pl-text-font); }
  `;

  static template = html`
    <pl-checkbox caption="Получать уведомления" checked="{{enabled}}"></pl-checkbox>
    <output aria-live="polite">[[describe(enabled)]]</output>
    <pl-button label="Сбросить" on-click="[[reset]]"></pl-button>
  `;

  describe(enabled) {
    return enabled ? 'checked = true — уведомления включены' : 'checked = false — уведомления выключены';
  }

  reset() {
    this.enabled = false;
  }
}

customElements.define('pl-doc-checkbox-demo', PlDocCheckboxDemo);
