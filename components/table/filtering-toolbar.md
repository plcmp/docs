# Фильтрация в верхней панели

Фильтры в слоте `top-toolbar` находятся над заголовком и строками таблицы. Их условия и применение к данным принадлежат компоненту-владельцу; `pl-table` получает уже отфильтрованный массив.

<div class="demo"><pl-doc-table-filtering-toolbar></pl-doc-table-filtering-toolbar></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/filtering-toolbar.js ':include :type=code javascript')

</details>

Поле ищет по имени и отделу, список ограничивает результат выбранным отделом. Условия можно сочетать. Кнопка «Сбросить фильтры» возвращает все шесть строк.

Для контролов в строке под заголовком колонки см. [фильтрацию в строке заголовка](/components/table/filtering). Расположение слотов описано в разделе [слоты таблицы](/components/table/slots).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
