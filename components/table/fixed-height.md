# Таблица ограниченной высоты

При заданной CSS высоте содержимое таблицы прокручивается внутри её контейнера. Добавление записей не увеличивает высоту самой таблицы.

<div class="demo"><pl-doc-table-fixed-height></pl-doc-table-fixed-height></div>

[Код примера](../../demos/table/fixed-height.js ':include :type=code javascript')

Добавляй строки кнопкой и сравни внутреннюю прокрутку с [растущей таблицей](/components/table/growing), где родительский контейнер и таблица используют автоматическую высоту. Свойство `growing` само по себе высотой не управляет.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
