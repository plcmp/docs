# Запросы и команды: pl-action

`pl-action` выполняет HTTP-запрос к серверной операции. Сервер определяет адрес, аргументы и содержимое ответа. Успешный ответ NFJS ожидается в виде JSON с полем `data`; при наличии `error` действие выбрасывает ошибку.

## Вызов и результат

В списке Demo-company действие `/employee/delete` удаляет выбранного сотрудника. Метод формы `_compose` собирает аргументы:

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

Так сохраняется карточка сотрудника в Demo-company. Маршрут `/employee/save` возвращает `{ data: { id } }`, поэтому `execute()` возвращает объект `{ id }` и записывает его в свойство `data`. После успеха форма применяет ответ к модели или повторно загружает нужную коллекцию, если операция не возвращает полные данные.

По умолчанию действие отправляет POST с JSON-телом `{ args: ... }`. Если `endpoint` не задан, компонент строит адрес [серверной операции формы](/nfjs/server-endpoints) из имени формы и `id` действия. Для другого маршрута задай `endpoint` явно.

## Аргументы и `_compose`

`_compose` доступен в `PlForm`. Он принимает описание путей через `;`, затем значения в том же порядке. Точки создают вложенные объекты:

```html
<pl-action id="readEmployee" endpoint="/employee/get"
  args="[[_compose('employeeId', employeeId)]]"
  required-args="employeeId"></pl-action>
```

Для нескольких полей можно написать `_compose('search;status', search, status)`, для вложенного — `_compose('filter.status', status)`. Не создавай метод формы только ради сборки простого объекта аргументов.

`required-args` — список верхнеуровневых ключей через `;`. Перед запросом компонент проверяет, что значения существуют и не равны `null`. Это проверка наличия параметров; бизнес-правила и разрешение записи остаются за сервером.

## Автозапуск, GET и ошибки

С `execute-on-args-change` изменение свойства `args` запускает действие автоматически. Без этого атрибута изменение аргументов само по себе запрос не отправляет. Автоматический запуск с отсутствующим обязательным аргументом тихо прекращается; при прямом `execute()` пропуск обязательного аргумента приводит к ошибке.

Для `method="GET"` компонент формирует параметры адреса через `URLSearchParams(args)`. Передавай их явно в `execute({ employeeId: this.employeeId })`: GET использует аргумент метода, а не связанное свойство `args`.

Вложенные объекты не кодируются как JSON. `paths` при GET тоже не применяется: преобразованные журналы используются только в теле POST. Для таких данных используй POST.

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

`paths` задаёт пути через точки в аргументе, для которых `pl-action` сериализует журналы изменений вместо полного массива. Точный формат путей, `$action` и ограничения частичного снимка разобраны в [изменениях вложенных данных](/nfjs/nested-changes). Параметр не выбирает произвольный набор полей DTO.

В Demo-company форма передаёт контакты как `contacts._mutations`, а сервер обрабатывает `add`, `upd` и `del` в одной операции вместе с сотрудником. Такой формат определяет контракт `/employee/save`; сам `pl-action` не выбирает его автоматически.

## Загрузка и выбор сотрудника

Выбери сотрудника, чтобы загрузить его данные. Запросы обрабатывает сервис примера в памяти страницы; после перезагрузки данные возвращаются к исходным.

<div class="demo"><pl-doc-company-data-demo></pl-doc-company-data-demo></div>

[Код примера](../demos/company-data.js ':include :type=code javascript')

См. также: [REST-обработчик Demo-company](/nfjs/rest), [вложенные операции serverEndpoints](/nfjs/server-endpoints), [чтение коллекций](/nfjs/datasets).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/front-pl/components/pl-action.js" target="_blank" rel="noopener">pl-action.js</a>
  <a href="https://github.com/nf-framework/demo/blob/master/modules/demo-company/lib/employees.js" target="_blank" rel="noopener">Demo-company: операции с сотрудниками</a>
</footer>
