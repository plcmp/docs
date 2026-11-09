# Одиночный выбор

В одиночном режиме `pl-table` связывает выбранную запись со свойством `selected`. Клик по строке обновляет значение.

<div class="demo"><pl-doc-table-selection></pl-doc-table-selection></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/selection.js ':include :type=code javascript')

</details>

Пустое начальное значение — `null`. Используй `selected="{{employee}}"`, если выбранная запись нужна родительской форме.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
