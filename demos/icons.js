import { PlElement, html } from 'polylib';
import '@plcmp/pl-icon';
import '@plcmp/pl-iconset';
import '@plcmp/pl-button';
import { componentStyles } from './component-styles.js';

const shapes = document.createElement('pl-iconset');
shapes.iconset = 'docs-shapes';
shapes.hidden = true;
shapes.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">
  <g id="circle" viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke="currentColor"
      stroke-width="2">
    </circle>
  </g>
  <g id="triangle" viewBox="0 0 24 24">
    <path
      d="M12 3 22 21H2Z"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round">
    </path>
  </g>
</svg>`;
document.body.append(shapes);
// Сначала регистрируем SVG-группы, затем создаём использующие их элементы.
await new Promise(resolve => shapes.shadowRoot.querySelector('slot').addEventListener('slotchange', resolve, { once: true }));

class PlDocIconsetDemo extends PlElement {
  static properties = { icon: { type: String, value: 'circle' } };
  static css = componentStyles;
  static template = html`
    <div class="actions">
      <pl-icon iconset="docs-shapes" icon="[[icon]]" size="24" title="Фигура"></pl-icon>
      <pl-icon iconset="docs-shapes" icon="[[icon]]" size="40" title="Фигура большего размера"></pl-icon>
      <pl-button label="Сменить значок" on-click="[[toggle]]"></pl-button>
    </div>
    <output>iconset = docs-shapes · icon = [[icon]]</output>
  `;
  toggle() { this.icon = this.icon === 'circle' ? 'triangle' : 'circle'; }
}
customElements.define('pl-doc-iconset-demo', PlDocIconsetDemo);
