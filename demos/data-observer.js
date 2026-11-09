import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-data-observer';
import '@plcmp/pl-input';
import '@plcmp/pl-button';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-icon';

class PlDocDataObserverDemo extends PlElement {
  static properties = {
    rows: { type: Array, value: () => [
      { id: 1, title: 'План', items: [{ id: 11, title: 'Черновик' }] },
      { id: 2, title: 'Отчёт', items: [{ id: 21, title: 'Итоги' }] }
    ], observer: 'schedulePreview' },
    changed: { type: Boolean, value: false },
    dataJson: { type: String },
    mutationsJson: { type: String },
    nestedJournals: { type: Array, value: () => [] }
  };

  _nextId = 3;
  _touchNumber = 0;
  _previewQueued = false;

  static css = css`
    :host { display: block; container-type: inline-size; }
    .workspace { display: grid; grid-template-columns: minmax(260px, 1.15fr) repeat(2, minmax(0, 1fr)); gap: var(--pl-space-lg); align-items: start; }
    .editor { display: grid; gap: var(--pl-space-lg); min-width: 0; }
    .record { display: grid; gap: var(--pl-space-sm); }
    .row { display: flex; align-items: flex-end; flex-wrap: wrap; gap: var(--pl-space-sm); }
    .row pl-input { flex: 1 1 180px; --pl-content-width: 100%; }
    .record > pl-input { --pl-content-width: 100%; }
    .json-panel { min-width: 0; }
    h3 { margin: 0 0 var(--pl-space-xs); font: var(--pl-text-font); font-weight: 600; }
    .path, .legend { margin: 0 0 var(--pl-space-sm); color: var(--pl-text-color); font: var(--pl-text-font); line-height: 1.5; overflow-wrap: anywhere; }
    .path { font-family: monospace; }
    .legend { margin-top: var(--pl-space-sm); }
    .nested-journal { margin-top: var(--pl-space-lg); }
    pre { margin: 0; padding: var(--pl-space-md); border: 1px solid var(--pl-grey-light); border-radius: var(--pl-border-radius); background: var(--pl-grey-lightest); color: var(--pl-text-color); font: 12px/1.6 monospace; white-space: pre-wrap; overflow-wrap: anywhere; max-height: 560px; overflow: auto; }
    output { font: var(--pl-text-font); }
    @container (max-width: 900px) {
      .workspace { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .editor { grid-column: 1 / -1; }
    }
    @container (max-width: 560px) {
      .workspace { grid-template-columns: minmax(0, 1fr); }
      .editor { grid-column: auto; }
    }
  `;

  static template = html`
    <pl-data-observer id="changes" data="{{rows}}" is-changed="{{changed}}"></pl-data-observer>
    <div class="workspace">
      <section class="editor" aria-label="Редактирование записей">
        <template d:repeat="{{rows}}" d:as="row">
          <div class="record">
            <div class="row">
              <pl-input label="[[rowLabel(row.id)]]" value="{{row.title}}" stretch></pl-input>
              <pl-button label="Удалить" on-click="[[removeRow]]"></pl-button>
            </div>
            <pl-input label="Вложенный пункт" value="{{row.items.0.title}}" stretch></pl-input>
          </div>
        </template>
        <output aria-live="polite">[[status(changed)]]</output>
        <pl-flex-layout wrap stretch>
          <pl-button label="Добавить" on-click="[[addRow]]">
            <pl-icon slot="prefix" iconset="demo" icon="plus"></pl-icon>
          </pl-button>
          <pl-button label="Показать touch" on-click="[[changeNestedItem]]" disabled="[[noRows(rows)]]"></pl-button>
          <pl-button label="Принять изменения" variant="primary" on-click="[[takeSnapshot]]">
            <pl-icon slot="prefix" iconset="demo" icon="check"></pl-icon>
          </pl-button>
          <pl-button label="Сбросить признаки" on-click="[[resetTracking]]"></pl-button>
        </pl-flex-layout>
      </section>
      <section class="json-panel" aria-label="JSON текущих данных">
        <h3>Данные</h3>
        <p class="path">rows</p>
        <pre id="dataJson" tabindex="0">[[dataJson]]</pre>
      </section>
      <section class="json-panel" aria-label="JSON журнала изменений">
        <h3>Изменения</h3>
        <p class="path">rows._mutations</p>
        <pre id="mutationsJson" tabindex="0">[[mutationsJson]]</pre>
        <p class="legend">add — добавлено<br>upd — изменено<br>del — удалено<br>touch — затронуто</p>
        <template d:repeat="[[nestedJournals]]" d:as="journal">
          <div class="nested-journal">
            <h3>[[journal.label]]</h3>
            <p class="path">[[journal.path]]</p>
            <pre tabindex="0">[[journal.json]]</pre>
          </div>
        </template>
      </section>
    </div>
  `;

  connectedCallback() {
    super.connectedCallback();
    this.takeSnapshot();
  }

  rowLabel(id) {
    return `Запись ${id}`;
  }

  status(changed) {
    return changed ? 'isChanged = true — есть несохранённые изменения' : 'isChanged = false — изменений нет';
  }

  noRows(rows) {
    return rows.length === 0;
  }

  /** Обновляет JSON после того, как наблюдатель обработал все уведомления этой правки. */
  schedulePreview() {
    if (this._previewQueued) return;
    this._previewQueued = true;
    queueMicrotask(() => {
      this._previewQueued = false;
      if (this.isConnected) this.refreshPreview();
    });
  }

  /** Показывает данные без снимков, а журналы массивов — отдельно от их элементов. */
  refreshPreview() {
    const json = value => JSON.stringify(value, (key, item) =>
      key === '_old' || key === '_mutations' ? undefined : item, 2);
    this.dataJson = json(this.rows);
    this.mutationsJson = json(this.rows._mutations);
    this.nestedJournals = this.rows.flatMap((row, index) => {
      const mutations = row.items._mutations;
      if (!mutations || !Object.values(mutations).some(items => items.length)) return [];
      return [{
        label: `Пункты записи ${row.id}`,
        path: `rows[${index}].items._mutations`,
        json: json(mutations)
      }];
    });
  }

  addRow() {
    const id = this._nextId++;
    this.push('rows', { id, title: `Новая запись ${id}`, items: [{ id: id * 10 + 1, title: 'Новый пункт' }] });
  }

  removeRow(event) {
    this.splice('rows', this.rows.indexOf(event.model.row), 1);
  }

  /** Меняет поле дочерней строки; наблюдатель сам добавляет родителя в touch. */
  changeNestedItem() {
    this.set('rows.0.items.0.title', `Пункт изменён ${++this._touchNumber}`);
  }

  takeSnapshot() {
    this.$.changes.snapshot();
    this.refreshPreview();
  }

  resetTracking() {
    this.$.changes.reset();
    this.refreshPreview();
  }
}

customElements.define('pl-doc-data-observer-demo', PlDocDataObserverDemo);
