# Множественный выбор

Для выбора нескольких строк включи `multi-select`, свяжи `selected-list` и пометь одну колонку атрибутом `multi-select-column`.

<div class="demo"><pl-doc-table-multiselect></pl-doc-table-multiselect></div>

[Код примера](../../demos/table/multi-select.js ':include :type=code javascript')

Таблица добавляет выбранные записи в `selectedList` и удаляет их при повторном клике по флажку. Родительские и дочерние записи не связаны автоматически. Для внешнего состояния флажка используй `external-select` и `row._selected`.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
