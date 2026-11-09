import { PlElement, html } from 'polylib';
import '@plcmp/pl-table';
import { tableCss } from './shared.js';

class PlDocTableTree extends PlElement {
  static properties = {
    rows: { type: Array, value: () => [
      { id: 'office', parentId: null, name: 'Офис Demo-company', manager: 'Ирина Соколова', _opened: true },
      { id: 'sales', parentId: 'office', name: 'Продажи', manager: 'Анна Смирнова' },
      { id: 'east', parentId: 'sales', name: 'Восточный регион', manager: 'Алексей Морозов' },
      { id: 'west', parentId: 'sales', name: 'Западный регион', manager: 'Сергей Лебедев' },
      { id: 'support', parentId: 'office', name: 'Поддержка', manager: 'Михаил Орлов' },
      { id: 'engineering', parentId: null, name: 'Центр разработки', manager: 'Денис Ким' },
      { id: 'development', parentId: 'engineering', name: 'Разработка', manager: 'Павел Соколов' },
      { id: 'testing', parentId: 'engineering', name: 'Тестирование', manager: 'Мария Кузнецова' },
      { id: 'logistics', parentId: null, name: 'Логистический центр', manager: 'Олег Петров' },
      { id: 'warehouse', parentId: 'logistics', name: 'Склад', manager: 'Елена Волкова' },
      { id: 'delivery', parentId: 'logistics', name: 'Доставка', manager: 'Николай Захаров' }
    ] },
  };
  static css = tableCss;
  static template = html`
    <pl-table
      data="[[rows]]"
      tree
      key-field="id"
      pkey-field="parentId">
      <pl-table-column
        header="Подразделение"
        field="name"
        tree-column>
      </pl-table-column>
      <pl-table-column
        header="Руководитель"
        field="manager">
      </pl-table-column>
    </pl-table>
    `;
}
customElements.define('pl-doc-table-tree', PlDocTableTree);
