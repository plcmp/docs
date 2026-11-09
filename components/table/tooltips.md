# Подсказки в ячейках

`tooltip-field` показывает содержимое поля колонки или путь к другому полю строки. Для карточки с HTML используй `<template is="tooltip">`: в его контексте доступна текущая `row`.

<div class="demo"><pl-doc-table-tooltips></pl-doc-table-tooltips></div>

[Код примера](../../demos/table/tooltips.js ':include :type=code javascript')

В примере имя сотрудника открывает карточку с инициалами, отделом, датой и заметкой. Рядом `tooltip-field="note"` показывает ту же заметку как короткую текстовую подсказку. Инициалы собраны из имени сотрудника.

Стили содержимого находятся внутри самого `<template is="tooltip">`: карточка создаётся в Shadow DOM подсказки. Стили из `extra styles` таблицы эту границу не пересекают.

Внешняя поверхность доступна через `::part(outerBox)`. Этот блок размещён в `extra styles` таблицы, где находится сам `pl-tooltip`:

```css
pl-tooltip::part(outerBox) {
  padding: var(--pl-space-md);
  color: var(--pl-text-color);
  background: var(--pl-background-color);
  border: 1px solid var(--pl-grey-light);
  border-radius: var(--pl-border-radius);
}
```

`keep-hover` позволяет перевести указатель с ячейки на HTML-карточку. Подробнее о границах CSS — [оформление таблицы](/components/table/styling).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a></footer>
