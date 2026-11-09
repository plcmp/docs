import { PlElement, html } from 'polylib';
import '@nfjs/front-pl/components/pl-action.js';
import '@plcmp/pl-data-observer';
import '@plcmp/pl-valid-observer';
import '@plcmp/pl-input';
import '@plcmp/pl-button';
import { companyStyles } from './company-styles.js';
import { createCompanySession, lastRequest } from './company-service.js';

/** Редактор владеет снимком одной карточки вместе с её периодами. */
class PlDocCompanyCardEditor extends PlElement {
  static properties = {
    card: { type: Object }, endpoint: { type: String }, service: { type: Object },
    changed: { value: false }, saving: { value: false }, invalid: { value: false },
    error: { value: '' }, request: { value: '' }
  };
  static css = companyStyles;
  static template = html`
    <pl-data-observer id="changes" data="{{card}}" is-changed="{{changed}}"></pl-data-observer>
    <pl-action id="save" endpoint="[[endpoint]]" paths="card.inoperabilities"></pl-action>
    <section class="zone">
      <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
      <h3>Личная карточка № [[card.id]]</h3>
      <p class="muted">Начало работы: [[card.date_begin]]</p>
      <pl-input label="Ставка" type="number" min="0.1" max="1.5" step="0.1" value="{{card.rate}}" required readonly="[[saving]]" stretch></pl-input>
      <template d:repeat="{{card.inoperabilities}}" d:as="period">
        <div class="row">
          <pl-input label="Описание причины нетрудоспособности" value="{{period.other_type_description}}" required readonly="[[saving]]" stretch></pl-input>
          <pl-button label="Удалить период" on-click="[[removePeriod]]" disabled="[[saving]]"></pl-button>
        </div>
      </template>
      <pl-button label="Добавить период" on-click="[[addPeriod]]" disabled="[[saving]]"></pl-button>
      <output class="status" aria-live="polite">[[status(changed, saving)]]</output>
      <pl-button label="Сохранить эту карточку" variant="primary" on-click="[[save]]" disabled="[[blocked(changed, saving, invalid)]]"></pl-button>
      <output class="error" role="alert" hidden="[[!error]]">[[error]]</output>
      <details><summary>Запрос этой карточки</summary><pre>[[request]]</pre></details>
    </section>
  `;
  connectedCallback() {
    super.connectedCallback();
    if (!this._started) { this._started = true; this.$.changes.snapshot(); }
  }
  status(changed, saving) { return saving ? 'Сохранение…' : changed ? 'Есть изменения' : 'Нет изменений'; }
  blocked(changed, saving, invalid) { return !changed || saving || invalid; }
  addPeriod() {
    const end = new Date(this.card.date_begin);
    end.setUTCDate(end.getUTCDate() + 1);
    this.push('card.inoperabilities', {
      type: 2, other_type_description: 'Иные причины', date_begin: this.card.date_begin, date_end: end.toISOString().slice(0, 10)
    });
  }
  removePeriod(event) { this.splice('card.inoperabilities', this.card.inoperabilities.indexOf(event.model.period), 1); }
  async save() {
    if (this.blocked(this.changed, this.saving, this.invalid)) return;
    this.saving = true;
    this.error = '';
    try {
      const fields = [...this.shadowRoot.querySelectorAll('pl-input')];
      await Promise.all(fields.map((field) => field.validate()));
      if (fields.some((field) => field.invalid)) return;
      const pending = this.$.save.execute({ employeeId: this.card.employee_id, card: this.card });
      this.request = JSON.stringify(lastRequest(this.service), null, 2);
      const result = await pending;
      this.card = result.card;
      this.$.changes.snapshot();
    } catch (error) { this.error = error.message; }
    finally { this.saving = false; }
  }
}
customElements.define('pl-doc-company-card-editor', PlDocCompanyCardEditor);

/** Родитель связывает независимые редакторы и собирает их признаки изменений. */
class PlDocCompanyCardsDemo extends PlElement {
  static properties = {
    service: { value: createCompanySession }, editors: { value: () => [] },
    loading: { value: true }, error: { value: '' }
  };
  static css = companyStyles;
  static template = html`
    <pl-action id="load" endpoint="[[service.cardsEndpoint]]"></pl-action>
    <output hidden="[[!loading]]">Загружаем личные карточки…</output>
    <template d:repeat="{{editors}}" d:as="editor">
      <pl-doc-company-card-editor card="{{editor.card}}" changed="{{editor.changed}}"
        endpoint="[[service.cardSaveEndpoint]]" service="[[service]]"></pl-doc-company-card-editor>
    </template>
    <output class="status" aria-live="polite">Несохранённых карточек: [[dirtyCount(editors)]]</output>
    <output class="error" role="alert" hidden="[[!error]]">[[error]]</output>
  `;
  connectedCallback() {
    super.connectedCallback();
    if (!this._started) { this._started = true; this.load(); }
  }
  async load() {
    try {
      const cards = await this.$.load.execute({ employeeId: '101' });
      this.editors = cards.map((card) => ({ card, changed: false }));
    } catch (error) { this.error = error.message; }
    finally { this.loading = false; }
  }
  dirtyCount(editors) { return editors.filter((editor) => editor.changed).length; }
}
customElements.define('pl-doc-company-cards-demo', PlDocCompanyCardsDemo);
