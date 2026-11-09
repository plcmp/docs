import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import '@plcmp/pl-input';
import '@plcmp/pl-button';
import '@plcmp/pl-flex-layout';
import { tableStyles } from './shared.js';

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

// Шаблон создаётся один раз. Контекст row и обработчики обычной строки предоставляет таблица.
const groupedRowTemplate = html`
  <div class="grouped-row-block">
    <template d:if="[[row.isGroup]]" d:restamp>
      <div class="group-row" part="group-row">
        <div class="group-heading">
          <strong>[[row.zone]]</strong>
          <span>Позиций: [[row.count]]</span>
        </div>
        <div class="group-total">
          <strong>[[row.totalText]]</strong>
          <span>Сумма группы</span>
        </div>
      </div>
    </template>
    <template d:if="[[!row.isGroup]]" d:restamp>
      <div class="row" part$="[[_getRowParts(row)]]"
        active$="[[_isRowActive(row, selected, selectedList, multiSelect)]]"
        on-click="[[_onRowClick]]">
        <template d:repeat="[[_filterCols(_columns)]]" d:as="column">
          <div class$="[[_getCellClass(column, 'cell')]]"
            part$="[[_getCellParts(row, column)]]" hidden$="[[column.hidden]]">
            [[column.cellTemplate]]
          </div>
        </template>
      </div>
    </template>
  </div>
`;

class PlDocTableGroupedCustomRow extends PlElement {
  static properties = {
    records: {
      type: Array,
      observer: 'scheduleRows',
      value: () => [
        { id: 1, zone: 'Рабочие места', name: 'Эргономичное кресло', note: 'Регулируемые подлокотники и поясничная опора', quantity: 6, price: 21500, status: 'Согласовано' },
        { id: 2, zone: 'Рабочие места', name: 'Монитор 27″', note: 'USB-C, питание ноутбука от монитора', quantity: 6, price: 28500, status: 'Заказано' },
        { id: 3, zone: 'Рабочие места', name: 'Док-станция', note: 'Два дисплея и проводная сеть', quantity: 6, price: 12500, status: 'Согласовано' },
        { id: 4, zone: 'Переговорные', name: 'Спикерфон', note: 'Для встреч до восьми участников', quantity: 2, price: 36000, status: 'Заказано' },
        { id: 5, zone: 'Переговорные', name: 'Камера для видеосвязи', note: 'Широкий угол обзора, автоматическое кадрирование', quantity: 2, price: 48000, status: 'Согласовано' },
        { id: 6, zone: 'Переговорные', name: 'Экран для презентаций', note: 'Диагональ 65″, настенное крепление', quantity: 1, price: 84000, status: 'Запланировано' },
        { id: 7, zone: 'Студия записи', name: 'Студийный микрофон', note: 'Запись обучающих материалов и подкастов', quantity: 3, price: 18000, status: 'Запланировано' },
        { id: 8, zone: 'Студия записи', name: 'Комплект постоянного света', note: 'Мягкий свет для съёмки интервью', quantity: 2, price: 22000, status: 'Согласовано' },
        { id: 9, zone: 'Студия записи', name: 'Акустические панели', note: 'Комплект для уменьшения отражений звука', quantity: 1, price: 39000, status: 'Запланировано' }
      ]
    },
    query: { type: String, value: '', observer: 'scheduleRows' },
    rows: { type: Array, value: () => [] },
    customTemplate: { type: Object, value: () => groupedRowTemplate },
    selected: { type: Object, value: null },
    summary: { type: String, value: '' }
  };

  static css = css(`${tableStyles}
    :host { grid-template-columns: minmax(0, 1fr); }
    pl-table { height: auto; min-width: 0; max-width: 100%; }
    .toolbar { min-width: 0; width: 100%; }
    .toolbar pl-input { flex: 1 1 260px; min-width: 0; }
    .toolbar pl-button { flex: 0 0 auto; }
    .result { display: grid; gap: var(--pl-space-xs); min-width: 0; overflow-wrap: anywhere; }
    .result strong { font-weight: 600; }
    .result span { color: var(--pl-header-color); }
  `);

