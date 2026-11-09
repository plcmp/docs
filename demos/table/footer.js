import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-table';
import { staffRows, tableStyles } from './shared.js';

const staffHours = [160, 152, 160, 168, 144, 160];

class PlDocTableFooter extends PlElement {
  static properties = {
    rows: {
      type: Array,
      value: () => staffRows().map((row, index) => ({
        ...row,
        hours: staffHours[index],
        accrued: row.salary + row.bonus
      }))
    },
  };
  static css = css(`${tableStyles} pl-table { height: auto; }`);
  static template = html`
    <pl-table data="[[rows]]" growing>
      <template is="extra styles">
        <style>
          .footerEl { border-inline-end: 1px solid var(--pl-grey-light); }
          .footerEl:last-child { border-inline-end: 0; }
        </style>
      </template>
      <pl-table-column header="Сотрудник" field="name" min-width="180">
        <template is="footer">Сотрудников: [[rows.length]]</template>
      </pl-table-column>
      <pl-table-column header="Часы" field="hours" kind="number" format="0" min-width="100" align="right" header-align="right">
        <template is="footer">[[totalHours(rows)]] ч</template>
      </pl-table-column>
      <pl-table-column header="Оклад" field="salary" kind="number" format="0" min-width="140" align="right" header-align="right">
        <template is="footer">[[totalSalary(rows)]] ₽</template>
      </pl-table-column>
      <pl-table-column header="Премия" field="bonus" kind="number" format="0" min-width="140" align="right" header-align="right">
        <template is="footer">[[totalBonus(rows)]] ₽</template>
      </pl-table-column>
      <pl-table-column header="Всего начислено" field="accrued" kind="number" format="0" min-width="180" align="right" header-align="right">
        <template is="footer">[[totalAccrued(rows)]] ₽</template>
      </pl-table-column>
    </pl-table>
  `;

  sum(rows, field) {
    return new Intl.NumberFormat('ru-RU').format(rows.reduce((total, row) => total + row[field], 0));
  }

  totalHours(rows) { return this.sum(rows, 'hours'); }
  totalSalary(rows) { return this.sum(rows, 'salary'); }
  totalBonus(rows) { return this.sum(rows, 'bonus'); }
  totalAccrued(rows) { return this.sum(rows, 'accrued'); }
}
customElements.define('pl-doc-table-footer', PlDocTableFooter);
