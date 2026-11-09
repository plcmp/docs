# Слоты таблицы

`pl-table` предоставляет верхний и нижний слоты вне прокручиваемых строк. В примере каждый слот содержит `pl-flex-layout`: он объединяет подписи и кнопки в панель и переносит элементы при нехватке места.

| Слот | Описание |
| --- | --- |
| `top-toolbar` | Заголовок таблицы и действия над строками. |
| `bottom-toolbar` | Счётчик, состояние выбора и восстановление списка. |

<div class="demo"><pl-doc-table-slots></pl-doc-table-slots></div>

[Код примера](../../demos/table/slots.js ':include :type=code javascript')

Верхняя панель показывает «Сотрудники», добавляет запись или удаляет выбранную. Нижняя показывает число строк и выбранного сотрудника; кнопка восстанавливает исходный список. Выбери строку кликом, чтобы включить удаление.

Слоты управляют расположением панели. Для содержимого заголовков и ячеек используй шаблоны [`header`](/components/table/header), [`filter`](/components/table/filtering) и [`footer`](/components/table/footer): таблица строит собственные заголовки, поэтому DOM-слоты внутри `pl-table-column` туда не переносятся.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a></footer>
