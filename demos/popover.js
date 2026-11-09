import { PlElement, html, css } from 'polylib';
import { PlPopover } from '@plcmp/pl-popover';
import '@plcmp/pl-button';

class PlDocEmployeePopover extends PlPopover {
  static template = html`<slot></slot>`;
  static css = css`
    :host { display: none; position: absolute; inset: unset; margin: 0; padding: var(--pl-space-lg); max-width: min(280px, 80vw); background: var(--pl-surface-color); color: var(--pl-text-color); border: 1px solid var(--pl-grey-light); border-radius: var(--pl-border-radius); box-shadow: 0 4px 16px #0002; }
    :host([visible]) { display: grid; gap: var(--pl-space-md); }
  `;
}
customElements.define('pl-doc-employee-popover', PlDocEmployeePopover);

class PlDocPopoverDemo extends PlElement {
  static css = css`:host { display: block; position: relative; } p { margin: 0; }`;
  static template = html`
    <pl-button id="anchor" label="Сведения о сотруднике" on-click="[[show]]"></pl-button>
    <pl-doc-employee-popover id="popup" top-layer direction="down">
      <strong>Анна Смирнова</strong><p>Разработка · anna@example.org</p>
      <pl-button label="Закрыть" on-click="[[hide]]"></pl-button>
    </pl-doc-employee-popover>
  `;
  show() { this.$.popup.show(this.$.anchor); }
  hide() { this.$.popup.hide(); }
  disconnectedCallback() { if (this.$.popup.visible) this.hide(); super.disconnectedCallback(); }
}
customElements.define('pl-doc-popover-demo', PlDocPopoverDemo);
