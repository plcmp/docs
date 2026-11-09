# Изменение ширины колонок

Атрибут `resizable` позволяет тянуть правую границу заголовка колонки. `width` задаёт начальную ширину в пикселях, `min-width` ограничивает сжатие. Без `width` колонка занимает оставшееся пространство, пока пользователь не изменит её размер.

<div class="demo"><pl-doc-table-resizing></pl-doc-table-resizing></div>

Потяни границу «Сотрудник» вправо, затем влево: колонка не станет уже 160 px. У «Отдел» минимальная ширина — 120 px, у «Комментарий» — 240 px. Если колонки перестают помещаться, таблица прокручивается по горизонтали.

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../../demos/table/resizing.js ':include :type=code javascript')

</details>

Изменение ширины действует в текущем экземпляре таблицы. Компонент не сохраняет пользовательские размеры между открытиями страницы. Чтобы запретить изменение отдельной колонки, убери у неё `resizable`.

См. также [закрепление колонок](/components/table/fixed-columns) и [скрытие колонок](/components/table/column-visibility).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
