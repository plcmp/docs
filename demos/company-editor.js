import { PlElement, html } from 'polylib';
import '@nfjs/front-pl/components/pl-action.js';
import '@nfjs/front-pl/components/pl-dataset.js';
import '@plcmp/pl-data-observer';
import '@plcmp/pl-valid-observer';
import '@plcmp/pl-input';
import '@plcmp/pl-button';
import { companyStyles } from './company-styles.js';
import { createCompanySession, failNextRequest, lastRequest } from './company-service.js';

class PlDocCompanyEditorDemo extends PlElement {
  static properties = {
    service: { value: createCompanySession },
    employee: { type: Object }, contacts: { type: Array },
    personChanged: { value: false }, contactsChanged: { value: false },
    personBusy: { value: false }, contactsBusy: { value: false },
    personInvalid: { value: false }, contactsInvalid: { value: false },
    ready: { value: false }, error: { value: '' }, message: { value: '' }, request: { value: '' }
  };
  static css = companyStyles;
  static template = html`
    <pl-action id="get" endpoint="[[service.getEndpoint]]"></pl-action>
    <pl-action id="savePerson" endpoint="[[service.updateEndpoint]]"></pl-action>
    <pl-action id="saveContacts" endpoint="[[service.contactsSaveEndpoint]]"></pl-action>
    <pl-dataset id="contacts" endpoint="[[service.contactsEndpoint]]" data="{{contacts}}"></pl-dataset>
    <pl-data-observer id="personChanges" data="{{employee}}" is-changed="{{personChanged}}"></pl-data-observer>
    <pl-data-observer id="contactChanges" data="{{contacts}}" is-changed="{{contactsChanged}}"></pl-data-observer>
    <output hidden="[[ready]]">Загружаем сотрудника и контакты…</output>
    <div class="zones" hidden="[[!ready]]">
      <section class="zone">
        <h3>Персональные данные</h3>
        <pl-valid-observer invalid="{{personInvalid}}"></pl-valid-observer>
        <pl-input id="lastname" label="Фамилия" value="{{employee.lastname}}" readonly="[[personBusy]]" required stretch></pl-input>
        <pl-input id="firstname" label="Имя" value="{{employee.firstname}}" readonly="[[personBusy]]" required stretch></pl-input>
        <output class="status" aria-live="polite">[[status(personChanged, personBusy)]]</output>
        <pl-button label="Сохранить данные" variant="primary" on-click="[[savePerson]]"
          disabled="[[blocked(personChanged, personBusy, personInvalid)]]"></pl-button>
      </section>
      <section class="zone" id="contactFields">
        <h3>Контакты</h3>
        <pl-valid-observer invalid="{{contactsInvalid}}"></pl-valid-observer>
        <template d:repeat="{{contacts}}" d:as="contact">
          <div class="row">
            <pl-input label="Электронная почта" value="{{contact.contact}}" readonly="[[contactsBusy]]" required stretch></pl-input>
            <pl-button label="Удалить" on-click="[[removeContact]]" disabled="[[contactsBusy]]"></pl-button>
          </div>
        </template>
        <pl-button label="Добавить контакт" on-click="[[addContact]]" disabled="[[contactsBusy]]"></pl-button>
        <output class="status" aria-live="polite">[[status(contactsChanged, contactsBusy)]]</output>
        <pl-button label="Сохранить контакты" variant="primary" on-click="[[saveContacts]]"
          disabled="[[blocked(contactsChanged, contactsBusy, contactsInvalid)]]"></pl-button>
      </section>
    </div>
    <output aria-live="polite">[[overall(personChanged, contactsChanged)]]</output>
    <div class="toolbar">
      <pl-button label="Ошибка следующего запроса" on-click="[[failNext]]" disabled="[[busy(personBusy, contactsBusy)]]"></pl-button>
    </div>
    <output>[[message]]</output>
    <output class="error" role="alert" hidden="[[!error]]">[[error]]</output>
    <details><summary>Что отправлено на сохранение</summary><pre>[[request]]</pre></details>
  `;
  connectedCallback() {
    super.connectedCallback();
    if (!this._started) { this._started = true; this.load(); }
  }
  async load() {
    try {
      const [employee] = await Promise.all([
        this.$.get.execute({ employeeId: '101' }),
        this.$.contacts.execute({ employeeId: '101' })
      ]);
      this.employee = employee;
      this.$.personChanges.snapshot();
      this.$.contactChanges.snapshot();
      this.ready = true;
    } catch (error) { this.error = error.message; }
  }
  status(changed, saving) { return saving ? 'Сохранение…' : changed ? 'Есть изменения' : 'Нет изменений'; }
  blocked(changed, saving, invalid) { return !changed || saving || invalid; }
  busy(person, contacts) { return person || contacts; }
  overall(person, contacts) {
    if (person && contacts) return 'Не сохранены персональные данные и контакты';
    if (person) return 'Не сохранены только персональные данные';
    if (contacts) return 'Не сохранены только контакты';
    return 'Все изменения сохранены';
  }
  addContact() { this.push('contacts', { contact_type: 2, contact: '' }); }
  removeContact(event) { this.splice('contacts', this.contacts.indexOf(event.model.contact), 1); }
  failNext() { failNextRequest(this.service); this.message = 'Следующий запрос завершится учебной ошибкой'; }

  async savePerson() {
    if (this.blocked(this.personChanged, this.personBusy, this.personInvalid)) return;
    this.personBusy = true;
    this.error = this.message = '';
    try {
      await Promise.all([this.$.lastname.validate(), this.$.firstname.validate()]);
      if (this.$.lastname.invalid || this.$.firstname.invalid) return;
      const pending = this.$.savePerson.execute(this.employee);
      this.request = JSON.stringify(lastRequest(this.service), null, 2);
      const result = await pending;
      // /employee/update не возвращает всю карточку: перечитываем только её.
      this.employee = await this.$.get.execute({ employeeId: result.id });
      this.$.personChanges.snapshot();
      this.message = 'Персональные данные сохранены. Контакты остались в редакторе.';
    } catch (error) { this.error = error.message; }
    finally { this.personBusy = false; }
  }

  async saveContacts() {
    if (this.blocked(this.contactsChanged, this.contactsBusy, this.contactsInvalid)) return;
    this.contactsBusy = true;
    this.error = this.message = '';
    try {
      const fields = [...this.$.contactFields.querySelectorAll('pl-input')];
      await Promise.all(fields.map((field) => field.validate()));
      if (fields.some((field) => field.invalid)) return;
      const pending = this.$.saveContacts.execute({ employeeId: this.employee.id, contacts: this.contacts._mutations });
      this.request = JSON.stringify(lastRequest(this.service), null, 2);
      const result = await pending;
      // Dataset продолжает владеть ControlledArray; заменяем его содержимое.
      this.splice('contacts', 0, this.contacts.length, ...result.contacts);
      this.$.contactChanges.snapshot();
      this.message = 'Контакты сохранены. Персональные данные остались в редакторе.';
    } catch (error) { this.error = error.message; }
    finally { this.contactsBusy = false; }
  }
}
customElements.define('pl-doc-company-editor-demo', PlDocCompanyEditorDemo);
