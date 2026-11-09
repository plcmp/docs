# Сессия и контекст выполнения

Контекст связывает вызов с пользователем, организацией и провайдером данных. В HTTP-коде он приходит в обработчик как `context`. В коде без HTTP используется `ExecContext` с явно подготовленной сессией.

## Что находится в сессии

`context.session` — экземпляр `SessionAPI`. Middleware `session` оборачивает им хранилище сессии. После входа провайдер аутентификации записывает сведения о пользователе в ветку `context` этой сессии.

```js
const userId = context.session.get('context.user_id');
const username = context.session.get('context.user');
const orgId = context.session.get('context.org');
```

`user_id` — идентификатор пользователя приложения. `user` — его логин. `org` — выбранная организация. Наличие и смысл дополнительных значений определяет провайдер аутентификации приложения.

Не принимай идентификатор текущего пользователя из `body.args`, когда операция должна выполняться от имени вошедшего пользователя. Источник такого значения — серверная сессия.

## Методы SessionAPI

| Метод | Назначение |
| --- | --- |
| `get(path)` | Читает вложенное значение по пути с точками |
| `set(path, value)` | Устанавливает значение по пути |
| `assign(path, object)` | Объединяет поля объекта с текущим значением |
| `assign(path, array)` | Добавляет элементы массива к текущему массиву |
| `destroy()` | Уничтожает HTTP-сессию при выходе |
| `getCredentials(provider)` | Выбирает credentials из сессии или конфигурации адаптера |
| `prepareProviderContext(provider)` | Формирует список переменных контекста для соединения с провайдером |

`assign` для объекта выполняет поверхностное объединение. Вложенный объект переданного поля заменяет прежнее значение целиком. Для точечного изменения используй `set('path.to.field', value)`.

## Как контекст попадает в PostgreSQL

1. Обработчик передаёт `{ context }` в `dbapi.query` или `dbapi.broker`.
2. `Connect` распознаёт `SessionAPI` и получает credentials для выбранного адаптера.
3. После подключения он вызывает `prepareProviderContext` и устанавливает переменные провайдера.
4. Запросы и broker выполняются на соединении с этим контекстом.

Соответствия хранятся в `context.prv` внутри сессии. Запись `{ ctx: 'org', name: 'nf.org', prvType: 'db-postgres' }` означает: взять `context.org` и передать его PostgreSQL как `nf.org`.

При общем пуле DBFW также передаёт `nf.appuser`. Это логин пользователя приложения, хотя PostgreSQL-соединение открыто под общей ролью. Для получения пользователя на стороне DBFW предназначена `nfc.f_session_user()`: она учитывает этот режим. `session_user` PostgreSQL показывает роль подключения и не всегда совпадает с вошедшим пользователем приложения.

## Передача контекста через слои backend

```js
export async function loadEmployee(context, id) {
  return dbapi.query(
    'select id, firstname, lastname from company.v4employee where id = :id',
    { id }, { context }
  );
}

export async function getEmployee(context) {
  const result = await loadEmployee(context, context.body.args.id);
  context.send({ data: result.data[0] ?? null });
}
```

Вложенная функция получает исходный контекст, а не создаёт новую сессию. Благодаря этому смена слоя JavaScript не теряет пользователя и организацию.

## ExecContext вне HTTP

`ExecContext` — контейнер параметров выполнения. Сам конструктор не выполняет вход и не выдаёт права. Ему нужна сессия, подготовленная доверенным серверным механизмом.

```js
import { ExecContext, dbapi } from '@nfjs/back';

export async function loadForSession(session) {
  const context = new ExecContext({ session });
  return dbapi.query(
    'select id, firstname, lastname from company.v4employee',
    {}, { context }
  );
}
```

В примере `session` — уже подготовленный `SessionAPI`. Для фоновой задачи заранее определи, чья сессия и организация используются. Конструирование `new ExecContext({ user_id: ... })` не заменяет аутентифицированную сессию и не устанавливает контекст PostgreSQL.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-back/blob/main/lib/session-api.js" target="_blank" rel="noopener">SessionAPI</a>
  <a href="https://github.com/nf-framework/nf-back/blob/main/lib/context.js" target="_blank" rel="noopener">ExecContext</a>
  <a href="https://github.com/nf-framework/nf-back/blob/main/lib/dbapi.js" target="_blank" rel="noopener">Передача контекста в соединение</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw/blob/main/lib/auth-provider.js" target="_blank" rel="noopener">Контекст DBFW после входа</a>
</footer>
