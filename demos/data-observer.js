import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-data-observer';
import '@plcmp/pl-input';
import '@plcmp/pl-button';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-icon';

class PlDocDataObserverDemo extends PlElement {
  static properties = {
    rows: { type: Array, value: () => [
      { id: 1, title: 'План' },
      { id: 2, title: 'Отчёт' }
    ] },
    changed: { type: Boolean, value: false }
  };

  _nextId = 3;

  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); }
    .row { display: flex; align-items: flex-end; flex-wrap: wrap; gap: var(--pl-space-sm); }
    .row pl-input { flex: 1 1 180px; --pl-content-width: 100%; }
    output { font: var(--pl-text-font); }
  `;

  static template = html`
    <pl-data-observer id="changes" data="{{rows}}" is-changed="{{changed}}"></pl-data-observer>
    <template d:repeat="{{rows}}" d:as="row">
      <div class="row">
        <pl-input label="[[rowLabel(row.id)]]" value="{{row.title}}" stretch></pl-input>
        <pl-button label="Удалить" on-click="[[removeRow]]"></pl-button>
      </div>
    </template>
    <output aria-live="polite">[[status(changed)]]</output>
    <pl-flex-layout wrap stretch>
      <pl-button label="Добавить" on-click="[[addRow]]">
        <pl-icon slot="prefix" iconset="demo" icon="plus"></pl-icon>
      </pl-button>
      <pl-button label="Принять изменения" variant="primary" on-click="[[takeSnapshot]]">
        <pl-icon slot="prefix" iconset="demo" icon="check"></pl-icon>
      </pl-button>
      <pl-button label="Сбросить признаки" on-click="[[resetTracking]]"></pl-button>
    </pl-flex-layout>
  `;

  connectedCallback() {
    super.connectedCallback();
    this.$.changes.snapshot();
  }

  rowLabel(id) {
    return `Запись ${id}`;
  }

  status(changed) {
    return changed ? 'isChanged = true — есть несохранённые изменения' : 'isChanged = false — изменений нет';
  }

  addRow() {
    const id = this._nextId++;
    this.push('rows', { id, title: `Новая запись ${id}` });
  }

  removeRow(event) {
    this.splice('rows', this.rows.indexOf(event.model.row), 1);
  }

  takeSnapshot() {
    this.$.changes.snapshot();
  }

  resetTracking() {
    this.$.changes.reset();
  }
}

customElements.define('pl-doc-data-observer-demo', PlDocDataObserverDemo);
