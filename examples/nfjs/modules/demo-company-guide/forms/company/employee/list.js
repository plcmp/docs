import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class CompanyEmployeeList extends PlForm {
    static properties = {
        formTitle: {
            type: String,
            value: 'Сотрудники'
        },
        data: { type: Array, value: () => [] },
        deleteId: {}
    }

    static css = css`
        pl-table { flex: 1; min-height: 260px; }
        pl-table::part(row) { min-height: calc(var(--pl-base-size) + 1px); }
    `;

    static template = html`
        <pl-flex-layout scrollable vertical fit>
            <pl-flex-layout align="flex-end">
                <pl-filter-container data="{{data}}" id="fltr">
                    <pl-filter-item field="lastname" operator="like_both"><pl-input label="Фамилия"></pl-input></pl-filter-item>
                </pl-filter-container>
                <pl-button variant="ghost" label="Найти" on-click="[[onSearchClick]]">
                    <pl-icon iconset="pl-default" size="16" icon="search" slot="prefix"></pl-icon>
                </pl-button>
                <pl-button variant="link" label="Сбросить" on-click="[[onClearClick]]">
                    <pl-icon iconset="pl-default" size="16" icon="close" slot="prefix"></pl-icon>
                </pl-button>
                <pl-button variant="primary" label="Добавить" on-click="[[onAddClick]]">
                    <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                </pl-button>
            </pl-flex-layout>
            <pl-table data="{{data}}" on-row-dblclick="[[onEditClick]]">
                <pl-table-column field="firstname" header="Имя" sortable resizable></pl-table-column>
<pl-table-column field="lastname" header="Фамилия" sortable resizable></pl-table-column>
<pl-table-column field="birthdate" header="Дата рождения" kind="date" sortable resizable></pl-table-column>
                <pl-table-column width="90" action>
                    <template>
                        <pl-flex-layout>
                            <pl-icon-button variant="link" iconset="pl-default" size="16" icon="pencil"
                                on-click="[[onEditClick]]"></pl-icon-button>
                            <pl-icon-button variant="link" iconset="pl-default" size="16" icon="trashcan"
                                on-click="[[onDeleteClick]]"></pl-icon-button>
                        </pl-flex-layout>
                    </template>
                </pl-table-column>
            </pl-table>
            <pl-dataset id="dsList" data="{{data}}" endpoint="/guide/employee/list" partial-data></pl-dataset>
            <pl-action args="[[_compose('id', deleteId)]]" id="aDelete" endpoint="/guide/employee/delete"></pl-action>
        </pl-flex-layout>
    `;

    onConnect() {
        this.$.dsList.execute();
    }
    onSearchClick() {
        this.$.fltr.applyFilters();
        this.$.dsList.execute();
    }
    onClearClick() {
        this.$.fltr.clearFilters();
        this.$.dsList.execute();
    }
    async onAddClick() {
        await this.open('company.employee.card');
        this.$.dsList.execute();
    }
    async onEditClick(event) {
        await this.open('company.employee.card', {
            recordId: event.model.row.id
        });
        this.$.dsList.execute();
    }
    async onDeleteClick(event) {
        this.deleteId = event.model.row.id;
        if (await this.showConfirm('Вы уверены что хотите удалить запись?', {
            buttons: [{
                label: 'Нет',
                variant: 'secondary',
                action: false,
            },
            {
                label: 'Удалить',
                variant: 'primary',
                negative: true,
                action: true
            }]
        })) {
            await this.$.aDelete.execute();
            this.$.dsList.execute();
        }
    }
}
