# Загрузка и пустое состояние

Включи `refreshing`, чтобы обозначить обновление строк. При пустом наборе таблица показывает скелетон загрузки; для пустого состояния приложение должно вывести собственное сообщение.

<div class="demo"><pl-doc-table-loading></pl-doc-table-loading></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/loading.js ':include :type=code javascript')

</details>

При уже загруженных строках обновление помечает текущие строки как загружаемые. `skeleton-height` настраивает высоту скелетона в режиме переменной высоты.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
