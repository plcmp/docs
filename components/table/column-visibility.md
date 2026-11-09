# Скрытие колонок

Свойство `hidden` у `pl-table-column` скрывает заголовок и ячейки колонки. Данные остаются в строках: при повторном показе колонка выводит те же значения.

<div class="demo"><pl-doc-table-column-visibility></pl-doc-table-column-visibility></div>

Сними флажок «Отдел» или «Дата приёма», затем включи «Комментарий» — эта колонка изначально скрыта. Кнопка «Показать все» восстанавливает все колонки. «Сотрудник» остаётся видимым при любом выборе.

[Код примера](../../demos/table/column-visibility.js ':include :type=code javascript')

Флажки меняют свойства родительского элемента через `{{...}}`, а колонки получают обратное значение через `[[!showDepartment]]`. Менять DOM или заново создавать таблицу для этого не нужно.

У группового заголовка `hidden` скрывает и вложенные колонки. Пример структуры таких заголовков — в разделе [заголовки](/components/table/header).

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table-column.js" target="_blank" rel="noopener">pl-table-column.js</a></footer>
