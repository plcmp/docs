import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';

export default class EmployeeCard extends PlForm {
  static properties = {
    formTitle: { value: 'Карточка сотрудника · REST' },
    urlParams: { value: () => ['employeeId'] },
    employeeId: {},
    employee: { type: Object, value: () => ({ gender: 2 }) },
    contacts: { type: Array, value: () => [] },
    contactTypes: { value: () => [{ id: 1, name: 'Телефон' }, { id: 2, name: 'Электронная почта' }] },
    genders: { value: () => [{ id: 1, name: 'Мужской' }, { id: 2, name: 'Женский' }] },
    invalid: { type: Boolean, value: false },
    saving: { type: Boolean, value: false },
    employeeChanged: { type: Boolean },
    contactsChanged: { type: Boolean }
  };
  static css = css`
    :host { display: block; padding: var(--pl-space-lg); }
    .fields { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: var(--pl-space-md); max-width: 900px; }
    .contacts { margin-top: var(--pl-space-xl); max-width: 900px; }
    .contact { margin-block: var(--pl-space-md); }
    .contact pl-input { flex: 1; }
    .actions { margin-top: var(--pl-space-xl); }
    h2 { font-size: 16px; font-weight: 600; }
    @media (max-width: 600px) { .fields { grid-template-columns: 1fr; } }
  `;
  static template = html`
    <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
    <div class="fields">
      <pl-input label="Фамилия" value="{{employee.lastname}}" required></pl-input>
      <pl-input label="Имя" value="{{employee.firstname}}" required></pl-input>
      <pl-input label="Отчество" value="{{employee.patronymic}}"></pl-input>
      <pl-datetime label="Дата рождения" value="{{employee.birthdate}}" required></pl-datetime>
      <pl-combobox label="Пол" data="[[genders]]" value="{{employee.gender}}" text-property="name" value-property="id" required></pl-combobox>
    </div>
    <section class="contacts">
      <h2>Контакты</h2>
      <template d:repeat="[[contacts]]" d:as="contact">
        <pl-flex-layout class="contact" align="flex-end">
          <pl-combobox label="Тип контакта" data="[[contactTypes]]" value="{{contact.contact_type}}" text-property="name" value-property="id" required></pl-combobox>
          <pl-input label="Контакт" value="{{contact.contact}}" required></pl-input>
          <pl-icon-button iconset="pl-default" icon="trashcan" title="Удалить контакт" on-click="[[deleteContact]]"></pl-icon-button>
        </pl-flex-layout>
      </template>
      <pl-button label="Добавить контакт" on-click="[[addContact]]"></pl-button>
    </section>
    <pl-flex-layout class="actions">
      <pl-button label="Сохранить" variant="primary" disabled="[[_saveDisabled(invalid, saving)]]" on-click="[[save]]"></pl-button>
      <pl-button label="Закрыть" on-click="[[close]]"></pl-button>
    </pl-flex-layout>
    <pl-action id="aGet" endpoint="/guide/employee/get"></pl-action>
    <pl-action id="aSave" executing="{{saving}}" endpoint="/guide/employee/save"></pl-action>
    <pl-dataset id="dsContacts" endpoint="/guide/employee/contacts"></pl-dataset>
    <pl-data-observer id="obEmployee" data="{{employee}}" is-changed="{{employeeChanged}}"></pl-data-observer>
    <pl-data-observer id="obContacts" data="{{contacts}}" is-changed="{{contactsChanged}}"></pl-data-observer>
  `;

  async onConnect() {
    if (this.employeeId) await this.reload();
    else this.snapshot();
  }
  snapshot() {
    this.$.obEmployee.snapshot();
    this.$.obContacts.snapshot();
  }
  async reload() {
    const args = { employeeId: this.employeeId };
    const [employee, contacts] = await Promise.all([
      this.$.aGet.execute(args), this.$.dsContacts.execute(args)
    ]);
    this.employee = employee;
    this.contacts = contacts;
    this.snapshot();
  }
  addContact() { this.push('contacts', { contact_type: 2, contact: '' }); }
  deleteContact(event) {
    this.splice('contacts', this.contacts.indexOf(event.model.contact), 1);
  }
  _saveDisabled(invalid, saving) { return invalid || saving; }
  async save() {
    const result = await this.$.aSave.execute({ employee: this.employee, contacts: this.contacts._mutations });
    this.employeeId = result.id;
    await this.reload();
    this.notify('Сотрудник и контакты сохранены');
  }
  onClose() {
    if (this.employeeChanged || this.contactsChanged) {
      return this.showConfirm('Закрыть карточку без сохранения изменений?');
    }
  }

}
