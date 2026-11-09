# Конфигурация NFJS

Конфигурация задаёт параметры приложения и подключённых модулей: какие модули загружать, на каком порту запускать HTTP-сервер, как открывать соединения с источниками данных и какие режимы диагностики включить. Ядро загружает один корневой JSON-файл, а пакеты читают из него принадлежащие им секции.

## Загрузка `config.json` и переменных окружения

По умолчанию NFJS читает `config.json` из текущего рабочего каталога. Параметр `--config` задаёт другой путь; относительный путь разрешается от текущего каталога, абсолютный используется напрямую.

После чтения конфигурации ядро загружает `.env` и подставляет непустые значения переменных окружения в строковые значения вида `{{NAME}}`. Если итоговое значение распознаётся как число или `true`/`false`, оно преобразуется в соответствующий тип. Поэтому статические числа и булевы настройки лучше задавать в JSON как числа и булевы значения; строковые реквизиты — ссылками на переменные окружения. Если переменная не задана или пуста, соответствующий маркер остаётся в конфигурации как строка.

Например, в JSON указывается `"password": "{{DB_PASSWORD}}"`; само значение `DB_PASSWORD` задаётся в окружении процесса. При замене переменной код сохраняет строковый тип, если значение окружения начинается с `~`: этот префикс удаляется и не попадает в итоговую строку. Обычно это нужно, когда содержимое строки похоже на число или булево значение.

## Уровни настроек

Корневые свойства описывают приложение и настройки, которые читают непосредственно runtime-модули. Пространства `@nfjs/<имя-пакета>` принадлежат конкретным модулям: пакет сам читает свою секцию. Имя секции должно совпадать с ключом, который использует модуль.

| Свойство | Тип | Для чего используется |
| --- | --- | --- |
| `http_port` | число | Порт HTTP-сервера. `@nfjs/back` запускает listener, если значение задано. |
| `https_port` | число | Порт HTTPS listener. Для запуска также нужны `ssl_keyfile` и `ssl_certfile`. |
| `debug.need` | boolean | Включает сбор диагностических данных в PostgreSQL-провайдере и DBFW broker. |
| `debug.includeToResponse` | boolean | Используется сериализатором ошибок, если вызывается `NFError.json({ checkDebugConfig: true })`; определяет, включать ли полную информацию ошибки в такой ответ. Конкретный endpoint может сериализовать ошибку без этой проверки. |
| `data_providers` | объект | Именованные конфигурации подключаемых источников данных. |
| `@nfjs/core` | объект | Настройки ядра, включая список модулей приложения. |
| `@nfjs/back` | объект | Настройки backend-пакета, например конфигурация JSON middleware. |
| `@nfjs/auth` | объект | Настройки сессии и хранилища сессий. |
| `@nfjs/db-postgres` | объект | Настройки модуля PostgreSQL, например параметры форматов сообщений. |
| `client` | объект | Публичные настройки, которые `@nfjs/front-pl` выдаёт клиенту через `/pl-get-config`. |

Секреты и настройки подключения к базе относятся к серверной конфигурации и не размещаются в `client`.

## Выбор NFJS-модулей

Ядро ищет установленные пакеты с `nf-module.js` и загружает выбранные модули в порядке, согласованном по `meta.require.after` и `meta.require.before`. Настройка модулей находится в `@nfjs/core.modules`.

| Свойство | Тип | Для чего используется |
| --- | --- | --- |
| `@nfjs/core.modules.only` | массив строк | Список загружаемых модулей. Когда он задан, ядро рассматривает только перечисленные имена. |
| `@nfjs/core.modules.disabled` | массив строк | Список исключённых модулей. Ядро отфильтровывает их как из автоматически найденного набора, так и из списка `only`. |

Имя модуля — имя пакета в `node_modules`, включая scope, например `@nfjs/back`.

## Источник данных и PostgreSQL-адаптер

Приложение объявляет источник в `data_providers` под логическим именем, например `default`. `@nfjs/db-postgres` находит элементы с `type: "db-postgres"`, создаёт PostgreSQL-провайдер и помещает его в `dataProviders` под ключом элемента. `NFProvider.name` берётся из поля `name` внутри конфигурации провайдера, а не из ключа; укажи его явно и согласуй с ключом, например `name: "default"` для `data_providers.default`.

Реквизиты и параметры PostgreSQL располагаются внутри `connectConfig`. Настройки пула передаются отдельно; поля подключения не следует помещать на верхнем уровне провайдера.

| Свойство провайдера | Тип | Для чего используется |
| --- | --- | --- |
| `data_providers.<key>` | объект | Логическая конфигурация провайдера. Backend выбирает его по ключу, например `default`. |
| `name` | строка | Имя экземпляра `NFProvider`; указывается явно и в текущем коде не выводится из ключа `<key>`. |
| `type` | строка | Тип адаптера. Значение `db-postgres` связывает конфигурацию с `@nfjs/db-postgres`. |
| `connectType` | строка: `user`, `pool`, `poolPerUser` | Способ создания клиентских соединений. |
| `credentialsSource` | строка: `config` или `session` | Источник имени пользователя и пароля базы: `config` берёт их из `connectConfig`, `session` — из контекста аутентифицированной сессии. |
| `connectConfig` | объект | Параметры PostgreSQL-соединения, включая `host`, `port`, `database`, `user`, `password`, `application_name` и опциональный `sessionConfig`. |
| `connectPoolConfig` | объект | Дополнительные настройки пула, которые передаются `pg.Pool`; состав параметров определяется адаптером PostgreSQL. |
| `supportConnectConfig` | объект | Параметры отдельного служебного пула PostgreSQL. Адаптер создаёт его на основе `connectConfig`, устанавливает `max: 1`, затем применяет этот объект. Он используется для поддержки отмены выполняемого запроса. |

