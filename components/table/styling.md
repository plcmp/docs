# Стилизация таблицы

`pl-table` создаёт строки, ячейки и заголовки в своём Shadow DOM. Стиль `pl-table { ... }` меняет сам элемент таблицы. Для её внутреннего содержимого предусмотрены CSS-переменные, части `::part` и шаблон `extra styles`.

## Где размещать стили

| Задача | Способ |
| --- | --- |
| Задать высоту и ширину таблицы | Селектор `pl-table` в `static css` родительского компонента. |
| Изменить используемый таблицей токен | CSS-переменная на `pl-table` или его родителе. |
| Оформить строку или ячейку целиком | `pl-table::part(row)` и `pl-table::part(cell)` во внешнем CSS. |
| Оформить отдельные строки или ячейки по данным | Свой токен через `getRowPartName` или `getCellPartName`, затем `::part(имя)`. |
| Оформить элементы собственного шаблона ячейки | Классы внутри `<template is="extra styles">`. |

## Размеры и CSS-переменные

Эти правила размещаются в `static css` компонента, который содержит таблицу:

```css
pl-table {
  width: 100%;
  height: 320px;
  --pl-table-header-white-space: normal;
  --employee-subtitle-color: #647078;
}
```

Высота ограничивает область таблицы. `--pl-table-header-white-space` разрешает переносы заголовков. `--employee-subtitle-color` — переменная самого примера; ниже её использует стиль подстроки. Переменные наследуются через границу Shadow DOM, обычные селекторы — нет.

## Публичные части row и cell

`row` обозначает стандартную строку, `cell` — ячейку данных. Например, внешний CSS может задать минимальную высоту строки и отступы ячеек:

```css
pl-table::part(row) {
  min-height: 48px;
}

pl-table::part(cell) {
  padding-inline: 12px;
}
```

Правило применяется к самой открытой части. Оно не даёт доступа к её произвольным потомкам: чтобы оформить имя или пояснение внутри ячейки, используй собственный класс и `extra styles`.

Для содержимого с переносами включи `variable-row-height`. Тогда виртуальная прокрутка учитывает фактическую высоту строк. Высота таблицы и высота её строк настраиваются независимо.

## Что делает extra styles

Обычное правило `.cell-title` из CSS родителя не достигает элемента внутри таблицы. Шаблон `extra styles` переносит блок `<style>` в Shadow DOM самой таблицы, где этот класс уже доступен.

Размести шаблон непосредственно внутри `pl-table` в `static template` своего Polylib-компонента. В шаблоне ячейки используй те же имена классов:

```html
<pl-table data="[[employees]]" variable-row-height>
  <template is="extra styles">
    <style>
      .cell-stack { display: grid; gap: 4px; padding-block: 4px; }
      .cell-title { font-weight: 600; line-height: 1.4; }
      .cell-subtitle {
        color: var(--employee-subtitle-color, #647078);
        font-size: 12px;
        line-height: 1.4;
      }
    </style>
  </template>

  <pl-table-column header="Сотрудник" field="name">
    <template>
      <div class="cell-stack">
        <span class="cell-title">[[row.name]]</span>
        <span class="cell-subtitle">[[row.department]]</span>
      </div>
    </template>
  </pl-table-column>
</pl-table>
```

Здесь `.cell-stack` располагает текст столбцом, `.cell-title` выделяет основное значение, а `.cell-subtitle` оформляет пояснение. Эти классы принадлежат примеру и не зависят от внутренней разметки компонента.

Таблица находит первый такой шаблон и копирует его содержимое при подключении. Собирай дополнительные правила в одном блоке. Для динамического изменения цвета или размера используй CSS-переменные: последующее изменение исходного `<template>` не обновляет уже скопированные стили.

`is="extra styles"` обрабатывается связкой Polylib и `pl-table`. Пример должен находиться в шаблоне Polylib-компонента. Обычный HTML `<template>` сам по себе стили не применяет.

## Собственные части по данным

Функция `getCellPartName(row, column)` возвращает дополнительные имена частей ячейки. В примере она возвращает `salary-cell` для колонки `salary`; остальные ячейки получают пустую строку. `getRowPartName(row)` работает так же для строки целиком.

Свою часть можно оформить из CSS родителя, без `extra styles`:

```css
pl-table::part(salary-cell) {
  background-color: var(--pl-primary-lightest);
}
```

<div class="demo"><pl-doc-table-styling></pl-doc-table-styling></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/styling.js ':include :type=code javascript')

</details>

В этом примере классы имени и отдела оформлены внутри `extra styles`, а фон оклада — снаружи через `::part(salary-cell)`.

## Граница вложенных компонентов

`extra styles` действует внутри Shadow DOM таблицы. Если ячейка содержит `pl-input`, собственный компонент или HTML-подсказку, их внутренний Shadow DOM остаётся отдельным. Оформляй такие компоненты через их CSS-переменные и открытые части.

Например, поверхность и HTML-содержимое подсказки оформляются на разных уровнях. Полный пример — [подсказки в ячейках](/components/table/tooltips).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a></footer>
