# Форматирование значений

Колонка `pl-table-column` форматирует типы `date` и `number`. Также можно зарегистрировать пользовательский `kind`.

<div class="demo"><pl-doc-table-formatting></pl-doc-table-formatting></div>

[Код примера](../../demos/table/formatting.js ':include :type=code javascript')

`date` использует Day.js; по умолчанию формат — `DD.MM.YYYY`. `number` форматирует в локали `ru-RU`; маска использует `0` для обязательного и `#` для необязательного десятичного знака.

Форматтер принимает `(value, { row, field, format })`. Регистрация `PlTable.registerKind(name, formatter)` выполняется один раз; повтор имени вызывает ошибку, если третий аргумент не `true`.

<footer class="docs-sources"><span>Исходники:</span> <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-table/pl-table.js" target="_blank" rel="noopener">pl-table.js</a></footer>
