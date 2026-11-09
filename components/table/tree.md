# Дерево

Дерево строится из плоского массива. Укажи `tree`, поле ключа записи через `key-field`, ключ родителя через `pkey-field` и колонку с атрибутом `tree-column`.

В примере три корня: офис, центр разработки и логистический центр. Офис раскрыт сразу. Раскрой другие корни и ветку «Продажи», чтобы увидеть вложенные подразделения.

<div class="demo"><pl-doc-table-tree></pl-doc-table-tree></div>

[Код примера](../../demos/table/tree.js ':include :type=code javascript')

Корневая запись имеет `parentId: null`. Узел раскрывается, если его идентификатор указан как `parentId` у другой записи. Для частично загруженного дерева настрой `has-child-field`; `pl-data-tree` строит видимую иерархию.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-data-tree/pl-data-tree.js" target="_blank" rel="noopener">pl-data-tree.js</a></footer>