  static template = html`
    <pl-table id="table" data="[[rows]]" selected="{{selected}}"
      custom-row-template="[[customTemplate]]" growing variable-row-height>
      <pl-flex-layout slot="top-toolbar" class="toolbar" align="center" gap="8" wrap>
        <pl-input aria-label="Поиск оборудования или рабочей зоны"
          placeholder="Оборудование или рабочая зона" value="{{query}}" stretch></pl-input>
        <pl-button label="Сбросить поиск" variant="ghost" on-click="[[resetSearch]]"></pl-button>
      </pl-flex-layout>
      <template is="extra styles">
        <style>
          .grouped-row-block { display: block; width: 100%; min-height: 52px; box-sizing: border-box; }
          .group-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--pl-space-lg);
            width: 100%;
            min-height: 60px;
            box-sizing: border-box;
            padding: var(--pl-space-sm) var(--pl-space-md);
            border-bottom: 1px solid var(--pl-grey-light);
            background: var(--pl-grey-lightest);
            color: var(--pl-text-color);
          }
          .group-heading, .group-total, .item-heading {
            display: grid;
            gap: var(--pl-space-xs);
          }
          .group-total { text-align: right; white-space: nowrap; }
          .group-row strong, .item-heading strong { font-weight: 600; }
          .group-row span, .item-heading span { color: var(--pl-header-color); font-weight: 400; }
          .group-row span { font-size: 12px; }
          .row .cell { min-height: 52px; }
          .item-heading { padding-block: var(--pl-space-xs); }
          .item-heading span { font-size: 12px; line-height: 1.4; }
        </style>
      </template>
      <pl-table-column header="Оборудование" field="name" min-width="280" resizable>
        <template>
          <div class="item-heading">
            <strong>[[row.name]]</strong>
            <span>[[row.note]]</span>
          </div>
        </template>
      </pl-table-column>
      <pl-table-column header="Кол-во, шт." field="quantity" kind="number" format="0"
        width="100" min-width="90" align="right" header-align="right"></pl-table-column>
      <pl-table-column header="Цена, ₽" field="price" kind="number" format="0"
        width="130" min-width="110" align="right" header-align="right" resizable></pl-table-column>
      <pl-table-column header="Сумма, ₽" field="total" kind="number" format="0"
        width="140" min-width="120" align="right" header-align="right" resizable></pl-table-column>
      <pl-table-column header="Статус" field="status" width="150" min-width="140"></pl-table-column>
    </pl-table>
    <output class="result" aria-live="polite">
      <strong>[[summary]]</strong>
      <span>[[describeSelection(selected)]]</span>
    </output>
  `;

  connectedCallback() {
    super.connectedCallback();
    this.scheduleRows();
  }

  disconnectedCallback() {
    clearTimeout(this._rowsTimer);
    super.disconnectedCallback();
  }

  /** Объединяет уведомления свойств и ждёт подключения шаблона перед первой порцией данных. */
  scheduleRows() {
    clearTimeout(this._rowsTimer);
    this._rowsTimer = setTimeout(() => {
      if (this.isConnected) this.rebuildRows();
    }, 0);
  }

  /** За один проход фильтрует исходные записи, собирает группы и считает их суммы. */
  rebuildRows() {
    const query = this.query.trim().toLocaleLowerCase('ru-RU');
    const groups = new Map();
    let count = 0;
    let total = 0;

    for (const record of this.records) {
      const matches = !query || `${record.name} ${record.zone}`.toLocaleLowerCase('ru-RU').includes(query);
      if (!matches) continue;

      let group = groups.get(record.zone);
      if (!group) {
        group = { zone: record.zone, items: [], total: 0 };
        groups.set(record.zone, group);
      }
      const amount = record.quantity * record.price;
      group.items.push({ ...record, isGroup: false, total: amount });
      group.total += amount;
      count += 1;
      total += amount;
    }

    const selectedId = this.selected?.id;
    this.rows = [...groups.values()].flatMap(group => [
      { id: `group:${group.zone}`, isGroup: true, zone: group.zone, count: group.items.length, totalText: money.format(group.total) },
      ...group.items
    ]);
    this.selected = this.rows.find(row => !row.isGroup && row.id === selectedId) ?? null;
    this.summary = count
      ? `Зон: ${groups.size} · позиций: ${count} · общая сумма: ${money.format(total)}`
      : 'По запросу ничего не найдено.';
  }

  resetSearch() {
    this.query = '';
  }

  describeSelection(row) {
    return row ? `Выбрано: ${row.name} · ${row.zone}` : 'Выбери строку оборудования. Заголовки групп не выделяются.';
  }
}

customElements.define('pl-doc-table-grouped-custom-row', PlDocTableGroupedCustomRow);
