import { PlElement, html } from 'polylib';
import '@nfjs/front-pl/components/pl-dataset.js';
import '@nfjs/front-pl/components/pl-action.js';
import '@plcmp/pl-button';
import { companyStyles } from './company-styles.js';
import { createCompanySession, lastRequest } from './company-service.js';

class PlDocCompanyDataDemo extends PlElement {
  static properties = {
    service: { value: createCompanySession },
    employees: { type: Array },
    employee: { type: Object },
    loading: { value: false }, reading: { value: false },
    error: { value: '' }, request: { value: '' }
  };
  static css = companyStyles;
  static template = html`
    <pl-dataset id="list" endpoint="[[service.listEndpoint]]" data="{{employees}}" executing="{{loading}}"></pl-dataset>
    <pl-action id="get" endpoint="[[service.getEndpoint]]" required-args="employeeId" executing="{{reading}}"></pl-action>
    <div class="toolbar">
      <pl-button label="Загрузить сотрудников" on-click="[[load]]" disabled="[[loading]]"></pl-button>
      <span hidden="[[!loading]]" role="status">Загрузка…</span>
    </div>
    <template d:repeat="[[employees]]" d:as="row">
      <div class="row"><strong>[[row.fio]]</strong>
        <pl-button label="Открыть карточку" on-click="[[select]]" disabled="[[reading]]"></pl-button>
      </div>
    </template>
    <output hidden="[[!reading]]">Загружаем карточку…</output>
    <template d:if="[[employee]]">
      <section class="zone"><h3>Карточка сотрудника</h3>
        <p>Фамилия: <strong>[[employee.lastname]]</strong></p>
        <p>Имя: <strong>[[employee.firstname]]</strong></p>
      </section>
    </template>
    <output class="error" role="alert" hidden="[[!error]]">[[error]]</output>
    <details><summary>Последний запрос</summary><pre>[[request]]</pre></details>
  `;
  async load() {
    this.error = '';
    try { await this.$.list.execute(); }
    catch (error) { this.error = error.message; }
    this.request = JSON.stringify(lastRequest(this.service), null, 2);
  }
  async select(event) {
    this.error = '';
    try { this.employee = await this.$.get.execute({ employeeId: event.model.row.id }); }
    catch (error) { this.error = error.message; }
    this.request = JSON.stringify(lastRequest(this.service), null, 2);
  }
}
customElements.define('pl-doc-company-data-demo', PlDocCompanyDataDemo);
