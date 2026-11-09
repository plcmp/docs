# Растущая таблица

Включи `growing` и задай таблице `height: auto`. При добавлении строк таблица занимает больше места, а прокручивается сама страница. Внешний контейнер тоже не должен ограничивать её высоту.

<div class="demo"><pl-doc-table-growing></pl-doc-table-growing></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/growing.js ':include :type=code javascript')

</details>

Добавь несколько строк: нижняя граница таблицы сдвинется, а высота каждой строки останется прежней. Сравни с [таблицей фиксированной высоты](/components/table/fixed-height), где новые строки появляются внутри области прокрутки.

```html
<pl-table data="[[rows]]" growing>
  <pl-table-column header="Сотрудник" field="name"></pl-table-column>
  <pl-table-column header="Отдел" field="department"></pl-table-column>
</pl-table>
```

```css
pl-table { height: auto; }
```

`growing` меняет поведение раскладки, но не загружает данные. В примере строки добавляются через `push`; при работе с сервером коллекцию обновляет источник данных.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
