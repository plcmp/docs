# Действия через pl-action

`pl-action` выполняет HTTP-запрос к операции backend-модуля. Компонент не задаёт бизнес-контракт: backend определяет endpoint, форму аргументов и содержимое ответа. Успешный ответ NFJS ожидается в виде JSON с полем `data`; при наличии `error` действие выбрасывает ошибку.

## Вызов и результат

В `modules/demo-company/forms/level1/employee_list.js` список вызывает `/employee/delete` для выбранного сотрудника. Аргумент собирается helper-ом формы:

```html
<pl-action id="aDelete" endpoint="/employee/delete"
  args="[[_compose('id', selected.id)]]"></pl-action>
```

```js
await this.$.aDelete.execute();
await this.$.dsEmployees.execute();
```

Если передать аргументы в `execute`, они заменят привязанный `args` для этого вызова:

```js
const result = await this.$.aSave.execute({
  employee: this.employee,
  contacts: this.contacts._mutations
});
this.employeeId = result.id;
```

Так сохраняет карточка сотрудника в `modules/demo-company/forms/level3/employee/main.js`. Backend `/employee/save` возвращает `{ data: { id } }`, поэтому `execute()` разрешается объектом `{ id }` и записывает его также в свойство `data` (`modules/demo-company/lib/employees.js`). После успешного изменения экран обновляет модель или явно перезагружает нужный dataset согласно контракту операции.

Действия по умолчанию отправляют POST с JSON-телом `{ args: ... }`. Если `endpoint` не задан, компонент строит адрес FSE из имени родительской формы и `id` действия. Для внешнего endpoint адрес задаётся явно.

## Аргументы и `_compose`

`_compose` доступен в `PlForm`. Он принимает описание путей через `;`, затем значения в том же порядке. Точки создают вложенные объекты:

```html
<pl-action id="readEmployee" endpoint="/employee/get"
  args="[[_compose('employeeId', employeeId)]]"
  required-args="employeeId"></pl-action>
```

Для нескольких полей можно написать `_compose('search;status', search, status)`, для вложенного — `_compose('filter.status', status)`. Не создавай метод формы только ради сборки простого объекта аргументов.

`required-args` — список верхнеуровневых ключей через `;`. Перед запросом компонент проверяет, что значения существуют и не равны `null`. Это проверка наличия параметров; бизнес-правила и разрешение записи остаются за backend.

## Автозапуск, GET и ошибки

С `execute-on-args-change` изменение свойства `args` запускает действие автоматически. Без этого атрибута изменение аргументов само по себе запрос не отправляет. Автоматический запуск с отсутствующим обязательным аргументом тихо прекращается; при прямом `execute()` пропуск обязательного аргумента приводит к ошибке.

Для `method="GET"` компонент формирует query string через `URLSearchParams(args)`. Передавай параметры явно в `execute({ employeeId: this.employeeId })`: в текущей реализации GET использует аргумент метода, а не привязанное свойство `args`. Значения должны быть плоскими параметрами: вложенный объект не кодируется как JSON. `paths` при GET не формирует массив изменённых строк, потому что преобразованные аргументы используются в теле POST.

При сетевой ошибке или поле `error` в JSON компонент публикует событие `toast` для оболочки приложения и отклоняет Promise. Оборачивай вызов в `try/catch`, если экран должен показать собственное состояние ошибки:

```js
async saveEmployee() {
  try {
    return await this.$.aSave.execute({ employee: this.employee });
  } catch (error) {
    this.saveError = error.message;
    return undefined;
  }
}
```

## Частичные изменения вложенных данных

`paths` задаёт пути через точки в аргументе, для которых `pl-action` сериализует журналы изменений вместо полного массива. Точный формат путей, `$action` и ограничения частичного снимка разобраны в [изменениях вложенных данных](/integration/nested-changes). Параметр не выбирает произвольный набор полей DTO.

В Demo-company контакты сохраняются отдельной частью payload: форма передаёт `contacts._mutations`, а backend обрабатывает `add`, `upd` и `del` в одной операции вместе с сотрудником (`modules/demo-company/lib/employees.js`). Это пример контракта приложения, а не автоматическое поведение каждого `pl-action`.

## Пример

Ниже показаны учебные сотрудники. Запросы обрабатывает локальный сервис примера; боевой backend не вызывается.

<div class="demo"><pl-doc-company-data-demo></pl-doc-company-data-demo></div>

[company-data.js](../demos/company-data.js ':include :type=code javascript')

Продолжение: [REST-обработчик Demo-company](/integration/rest), [вложенные операции serverEndpoints](/integration/server-endpoints), [dataset и чтение коллекций](/integration/datasets).
