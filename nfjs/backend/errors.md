# Ошибки backend и сообщения

`api.nfError()` создаёт `NFError` с сообщением, деталями и, если передана исходная ошибка, её цепочкой. HTTP-контракты NFJS используют JSON-поле `error`; PostgreSQL-провайдер преобразует известное ограничение или кодированную ошибку процедуры в сообщение из реестра `msgs`.

## `api.nfError()` и JSON-ответ

`api.nfError(error, message, detail)` возвращает `NFError`. Если исходная ошибка уже `NFError`, оболочка сохраняет её цепочку и может добавить новое сообщение/детали. Для обычного `Error` NFJS сохраняет его текст и стек в структуре ошибки.

`NFError.json()` сериализует объект, предназначенный для ответа HTTP или клиентского исполнителя. Без опции проверки конфигурации он содержит `error`, `stack`, `nfDetail` и `nfStack`. `json({ checkDebugConfig: true })` возвращает только `error`, если `debug.includeToResponse` выключен; когда включён, возвращает полную структуру.

В обработчике передавай исходную ошибку NFJS без подмены локальной строкой: `context.send(api.nfError(error).json())`. Если нужен контекст операции, вторым аргументом можно передать понятное сообщение, третьим — структурированные детали: `api.nfError(error, 'Не удалось сохранить запись', { operation: 'save' })`.

## Ошибки транзакции

Когда одна задача выполняет несколько write-команд на одном соединении, `commit()` вызывается только после успеха всех действий. При исключении выполняется `rollback()`, после чего ошибка сериализуется через `api.nfError(error).json()`. Соединение, полученное через `dbapi.getConnect(context)`, освобождается через `release()` в `finally`, независимо от исхода операции. Одиночный `dbapi.broker(...)` уже управляет соединением и транзакцией сам; ему не нужна дополнительная оболочка `getConnect()`.

## Сообщения DB-ограничений в `msgs.json`

PostgreSQL-провайдер распознаёт SQLSTATE DB-ограничений и ищет локализованное сообщение в реестре модульных `msgs`. Словарь `msgs.json` состоит из namespace и соответствующих ему ключей:

```json
{
  "dbWarn": {
    "<schema>.<table>.<constraint>": "Человекочитаемое сообщение"
  }
}
```

В PL/pgSQL эта структура передаётся как текст исключения:

```sql
raise exception using
  errcode = 'P0001',
  message = json_build_object(
    'msgcode', 'employee_period_conflict',
    'namespace', 'dbWarn',
    'replaces', json_build_array(p_date_begin, p_date_end)
  )::text;
```

Плейсхолдеры `{0}`, `{1}` и далее заменяются значениями, которые передаёт форматтер ошибки. Точный ключ зависит от типа нарушения:

| PostgreSQL SQLSTATE | Ошибка | Ключ `dbWarn` |
| --- | --- | --- |
| `23505` | `UNIQUE` | `<schema>.<table>.<constraint>` |
| `23502` | `NOT NULL` | `<schema>.<table>.<column>#notnull` |
| `23503` | `FOREIGN KEY` при вставке/обновлении | Порядок поиска: `<schema>.<table>.<constraint>#iu` в `dbWarn`, `foreign_key_violation#iu` в `dbWarnCommon`, затем ключ ограничения без суффикса в `dbWarn` и `foreign_key_violation` в `dbWarnCommon`. |
| `23503` | `FOREIGN KEY` при обновлении/удалении ссылаемой строки | Порядок поиска: `<schema>.<table>.<constraint>#ud` в `dbWarn`, `foreign_key_violation#ud` в `dbWarnCommon`, затем ключ ограничения без суффикса в `dbWarn` и `foreign_key_violation` в `dbWarnCommon`. |
| `23514` | `CHECK` | `<schema>.<table>.<constraint>` |
| `23P01` | `EXCLUDE` | `<schema>.<table>.<constraint>` |

Если модульный текст не найден, PostgreSQL-провайдер ищет соответствующий общий код в `dbWarnCommon`. Системные сообщения ошибок ограничений можно определить в `@nfjs/back-dbfw/msgs.json`; прикладное сообщение помещают в `msgs.json` модуля-владельца данных. Экспорт `msgs` из `nf-module.js` позволяет загрузчику добавить namespace в общий реестр.

## Кодированная ошибка DB write-функции

Когда инвариант нельзя выразить стандартным ограничением БД, write-функция может поднять ошибку `P0001` с JSON-текстом. Форматтер разбирает поля `msgcode`, `namespace` и опциональный массив `replaces`, затем ищет сообщение в соответствующем namespace:

```json
{
  "msgcode": "employee_period_conflict",
  "namespace": "dbWarn",
  "replaces": ["2026-03-01", "2026-03-15"]
}
```

Код ошибки должен совпасть с ключом в экспортируемом `msgs.json`. Не передавай готовый пользовательский текст в PL/pgSQL и не разбирай сообщение PostgreSQL вручную в HTTP-коде.

## Ошибки ввода и состояние UI

UI-валидация предназначена для быстрой обратной связи по полям формы. Уникальность, ссылочная целостность и транзакционные инварианты должны оставаться в ограничениях или DB write-контрактах, чтобы они действовали для любого клиента.

`pl-action.execute()` считает ответ с полем `error` неуспехом: он показывает уведомление и отклоняет Promise. `pl-data-observer` очищает мутации и фиксирует снимок только при вызове `snapshot()`. Поэтому вызывай `snapshot()` после успешного сохранения и актуализации данных; при ошибке сохрани dirty-состояние и введённые пользователем изменения для исправления или повтора.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/errors.js" target="_blank" rel="noopener">NFError и JSON-сериализация</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/index.js" target="_blank" rel="noopener">api.nfError()</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/extension.js" target="_blank" rel="noopener">Загрузка messages namespaces</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/message.js" target="_blank" rel="noopener">Поиск сообщений</a>
  <a href="https://github.com/nf-framework/nf-db-postgres/blob/main/lib/utils.js" target="_blank" rel="noopener">Преобразование ошибок PostgreSQL</a>
  <a href="https://github.com/nf-framework/nf-db-postgres/blob/main/lib/provider.js" target="_blank" rel="noopener">Обработка ошибок адаптером</a>
  <a href="https://github.com/nf-framework/nf-front-pl/blob/main/components/pl-action.js" target="_blank" rel="noopener">Обработка ошибки в pl-action</a>
  <a href="https://github.com/plcmp/pl-data-observer/blob/main/pl-data-observer.js" target="_blank" rel="noopener">Снимки и мутации данных формы</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw/blob/main/msgs.json" target="_blank" rel="noopener">DBFW-сообщения ограничений</a>
</footer>
