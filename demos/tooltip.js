import { PlElement, html } from 'polylib';
import { componentStyles } from './component-styles.js';
import '@plcmp/pl-tooltip';
import '@plcmp/pl-tooltip/pl-tooltip-target.js';
import '@plcmp/pl-button';

class PlDocTooltipDemo extends PlElement {
  static css = componentStyles;
  static template = html`
    <div class="actions">
      <pl-button id="target" label="Наведи указатель или нажми" on-click="[[show]]"></pl-button>
      <pl-tooltip id="hint" target="[[$.target]]" text="Отчёт включает сотрудников выбранного отдела."></pl-tooltip>
      <pl-button label="Скрыть подсказку" on-click="[[hide]]"></pl-button>
    </div>
    <pl-tooltip-target text="Здесь можно разместить подпись к любому содержимому.">
      <span>Подсказка через pl-tooltip-target: наведи указатель на эту строку.</span>
    </pl-tooltip-target>
  `;
  show() { this.$.hint.show(this.$.target); }
  hide() { this.$.hint.hide(); }
  disconnectedCallback() { if (this.$.hint.visible) this.hide(); super.disconnectedCallback(); }
}
customElements.define('pl-doc-tooltip-demo', PlDocTooltipDemo);
