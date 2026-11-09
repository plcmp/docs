# Шаблон ячейки

Шаблон без `is` заменяет текстовое содержимое ячейки. В контексте доступны `row` и `column`.

В примере у каждой ячейки два уровня: имя и отдел, дата приёма и описание работы, оклад и премия. Основное значение выделено полужирным, пояснение находится на следующей строке.

<div class="demo"><pl-doc-table-cell-template></pl-doc-table-cell-template></div>

[Код примера](../../demos/table/cell-templates.js ':include :type=code javascript')

`pl-flex-layout vertical` располагает текст столбцом. `variable-row-height` позволяет строке вместить подстроку и переносы длинного описания. Стили ячеек переданы через `<template is="extra styles">`: обычный CSS снаружи не проникает в Shadow DOM таблицы.

Пошаговый разбор способов стилизации — в разделе [оформление таблицы](/components/table/styling).

Таблица сохраняет сетку колонок, выбор строки и прокрутку. Для изменения всей строки используй [пользовательскую разметку строки](/components/table/custom-row), для редактируемых контролов — [редактирование](/components/table/editing).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a></footer>
