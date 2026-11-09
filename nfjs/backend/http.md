# HTTP-маршруты и контекст

`@nfjs/back` экспортирует `web` — сервер, на котором модули регистрируют маршруты и middleware. Обработчик получает один `context` на запрос. Через него читаются аргументы, используется сессия и отправляется ответ.

HTTP-обработчик связывает внешний контракт с прикладной операцией. Запросы к базе и запись выполняются через [dbapi](/nfjs/backend/database); общую бизнес-операцию можно вынести в отдельную функцию, принимающую контекст и аргументы.

## Регистрация маршрута

```js
import { web } from '@nfjs/back';
import { listEmployees } from './lib/employees.js';

async function init() {
  web.on('POST', '/employee/list',
    { middleware: ['session', 'auth', 'json'] }, listEmployees);
}

export { init };
```

| Аргумент | Назначение |
| --- | --- |
| `method` | HTTP-метод, например `GET` или `POST` |
| `path` | Адрес операции. Параметр маршрута записывается как `:id` |
| `options.middleware` | Middleware в порядке выполнения |
| `handler` | Функция `(context) => ...`; может быть `async` |

Регистрацию выполняют в `init()`. К этому моменту должны быть инициализированы модули, предоставляющие используемые middleware. Зависимости задаются в `meta.require.after`.

## Порядок middleware

| Middleware | Что подготавливает |
| --- | --- |
| `session` | Загружает сессию и создаёт `context.session` |
| `auth` | Проверяет аутентификацию запроса; требует предварительно подготовленную сессию |
| `json` | Разбирает JSON-тело; результат доступен как `context.body` |
| `query` | Разбирает параметры строки запроса; результат доступен как `context.query` |
| `files` | Разбирает загрузку файлов; используется маршрутами, которым нужен multipart-запрос |

`auth` подтверждает вход в приложение. Право выполнить конкретное изменение проверяет контракт записи внутри `broker`. Для чтения применяются ограничения соответствующего read-контракта.

## Поля и методы context

| Поле или метод | Назначение |
| --- | --- |
| `context.body` | Разобранное тело запроса после `json` |
| `context.params` | Параметры маршрута, например `context.params.id` для `/employee/:id` |
| `context.query` | Параметры URL после `query` |
| `context.req` | Исходный HTTP-запрос; нужен при работе с заголовками и потоками |
| `context.session` | `SessionAPI` текущего запроса |
| `context.code(status)` | Устанавливает HTTP-статус ответа |
| `context.headers(values)` | Устанавливает заголовки ответа |
| `context.send(value)` | Отправляет результат; объект сериализуется в JSON |

Передавай исходный `context` в `dbapi`. Если вместо него создать объект только с пользовательским идентификатором, будут потеряны сведения о сессии и настройках провайдера.

## Формат входа и ответа

Для вызова из `pl-action` и `pl-dataset` используется конверт:

```json
{
  "args": { "employeeId": 42 },
  "control": { "sorts": [{ "field": "lastname", "sort": "asc" }] }
}
```

`args` — параметры операции. `control` — управление выборкой: сортировка, фильтры, диапазон строк. Для действия сохранения `control` обычно не нужен. Формат `args` определяет сам маршрут; путь `/employee/get` и поле `employeeId` — части его контракта.

Успешный ответ содержит `data`:

```json
{ "data": { "id": 42, "firstname": "Анна", "lastname": "Смирнова" } }
```

`pl-action.execute()` возвращает содержимое `data`, поэтому форма получает сразу объект сотрудника. Для коллекции ответ провайдера может дополнительно содержать `metaData`, сведения о диапазоне и режиме строк. Передай его в `context.send(result)` целиком, чтобы `pl-dataset` мог обработать эти сведения.

## Чтение одной записи

```js
import { dbapi } from '@nfjs/back';

export async function getEmployee(context) {
  const { employeeId } = context.body.args;
  const result = await dbapi.query(
    `select id, firstname, lastname
       from company.v4employee where id = :employeeId`,
    { employeeId }, { context }
  );
  context.send({ data: result.data[0] ?? null });
}
```

Значение `employeeId` передаётся отдельно от SQL. Провайдер подставляет его как параметр запроса. `result.data` — массив строк; обработчик выбирает первую и явно возвращает `null`, если запись не найдена. Это позволяет форме отличить отсутствие записи от сетевой ошибки.

## Запись и передача ошибки

```js
import { dbapi } from '@nfjs/back';
import { api } from '@nfjs/core';

export async function createEmployee(context) {
  try {
    const result = await dbapi.broker(
      'company.employee.add', context.body.args, { context }
    );
    context.send({ data: result.data });
  } catch (error) {
    context.send(api.nfError(error).json());
  }
}
```

`dbapi.broker` сам открывает транзакцию для одиночного вызова. При ошибке операция откатывается. `api.nfError(error).json()` формирует штатный ответ, который `pl-action` распознаёт и передаёт как исключение в `execute()`.

Не отправляй успешный `{ data }` после ветки ошибки. Если обработчик продолжает выполнение после `catch`, явно заверши его или строй ветви так, чтобы ответ отправлялся ровно один раз.

## Когда нужен serverEndpoints

В `serverEndpoints` форма объявляет SQL и broker-команды, а NFJS предоставляет общий HTTP-исполнитель. Собственный `web.on` для каждого такого действия не нужен.

| Свойство | REST-обработчик | `serverEndpoints` |
| --- | --- | --- |
| Место описания | Backend-модуль | Серверный блок класса формы |
| Адрес | Регистрируется в `web.on` | Строится из имени формы, типа операции и `id` компонента |
| Прикладной JavaScript | В обработчике или сервисе | Декларативные запросы и действия исполнителя |
| Составная транзакция | Явный `Connect` | Основное и вложенные действия одного провайдера |
| Несколько потребителей | Самостоятельный API | Контракт привязан к форме |

Контракт блока и порядок вложенных действий описаны в [serverEndpoints](/nfjs/server-endpoints). Сравнение одного сценария на обоих способах находится в [руководстве](/nfjs/guide/list).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-back/blob/main/index.js" target="_blank" rel="noopener">web и экспорты backend</a>
  <a href="https://github.com/nf-framework/nf-auth/blob/main/nf-module.js" target="_blank" rel="noopener">Middleware сессии и auth</a>
  <a href="https://github.com/nf-framework/nf-front-pl/blob/main/nf-module.js" target="_blank" rel="noopener">Загрузка форм и FSE</a>
  <a href="https://github.com/nf-framework/nf-back/blob/main/lib/dbapi.js" target="_blank" rel="noopener">dbapi</a>
</footer>
