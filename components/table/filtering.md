# Фильтрация в строке заголовка

Условие фильтрации задаёт приложение. Шаблон `is="filter"` помещает контрол в строку фильтра под названием колонки; он не фильтрует `data` автоматически.

<div class="demo"><pl-doc-table-filtering></pl-doc-table-filtering></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/filtering.js ':include :type=code javascript')

</details>

В примере поле под заголовком «Отдел» меняет `query`, а метод `filtered(rows, query)` передаёт таблице подходящие строки. Исходный массив `rows` остаётся целым: очисти поле, чтобы снова увидеть всех сотрудников. При пустом результате приложение показывает «Совпадений нет».

Для поиска по нескольким полям и фильтра по отделу над таблицей см. [фильтрацию в верхней панели](/components/table/filtering-toolbar). При загрузке с сервера передавай условие источнику данных вместо фильтрации локального массива.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
