# Коллекции: pl-dataset

`pl-dataset` загружает строки серверной операции и хранит их в `ControlledArray` из `@plcmp/utils`. В шаблоне свойство `data` связывают двусторонне: компонент заменяет данные при загрузке и использует управляющий массив для сортировки, фильтров и частичной подгрузки.

## Загрузка списка

Свяжи `pl-dataset` и `pl-table` с одной коллекцией формы. В примере используется операция списка сотрудников из Demo-company:

```js
static properties = {
  employees: { type: Array }
};

static template = html`
  <pl-table data="{{employees}}" style="height: 260px">
    <pl-table-column sortable field="fio" header="ФИО"></pl-table-column>
  </pl-table>
  <pl-dataset id="dsEmployees" data="{{employees}}"
    endpoint="/employee/list"></pl-dataset>
`;

onConnect() {
  this.$.dsEmployees.execute();
}
```

Коллекцией `employees` управляет `pl-dataset`. Не задавай ей `value: () => []`: при подключении компонент создаёт `ControlledArray`. До подключения `employees` может быть `undefined`, поэтому проверяй значение перед обращением к `.length` и другим полям. Для собственных массивов формы фабрика `() => []` по-прежнему подходит.

Маршрут `/employee/list` передаёт `control` в `dbapi.query`. Ответ содержит строки сотрудников, которыми `pl-dataset` заполняет коллекцию.

## Аргументы, фильтры и сортировка

Для входных параметров используй `_compose` и `required-args`, если операция требует идентификатор:

```html
<pl-dataset id="dsContacts" data="{{contacts}}"
  endpoint="/employee/contactsList"
  args="[[_compose('employeeId', employeeId)]]"
  required-args="employeeId"></pl-dataset>
```

Маршрут `/employee/contactsList` читает `context.body.args.employeeId`. Выбор сотрудника меняет аргументы запроса, а вызов `execute()` обновляет коллекцию.

`pl-dataset` отправляет POST с полями `args`, `sqlPath` из содержимого компонента и `control`. В `control` входят `partialData`, `sorts`, `filters`, состояние диапазона и остальные настройки `ControlledArray`. Серверная операция определяет, какие из этих настроек применить.

* **Сортировка.** Изменение `data.sorts` через реактивное уведомление автоматически запускает запрос.

* **Фильтрация.** Изменение `data.filters` само по себе запрос не запускает. После применения фильтров вызывай `execute()` явно.

* **Поддержка на сервере.** Маршрут должен учитывать переданный `control`. Например, `/employee/contactsList` в Demo-company использует только `employeeId` и не передаёт `control` в свой запрос.

## Обновление и управление результатом

Без опций `execute()` заменяет содержимое `data`. С `execute(args, { merge: true })` ответ добавляется в конец; этот режим также используется при загрузке следующего блока. `cancel()` прерывает активный запрос через `AbortController`.

Опция `returnOnly` возвращает `{ data, metaData }` без изменения связанной коллекции. Она подходит для отдельной обработки результата. При обычной загрузке метод возвращает обновлённый `ControlledArray`.

### Частичная загрузка

Атрибут `partial-data` включает загрузку больших коллекций по диапазонам. Сначала `pl-dataset` запрашивает строки `0–99`. На месте ещё не загруженного блока коллекция размещает специальный элемент — placeholder. Обращение к нему запускает загрузку следующего диапазона.

Серверный маршрут должен учитывать `control` и возвращать строки с `_rn`. По этому полю компонент определяет позиции строк и границы следующих блоков.

### Ошибки и повторное чтение

Ошибка запроса отклоняет Promise `execute()` и вызывает событие `toast` для оболочки. Обрабатывай ошибку на уровне формы, если нужен отдельный индикатор. После сохранения записи список можно перечитать вызовом `execute()`: сервер заново определит набор строк и порядок. Если в списке остались несохранённые правки, повторное чтение заменит их.

### Чтение без изменения коллекции

Для чтения без замены текущей коллекции:

```js
const { data, metaData } = await this.$.dsContacts.execute(
  { employeeId: this.employeeId },
  { returnOnly: true }
);
```

`data` здесь — возвращённые строки, а `this.contacts` остаётся прежним. `metaData` присутствует, только если сервер включил её в ответ.

## Загрузка списка и выбор сотрудника

Выбери сотрудника, чтобы загрузить его данные. Запросы обрабатывает сервис примера в памяти страницы; после перезагрузки данные возвращаются к исходным.

<div class="demo"><pl-doc-company-data-demo></pl-doc-company-data-demo></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/company-data.js ':include :type=code javascript')

</details>

См. также: [действия](/nfjs/actions), [вложенные изменения и журналы](/nfjs/nested-changes).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/front-pl/components/pl-dataset.js" target="_blank" rel="noopener">pl-dataset.js</a>
  <a href="https://github.com/nf-framework/demo/blob/master/modules/demo-company/lib/employees.js" target="_blank" rel="noopener">Demo-company: операции с сотрудниками</a>
</footer>
