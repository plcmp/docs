import { PlElement, html } from 'polylib';
import '@nfjs/back-dbfw-ui-pl/components/pl-access.js';
import '@plcmp/pl-button';
import { companyStyles } from './company-styles.js';
import { createCompanySession, setDemoPermission } from './company-service.js';

class PlDocCompanyAccessDemo extends PlElement {
  static properties = {
    service: { value: createCompanySession }, access: { type: Object },
    loading: { value: false }, error: { value: '' }, result: { value: '' }
  };
  static css = companyStyles;
  static template = html`
    <pl-access id="access" endpoint="[[service.accessEndpoint]]" data="{{access}}" no-auto-execute></pl-access>
    <div class="toolbar">
      <pl-button label="Режим чтения" on-click="[[readOnly]]" disabled="[[loading]]"></pl-button>
      <pl-button label="Режим редактирования" on-click="[[editable]]" disabled="[[loading]]"></pl-button>
    </div>
    <output aria-live="polite">[[status(access, loading)]]</output>
    <pl-button label="Редактировать сотрудника" disabled="[[blocked(access, loading)]]" on-click="[[edit]]"></pl-button>
    <output>[[result]]</output>
    <output class="error" role="alert" hidden="[[!error]]">[[error]]</output>
    <details><summary>Ответ pl-access</summary><pre>[[json(access)]]</pre></details>
  `;
  readOnly() { return this.load(false); }
  editable() { return this.load(true); }
  async load(allowed) {
    this.loading = true;
    this.error = '';
    this.result = '';
    setDemoPermission(this.service, allowed);
    try { await this.$.access.execute(); }
    catch (error) { this.access = undefined; this.error = error.message; }
    finally { this.loading = false; }
  }
  blocked(access, loading) { return loading || access?.privs?.company?.employee?.upd !== true; }
  status(access, loading) {
    if (loading) return 'Проверяем доступ…';
    if (!access) return 'Права ещё не загружены';
    return access.privs.company.employee.upd ? 'Разрешено редактирование' : 'Разрешено только чтение';
  }
  json(access) { return access ? JSON.stringify(access, null, 2) : 'Выбери режим, чтобы выполнить запрос'; }
  edit() { this.result = 'Кнопка доступна. В форме этот обработчик открывает редактирование.'; }
}
customElements.define('pl-doc-company-access-demo', PlDocCompanyAccessDemo);
