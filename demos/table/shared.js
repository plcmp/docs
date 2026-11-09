import { css } from 'polylib';

export const staffRows = () => [
  { id: 501, name: 'Анна Смирнова', department: 'Продажи', started: '2022-03-14', salary: 148000, bonus: 12000, note: 'Ведёт крупнейших клиентов региона.' },
  { id: 502, name: 'Михаил Орлов', department: 'Поддержка', started: '2021-11-02', salary: 112500, bonus: 8500, note: 'Координирует линию технической поддержки.' },
  { id: 503, name: 'Елена Волкова', department: 'Финансы', started: '2020-06-18', salary: 136000, bonus: 10000, note: 'Отвечает за планирование бюджета.' },
  { id: 504, name: 'Денис Ким', department: 'Разработка', started: '2023-02-06', salary: 162000, bonus: 15000, note: 'Разрабатывает внутренние сервисы компании.' },
  { id: 505, name: 'Мария Кузнецова', department: 'Персонал', started: '2022-09-12', salary: 118000, bonus: 9000, note: 'Организует подбор и адаптацию сотрудников.' },
  { id: 506, name: 'Олег Петров', department: 'Логистика', started: '2021-04-19', salary: 124000, bonus: 11000, note: 'Планирует поставки и работу склада.' }
];

export const tableStyles = `
  :host { display: grid; gap: var(--pl-space-md); min-width: 0; }
  pl-table { height: 260px; }
  /* Высота строки известна и до появления ячеек при инициализации колонок. */
  pl-table::part(row) { min-height: calc(var(--pl-base-size) + 1px); }
  output { font: var(--pl-text-font); }
`;

export const tableCss = css(tableStyles);
