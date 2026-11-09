# Редактирование ячеек

У таблицы нет отдельного API редактирования. Помести контрол в пользовательский шаблон и свяжи значение с полем строки.

<div class="demo"><pl-doc-table-editing></pl-doc-table-editing></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/editing.js ':include :type=code javascript')

</details>

В демо `pl-input` использует двустороннюю связь `{{row.name}}`, а таблица получает массив через `data="{{rows}}"`. Сохранение на сервере, проверки и отмену изменений задаёт приложение.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a></footer>