### Режимы соединения

| `connectType` | Поведение |
| --- | --- |
| `user` | Для каждого `getConnect` создаётся отдельный PostgreSQL `Client`. При прямом использовании `dbapi.getConnect()` вызывающий код освобождает соединение через `connect.release()`. Если `credentialsSource: "session"`, в клиент передаются учётные данные пользователя из сессии. |
| `pool` | Используется общий пул соединений. Конфигурация `pool` с `credentialsSource: "session"` отвергается базовым `NFProvider`: общий пул нельзя одновременно строить с разными учётными данными из HTTP-сессий. Обычно такой режим работает с `credentialsSource: "config"` и общей ролью приложения в PostgreSQL. |
| `poolPerUser` | Пулы создаются отдельно по имени пользователя PostgreSQL. При `credentialsSource: "session"` адаптер получает имя и пароль из сессии и использует имя пользователя как ключ пула. |

Пользователь приложения и пользователь PostgreSQL — разные идентичности. При `credentialsSource: "config"` запросы подключаются к базе под общей ролью приложения; логин пользователя приложения хранится в NFJS-сессии. Встроенный DBFW-провайдер аутентификации при успешной аутентификации в режиме `pool` добавляет логин приложения в контекст PostgreSQL как `nf.appuser`. PostgreSQL-политика может использовать это имя для определения пользователя приложения, хотя соединение открыто общей ролью. Если в режиме `user` задано `credentialsSource: "session"`, подключение использует PostgreSQL-учётные данные пользователя из сессии. Имя роли базы само по себе не заменяет идентичность пользователя приложения для контрактов, которым нужны данные NFJS-сессии.

## Пример конфигурации приложения

Пример включает список установленных модулей NFJS, HTTP-порт, диагностику и PostgreSQL-провайдер. Учётная запись PostgreSQL и её пароль помещены в `connectConfig`; пароль поступает из `DB_PASSWORD` при загрузке конфигурации. Значения host, port и database заменяются параметрами среды, в которой работает приложение.

<details class="docs-code">
<summary>Полный config.json</summary>

```json
{
  "http_port": 3000,
  "debug": {
    "need": false,
    "includeToResponse": false
  },
  "@nfjs/core": {
    "modules": {
      "only": [
        "@nfjs/core",
        "@nfjs/back",
        "@nfjs/auth",
        "@nfjs/db-postgres",
        "@nfjs/back-dbfw",
        "@nfjs/back-dbfw-ui-pl",
        "@nfjs/front-server",
        "@nfjs/front-pl"
      ],
      "disabled": []
    }
  },
  "data_providers": {
    "default": {
      "name": "default",
      "type": "db-postgres",
      "connectType": "pool",
      "credentialsSource": "config",
      "connectConfig": {
        "host": "{{DB_HOST}}",
        "port": "{{DB_PORT}}",
        "database": "{{DB_NAME}}",
        "user": "{{DB_USER}}",
        "password": "{{DB_PASSWORD}}",
        "application_name": "nfjs-app"
      },
      "connectPoolConfig": {
        "max": 10,
        "idleTimeoutMillis": 30000
      }
    }
  }
}
```

</details>

Для этого примера HTTP-сервер запускается на заданном порту, а PostgreSQL-провайдер `default` создаёт общий пул с credentials из `connectConfig`. `DB_PORT` должен содержать числовой порт; подстановка окружения преобразует числовое значение в число. Если приложение использует другие модули, включи их в `modules.only` или убери этот белый список и задай `disabled`.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-core/blob/main/index.js" target="_blank" rel="noopener">Загрузка config.json и подстановка окружения</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/extension.js" target="_blank" rel="noopener">Поиск и порядок модулей</a>
  <a href="https://github.com/nf-framework/nf-back/blob/main/lib/provider.js" target="_blank" rel="noopener">Контракт провайдера данных</a>
  <a href="https://github.com/nf-framework/nf-back/blob/main/lib/session-api.js" target="_blank" rel="noopener">Credentials и контекст сессии</a>
  <a href="https://github.com/nf-framework/nf-db-postgres/blob/main/nf-module.js" target="_blank" rel="noopener">Регистрация PostgreSQL-провайдера</a>
  <a href="https://github.com/nf-framework/nf-db-postgres/blob/main/lib/provider.js" target="_blank" rel="noopener">Соединения, пулы и контекст PostgreSQL</a>
  <a href="https://github.com/nf-framework/nf-auth/blob/main/nf-module.js" target="_blank" rel="noopener">Конфигурация сессии</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw/blob/main/lib/auth-provider.js" target="_blank" rel="noopener">Аутентификация и nf.appuser</a>
  <a href="https://github.com/nf-framework/nf-front-pl/blob/main/nf-module.js" target="_blank" rel="noopener">Публичная конфигурация клиента</a>
</footer>
