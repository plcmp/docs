# Коллекции через pl-dataset

`pl-dataset` загружает строки endpoint-а и хранит их в `ControlledArray` из `@plcmp/utils`. В шаблоне свойство `data` связывают двусторонне: компонент заменяет данные при загрузке и использует управляющий массив для сортировки, фильтров и частичной подгрузки.

## Загрузка списка

В Demo-company список сотрудников подключает dataset к коллекции формы и запускает его при подключении:

```js
static properties = {
  employees: { type: Array }
};

static template = html`
  <pl-grid data="{{employees}}">
    <pl-grid-column sortable field="fio" header="ФИО"></pl-grid-column>
  </pl-grid>
  <pl-dataset id="dsEmployees" data="{{employees}}"
    endpoint="/employee/list"></pl-dataset>
`;

onConnect() {
  this.$.dsEmployees.execute();
}
```

`employees` здесь принадлежит dataset. Не задавай ему `value: () => []`: при подключении dataset заменяет обычный массив на `ControlledArray`. До подключения `employees` может быть `undefined`, поэтому не обращайся к `.length` и другим полям без проверки. Для собственных массивов формы, которыми dataset не управляет, фабрика `() => []` по-прежнему подходит.

В примере backend `/employee/list` передаёт `control` в `dbapi.query` (`modules/demo-company/lib/employees.js`). Ответ содержит строки сотрудников, а frontend присваивает их dataset-коллекции.

## Аргументы, фильтры и сортировка

Для входных параметров используй `_compose` и `required-args`, если операция требует идентификатор:

```html
<pl-dataset id="dsContacts" data="{{contacts}}"
  endpoint="/employee/contactsList"
  args="[[_compose('employeeId', employeeId)]]"
  required-args="employeeId"></pl-dataset>
```

Так устроена загрузка контактов сотрудника: endpoint `/employee/contactsList` читает `context.body.args.employeeId`. Выбор сотрудника формирует аргумент для запроса, а повторный `execute()` обновляет коллекцию.

`pl-dataset` отправляет POST. Параметры backend-запроса включают `args`, `sqlPath` из содержимого компонента и `control`. В `control` входят `partialData`, `sorts`, `filters`, состояние диапазона и остальные настройки `ControlledArray`. Точное применение `control` зависит от endpoint-а и его реализации.

Изменение `data.sorts` через реактивное уведомление автоматически запускает запрос. На изменение `data.filters` такого observer в dataset нет: после применения фильтров запускай `execute()` явно. Backend должен поддерживать переданный формат `control`. Например, текущий `/employee/contactsList` в Demo-company использует только `employeeId` и не передаёт `control` в свой запрос.

## Обновление и управление результатом

Без опций `execute()` заменяет содержимое `data`. С `execute(args, { merge: true })` ответ добавляется в конец; этот режим также используется при загрузке следующего блока по placeholder. `cancel()` прерывает активный запрос через `AbortController`.

`returnOnly` возвращает `{ data, metaData }` и не записывает строки в dataset. Используй это, когда операция должна вернуть данные для отдельной обработки. При обычной загрузке метод возвращает сам `ControlledArray` после его обновления.

Атрибут `partial-data` включает загрузку диапазона и placeholder-механизм для больших коллекций. Dataset запрашивает начальный диапазон строк `0–99`; последующие диапазоны загружаются при запросе placeholder. Для этого endpoint должен понимать `control` и возвращать строки с `_rn`, по которым компонент определяет позиции строк и границы следующих блоков.

Ошибки запроса отклоняют Promise `execute()` и публикуют событие `toast` для оболочки. Обрабатывай ошибку на уровне формы, если нужен отдельный индикатор. После сохранения записи список можно перечитать вызовом `execute()`; при этом endpoint заново определяет набор строк и порядок. Если список содержит несохранённые правки, такое чтение их заменит.

Для чтения без замены текущей коллекции:

```js
const { data, metaData } = await this.$.dsContacts.execute(
  { employeeId: this.employeeId },
  { returnOnly: true }
);
```

`data` здесь — возвращённые строки, а `this.contacts` остаётся прежним. `metaData` присутствует только если её вернул endpoint.

Продолжение: [действия](/integration/actions), [вложенные изменения и mutation markers](/integration/nested-changes).

## Пример

Ниже показаны учебные сотрудники. Запросы обрабатывает локальный сервис примера; боевой backend не вызывается.

<div class="demo"><pl-doc-company-data-demo></pl-doc-company-data-demo></div>

[company-data.js](../demos/company-data.js ':include :type=code javascript')
