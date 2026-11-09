# Модули NFJS

Модуль NFJS — устанавливаемый ESM-пакет, который объявляет `nf-module.js`. Загрузчик ядра обнаруживает такие пакеты в `node_modules`, импортирует их и вызывает экспортированный `init()`. Метаданные зависимости определяют порядок инициализации; экспортируемые ресурсы и функции становятся точками интеграции между пакетами.

## Платформенные пакеты и границы

| Пакет | Ответственность | Публичная точка интеграции |
| --- | --- | --- |
| `@nfjs/core` | Конфигурация, загрузка модулей и общие API процесса. | `config`, `api`, `common`, `extension`, `errors`, `debug`, `message`, `container`. |
| `@nfjs/back` | Backend HTTP-сервер и доступ к провайдерам данных. | `web`, `dbapi`, `ExecContext`, `NFProvider`, исполнители endpoint-операций. |
| `@nfjs/back-dbfw` | Модели данных, разделы, права и выполнение операций broker. | `Model`, `Env`, `Op`, `models`, `getUnit`, `getUnitBp`; подключает broker к PostgreSQL-провайдерам. |
| `@nfjs/db-postgres` | Провайдер данных NFJS для PostgreSQL. | Модуль по `type: "db-postgres"` регистрирует экземпляры PostgreSQL-провайдера в `@nfjs/back`. |
| `@nfjs/auth` | HTTP-сессии и провайдеры аутентификации. | `auth`, `authProviders`, `NFAuth`, middleware `session` и `auth`. |
| `@nfjs/front-pl` | Формы Polylib и связь клиентских компонентов с backend-операциями. | `PlForm`, `requestData`, `openForm`, `loadTemplateComponents`, `customLoader`; обработчики serverEndpoints `action` и `dataset`. |
| `@nfjs/back-dbfw-ui-pl` | UI и серверные операции управления DBFW-пользователями, ролями и доступом. | Регистрирует обработчик `access` в реестре серверных обработчиков `@nfjs/front-pl`, добавляет свои HTTP-маршруты и компоненты. |
| `@nfjs/front-server` | Инфраструктура отдачи frontend-ресурсов и статических файлов. | `registerLibDir`, `registerCustomElementsDir`, `prepareResponse`, `customElements`. |
| `@nfjs/migrate` | Синхронизация PostgreSQL-схемы и описанных данных с DB-исходниками модулей. | `NFMig`, `NFMigObj`, `NFMigDat`, API и поиск исходных файлов. |

Модуль отвечает за собственный контракт и сервисы. Например, HTTP-маршрут приложения регистрируется через `web` из `@nfjs/back`, а аутентификацию и сессионные middleware предоставляет `@nfjs/auth`. Прикладные маршруты вызывают `dbapi`; выбранный провайдер данных выполняет запрос или broker-вызов.

## Запуск и порядок модулей

`@nfjs/core` получает набор модулей по установленным `nf-module.js` и настройкам `@nfjs/core.modules`. При загрузке он импортирует модуль, сохраняет его `meta`, а затем упорядочивает зависимости через `meta.require.after` и `meta.require.before`. После загрузки вызывает `init()` каждого модуля. Если модуль экспортирует `menu` или `msgs`, загрузчик включает эти значения в общие реестры меню и сообщений.

Зависимость должна отражать использование публичной точки интеграции. Если модуль регистрирует FSE-обработчик типа `access`, зависимость на `@nfjs/front-pl` нужна как минимум для реестра серверных обработчиков; `@nfjs/back-dbfw-ui-pl` дополнительно зависит от `@nfjs/back-dbfw`, поскольку его обработчик `access` опирается на DBFW.

## Разделение платформы и приложения

Платформенные пакеты реализуют общую инфраструктуру, а прикладной модуль определяет предметные маршруты, контракты чтения и записи, формы и DB-исходники. Например, модуль сотрудников может использовать `@nfjs/back` для `web` и `dbapi`, не копируя обработчик авторизации или драйвер PostgreSQL.

Прикладной модуль обычно содержит `package.json`, `nf-module.js`, файл меню, словарь сообщений, каталоги backend-кода, форм и `dbsrc`. Точная структура зависит от его контрактов; один пакет может предоставлять backend, UI или оба слоя.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-core" target="_blank" rel="noopener">@nfjs/core</a>
  <a href="https://github.com/nf-framework/nf-back" target="_blank" rel="noopener">@nfjs/back</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw" target="_blank" rel="noopener">@nfjs/back-dbfw</a>
  <a href="https://github.com/nf-framework/nf-db-postgres" target="_blank" rel="noopener">@nfjs/db-postgres</a>
  <a href="https://github.com/nf-framework/nf-auth" target="_blank" rel="noopener">@nfjs/auth</a>
  <a href="https://github.com/nf-framework/nf-front-pl" target="_blank" rel="noopener">@nfjs/front-pl</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw-ui-pl" target="_blank" rel="noopener">@nfjs/back-dbfw-ui-pl</a>
  <a href="https://github.com/nf-framework/nf-front-server" target="_blank" rel="noopener">@nfjs/front-server</a>
  <a href="https://github.com/nf-framework/nf-migrate" target="_blank" rel="noopener">@nfjs/migrate</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/extension.js" target="_blank" rel="noopener">Порядок и загрузка модулей</a>
</footer>
