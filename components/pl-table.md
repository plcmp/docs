# pl-table

`pl-table` показывает массив объектов как виртуализированную таблицу. Колонки задаются вложенными [`pl-table-column`](/components/pl-table?id=pl-table-column). Для прикладного управления выбором, деревом, загрузкой, шаблонами и расположением колонок используй отдельные сценарии ниже.

Пакет: `@plcmp/pl-table`.

## Подключение

```js
import '@plcmp/pl-table';
```

## Минимальный пример

Для внутренней прокрутки задай высоту таблицы в CSS, например `pl-table { height: 260px; }`. Если высота должна зависеть от числа строк, используй [растущую таблицу](/components/table/growing).

```html
<pl-table data="[[employees]]" selected="{{selectedEmployee}}">
  <pl-table-column header="Сотрудник" field="name"></pl-table-column>
  <pl-table-column header="Отдел" field="department"></pl-table-column>
</pl-table>
```

<div class="demo"><pl-doc-table-basic></pl-doc-table-basic></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/table/basic.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `data` | `Array` | `[]` | Строки таблицы. Массив может содержать `sorts` с описанием текущего порядка. |
| `selected` | `Object` | `null` | Выбранная запись в одиночном режиме; `null` означает отсутствие выбора. |
| `multiSelect` | `Boolean` | `false` | Показывает флажок выбора в колонке `multi-select-column`. |
| `selectedList` | `Array` | `[]` | Массив выбранных строк в режиме `multi-select`. |
| `externalSelect` | `Boolean` | `false` | Берёт состояние флажка из `row._selected`; каскадную логику таблица не выполняет. |
| `tree` | `Boolean` | `undefined` | Включает иерархическое отображение плоского массива. |
| `treeColumn` | `Number` | `0` | Индекс колонки раскрытия дерева, если ни одна `pl-table-column` не помечена `tree-column`. |
| `keyField` | `String` | `undefined` | Поле идентификатора строки в режиме дерева. |
| `pkeyField` | `String` | `undefined` | Поле идентификатора родителя в режиме дерева. |
| `hasChildField` | `String` | `"_haschildren"` | Поле признака потомков в частично загружаемом дереве. |
| `multiSelectColumn` | `Number` | `0` | Индекс колонки с флажками выбора, если ни одна колонка не помечена `multi-select-column`. |
| `variableRowHeight` | `Boolean` | `false` | Разрешает виртуальной прокрутке строки переменной высоты. |
| `growing` | `Boolean` | `false` | Устанавливает `contain: none` на внутреннем контейнере. Само по себе не загружает строки и не меняет высоту таблицы. |
| `refreshing` | `Boolean` | `false` | Показывает состояние обновления на строках и скелетон, когда данных ещё нет. |
| `skeletonHeight` | `String` | `undefined` | CSS высота скелетона для режима `variable-row-height`. |
| `customRowTemplate` | `Object` | `undefined` | Объект `Template` строки для `pl-virtual-scroll`; см. [пользовательскую строку](/components/table/custom-row). |
| `getRowPartName` | `Function` | `() => {}` | Возвращает дополнительные токены `part` для строки. |
| `getCellPartName` | `Function` | `() => {}` | Возвращает дополнительные токены `part` для ячейки. |

## pl-table-column

Колонка задаёт заголовок, путь к данным и оформление ячеек. Она регистрируется вместе с `pl-table` и размещается внутри таблицы. Вложенные колонки объединяют заголовки в группы.


| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `header` | `String` | `undefined` | Текст заголовка. Шаблон `is="header"` выводится рядом с ним; для заголовка только из шаблона оставь `header` незаданным. |
| `field` | `String` | `undefined` | Путь к полю записи; поддерживается точечная запись, например `contact.email`. |
| `tooltipField` | `String` | `undefined` | Путь к данным подсказки. Пустой атрибут `tooltip-field` использует `field`. |
| `kind` | `String` | `undefined` | Встроенный тип форматирования `date` или `number`, либо зарегистрированный тип. |
| `format` | `String` | `undefined` | Формат даты, маска числа или параметр пользовательского форматтера. |
| `width` | `Number` | `undefined` | Ширина колонки в пикселях. |
| `minWidth` | `Number` | `50` | Минимальная ширина в пикселях. |
| `align` | `String` | `"left"` | Выравнивание ячеек: `left`, `center`, `right` или соответствующее flex значение. |
| `headerAlign` | `String` | `"left"` | Выравнивание текста заголовка. |
| `sortable` | `Boolean` | `undefined` | Показывает управление сортировкой в заголовке. |
| `sort` | `String` | `undefined` | Текущее значение сортировки: пустая строка, `asc` или `desc`. |
| `resizable` | `Boolean` | `undefined` | Показывает ручку изменения ширины. |
| `hidden` | `Boolean` | `undefined` | Скрывает колонку. |
| `fixed` | `Boolean` | `undefined` | Закрепляет колонку у левого края таблицы. |
| `action` | `Boolean` | `undefined` | Размещает колонку действий у правого края. |
| `treeColumn` | `Boolean` | `undefined` | Размещает управляющий значок дерева в этой колонке. |
| `multiSelectColumn` | `Boolean` | `undefined` | Размещает флажки множественного выбора в этой колонке. |


## Выбор и события

Клик по строке меняет `selected`.

| Метод | Описание |
| --- | --- |
| `beforeSelect(row)` | Метод подкласса `PlTable`, который вызывается перед выбором. Возврат `false` отменяет его; можно вернуть `Promise<boolean>`. |

| Событие | Данные | Описание |
| --- | --- | --- |
| `rowClick` | `event.detail.model` | Срабатывает после клика и обновления выбранной строки. |
| `rowDblclick` | `event.model.row`, `event.originalEvent` | Запись строки и исходное событие при двойном клике. |
| `rowContextMenu` | `event.model.row`, `event.originalEvent` | Запись строки при контекстном клике. Событие отменяемое; `preventDefault()` отменяет браузерное меню. |

## Поведение таблицы

* **[Сортировка](/components/table/sorting).** Кнопка сортировки в заголовке меняет `data.sorts`. Пересортировку массива или новый запрос к серверу выполняет владелец данных.

* **[Выбор строк в дереве](/components/table/multi-select).** `multiSelect` не связывает выбор родителя и потомков. Для каскадного выбора включи `externalSelect`, вычисляй `row._selected` и управляй им во внешнем компоненте.

* **[Фильтрация](/components/table/filtering).** `<template is="filter">` размещает контрол под названием колонки. Условие фильтрации и обновление данных задаёт приложение.

* **[Редактирование](/components/table/editing).** Отдельного API редактирования нет. Контрол в пользовательском шаблоне ячейки меняет поле строки через биндинг; сохранение и отмену изменений реализует приложение.

## Сценарии

* [Одиночный выбор](/components/table/selection) и [множественный выбор](/components/table/multi-select)
* [Фильтр в строке заголовка](/components/table/filtering) и [фильтр в верхней панели](/components/table/filtering-toolbar)
* [Сортировка](/components/table/sorting)
* [Типы и форматы](/components/table/formatting), [шаблон ячейки](/components/table/cell-templates) и [редактирование](/components/table/editing)
* [Дерево](/components/table/tree), [подсказки](/components/table/tooltips) и [закреплённые колонки](/components/table/fixed-columns)
* [Изменение ширины колонок](/components/table/resizing) и [скрытие колонок](/components/table/column-visibility)
* [Выравнивание заголовков и ячеек](/components/table/alignment)
* [Оформление таблицы](/components/table/styling)
* [Загрузка](/components/table/loading), [переменная высота](/components/table/variable-height), [пользовательская строка](/components/table/custom-row)
* [Заголовок](/components/table/header), [подвал](/components/table/footer) и [слоты таблицы](/components/table/slots)
* [Растущая таблица](/components/table/growing) и [таблица с ограниченной высотой](/components/table/fixed-height)

## Стилизация

Размеры таблицы задавай в CSS компонента-владельца. Стандартные строки и ячейки открыты через части `row` и `cell`:

```css
pl-table { height: 320px; width: 100%; }
pl-table::part(row) { min-height: 48px; }
pl-table::part(cell) { padding-inline: 12px; }
```

Для переносов содержимого включи `variable-row-height`. Стили собственных шаблонов ячеек размещай в `<template is="extra styles">`. Подробные примеры CSS-переменных, именованных частей и границ Shadow DOM — [оформление таблицы](/components/table/styling).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a>
</footer>
