import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class CompanyEmployeeCard extends PlForm {
    static properties = { 
        formTitle: {
            type: String,
            value: 'Сотрудник'
        },
        urlParams: {
            type: Array,
            value: ['recordId']
        },
        employee: {
            type: Object,
            value: () => ({}),
        },
        recordId: {
            type: String,
            value: undefined
        },
        invalid: {
            value: false
        },
        
    }

    static css = css`
        :host { display: block; padding: var(--pl-space-lg); }
        .fields { display: grid; grid-template-columns: repeat(2, minmax(200px, 1fr)); gap: var(--pl-space-md); max-width: 820px; }
        .actions { margin-top: var(--pl-space-lg); }
        @media (max-width: 600px) { .fields { grid-template-columns: 1fr; } }
    `;

    static template = html`
        <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
        <pl-flex-layout scrollable vertical fit>
            <div class="fields"><pl-input label="Имя" value="{{employee.firstname}}" required></pl-input>
<pl-input label="Фамилия" value="{{employee.lastname}}" required></pl-input>
<pl-input label="Отчество" value="{{employee.patronymic}}"></pl-input>
<pl-input label="Пол" value="{{employee.gender}}" required></pl-input>
<pl-datetime label="Дата рождения" value="{{employee.birthdate}}" required></pl-datetime>
<pl-input label="Примечание" value="{{employee.note}}"></pl-input></div>
            <pl-flex-layout class="actions">
                <pl-button label="Сохранить" variant="primary" disabled="[[invalid]]" on-click="[[onSaveClick]]">
                    <pl-icon iconset="pl-default" size="16" icon="save" slot="prefix"></pl-icon>
                </pl-button>
                <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                    <pl-icon iconset="pl-default" size="16" icon="close" slot="prefix"></pl-icon>
                </pl-button>
            </pl-flex-layout>
        </pl-flex-layout>
        <pl-action id="aRead" args="[[_compose('recordId',recordId)]]" data="{{employee}}" endpoint="/guide/generated/employee/get" execute-on-args-change required-args='recordId'></pl-action>
        <pl-action id="aCreate" args="[[_compose('...', employee)]]" endpoint="/guide/employee/create"></pl-action>
        <pl-action id="aUpdate" args="[[_compose('...', employee)]]" endpoint="/guide/employee/update"></pl-action>
        
    `;

    async onSaveClick() {
        if (this.employee.id) {
            await this.$.aUpdate.execute();
        } else {
            const data = await this.$.aCreate.execute();
            this.recordId = data.id;
        }
        this.notify('Сохранение прошло успешно');
    }
}
