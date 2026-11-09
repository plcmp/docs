# Закрепление колонок

`fixed` закрепляет колонку у левого края таблицы, `action` ставит её у правого края. Прокрути таблицу по горизонтали: ID и иконки действий останутся на месте. Нажатие на значок показывает, для какой записи вызвано действие.

<div class="demo"><pl-doc-table-fixed-columns></pl-doc-table-fixed-columns></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/fixed-columns.js ':include :type=code javascript')

</details>

Ширина задаётся в пикселях через `width`, минимальная ширина — через `min-width`. Зафиксированные колонки продолжают занимать место в горизонтальной раскладке.

Изменение ширины перетаскиванием показано в [отдельном примере](/components/table/resizing).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
