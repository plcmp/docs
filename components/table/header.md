# Многоуровневая шапка

Вложенные `pl-table-column` создают шапку из трёх уровней: верхняя группа «Сведения о сотруднике» содержит группы «Профиль» и «Работа», а «Вознаграждение» содержит группу «Начисления». На последнем уровне находятся колонки данных.

Текст заголовка задаётся свойством `header`. Для одной листовой колонки шаблон `<template is="header">` задаёт собственную разметку вместо `header`.

Названия групп выровнены по центру через `header-align="center"`. Имена и отделы читаются слева, даты — по центру, денежные значения — справа. Подробнее — [выравнивание заголовков и ячеек](/components/table/alignment).

<div class="demo"><pl-doc-table-header></pl-doc-table-header></div>

[Код примера](../../demos/table/header.js ':include :type=code javascript')

Все строки данных остаются обычными: группировка меняет только расположение заголовков. Подсказки и сортировка настраиваются отдельно. Для внешнего содержимого над таблицей см. [слоты](/components/table/slots).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a></footer>
