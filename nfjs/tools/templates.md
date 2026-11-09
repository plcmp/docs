# Шаблоны форм

Файл `.tmplt` — это шаблон JavaScript-класса формы с параметрами Handlebars. Генератор `@nfjs/dev` находит такие файлы в активных NFJS-модулях, передаёт шаблону настройки карточки или списка и показывает результат как JavaScript. Шаблон задаёт разметку, биндинги и привязку операций; серверные маршруты и ограничения базы данных остаются отдельными контрактами.

## Параметры и вставка разметки

Настройки шаблона зависят от типа формы. Карточка получает `formClass`, `formTitle`, `recordProperty`, `inputs`, `formProperties`, `dataSources` и адреса `endpointRead`, `endpointCreate`, `endpointUpdate`. Список получает настройки колонок, фильтров, dataset и карточки. Полный набор полей задают формы генератора `recordCard` и `recordList`.

`{{{inputs}}}` вставляет сформированную генератором разметку полей без HTML-экранирования. `{{{recordProperty}}}` подставляет имя свойства записи в объявления свойства и выражения биндингов. `recordBinding` — уже собранная строка биндинга, например `{{employee}}`; шаблон вставляет её как значение через `{{{recordBinding}}}`. Повторно экранировать её обратным слешем не нужно.

Чтобы оставить биндинг Polylib в итоговом JavaScript, экранируй открывающие скобки в исходном `.tmplt`: `\{{invalid}}` превращается в `{{invalid}}`. Иначе Handlebars попытается разобрать выражение как параметр шаблона. Обычные подстановки, например `{{{inputs}}}`, экранировать не нужно.

## Два варианта карточки

Доступны два полных шаблона карточки сотрудника. REST-вариант передаёт `endpointRead`, `endpointCreate` и `endpointUpdate` в `pl-action`. Вариант с `serverEndpoints` описывает чтение через query и запись через broker в самом классе формы. Оба варианта используют одинаковые поля карточки и один формат аргументов записи; выбери адреса и операции, которые существуют в приложении.

Вариант `serverEndpoints` использует `recordId` при чтении, выбирает запись из `v4`-представления, а создание и обновление направляет в broker-контракты. При подключении к другой сущности замени schema, имя представления чтения и broker-команды на реальные для этой сущности. Блок `serverEndpoints` не создаёт соответствующие функции, таблицы или write-контракты.

<details class="docs-code">
<summary>Полный REST-шаблон карточки</summary>

[employee-card-rest.tmplt](../../examples/nfjs/modules/demo-company-guide/templates/employee-card-rest.tmplt ':include :type=code javascript')

</details>

<details class="docs-code">
<summary>Полный шаблон карточки с serverEndpoints</summary>

[employee-card-endpoints.tmplt](../../examples/nfjs/modules/demo-company-guide/templates/employee-card-endpoints.tmplt ':include :type=code javascript')

</details>

## Размещение и проверка шаблона

Положи `.tmplt` в активный NFJS-модуль. Генератор ищет файлы этого расширения среди включённых модулей, затем показывает найденный шаблон в настройках карточки или списка. После выбора проверь настройки и сгенерированный JavaScript до сохранения.

При адаптации шаблона проверь, что:

* Все Handlebars-параметры входят в настройки выбранного типа формы.
* Значения, которые должны остаться биндингами Polylib в итоговом файле, экранированы как `\{{...}}`.
* Для REST-формы указаны доступные endpoints с ожидаемой формой `args` и `data`.
* Для формы с `serverEndpoints` используются действующие query и broker-контракты.
* Сгенерированный JavaScript открывается как модуль формы, а поля, чтение, создание и изменение проверены в приложении.

Если введён непустой текст в поле «Шаблон», при генерации используется этот текст, даже если выбран `templatePath`. После выбора другого пути нажми «Показать», чтобы загрузить содержимое выбранного файла в поле «Шаблон»; затем проверь результат генерации.

Генератор сохраняет результат в каталоге `forms` активного модуля и использует имя `card.js` для карточки либо `list.js` для списка. Сохранение перезаписывает файл по совпадающему пути.

Справочник полей и путей генератора: [генератор форм](./generators).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-dev/blob/main/src/generateFormByTemplate/index.js" target="_blank" rel="noopener">Поиск шаблонов и генерация JavaScript</a>
  <a href="https://github.com/nf-framework/nf-dev/blob/main/src/generateFormByTemplate/form-card.js" target="_blank" rel="noopener">Параметры карточки</a>
  <a href="https://github.com/nf-framework/nf-dev/blob/main/src/generateFormByTemplate/form-card.tmplt" target="_blank" rel="noopener">Базовый шаблон карточки</a>
  <a href="https://github.com/nf-framework/nf-front-pl/blob/main/components/pl-action.js" target="_blank" rel="noopener">Действия pl-action</a>
</footer>
