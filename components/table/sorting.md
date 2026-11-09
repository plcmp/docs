# Сортировка

Атрибут `sortable` включает сортировку в заголовке. Каждый клик циклически меняет порядок: пусто, `asc`, `desc`, пусто. `pl-table` записывает состояние в `data.sorts`; собственный массив должен пересортировать владелец данных.

<div class="demo"><pl-doc-table-sorting></pl-doc-table-sorting></div>

[Код примера](../../demos/table/sorting.js ':include :type=code javascript')

В примере наблюдатель обрабатывает изменение `rows.sorts` и переставляет элементы обычного массива через `splice`. `pl-dataset` выполняет новый запрос при изменении сортировки. Обычный массив сам по себе не сортируется.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
