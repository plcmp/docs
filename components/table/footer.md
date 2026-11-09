# Итоги в таблице

`<template is="footer">` внутри колонки заполняет итоговую ячейку именно под этой колонкой. Таблица показывает нижнюю строку, если шаблон есть хотя бы в одной колонке; значения и агрегаты рассчитывает владелец данных.

<div class="demo"><pl-doc-table-footer></pl-doc-table-footer></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/footer.js ':include :type=code javascript')

</details>

Под именами показано количество сотрудников, под часами — общее отработанное время, под окладами и премиями — их суммы. Последняя колонка суммирует всё начисленное. Итоги стоят непосредственно под своими полями. `bottom-toolbar` служит для общей панели под таблицей; он не выравнивает итоги по колонкам. См. [пример нижней панели](/components/table/slots).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
