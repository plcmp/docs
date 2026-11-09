# Структура NFJS-модуля

NFJS-модуль — ESM-пакет с файлом `nf-module.js`. `package.json` описывает сам пакет и его зависимости npm; `nf-module.js` описывает включение модуля в среду выполнения NFJS: метаданные зависимостей, инициализацию через `init()` и дополнительные ресурсы. Пакет может предоставлять backend, UI, DB-объекты или несколько таких частей.

## Файлы модуля

| Путь | Назначение |
| --- | --- |
| `package.json` | Имя пакета, `"type": "module"` для ESM-файлов `.js`, зависимости и метаданные пакета. |
| `nf-module.js` | Экспорты `meta`, `init()` и доступных модулю ресурсов. Здесь регистрируются серверные маршруты и обработчики расширения. |
| `lib/` | Реализация backend-операций и функций модуля. Структурируй каталог по предметным операциям и публичным контрактам. |
| `dbsrc/<schema>/src/` | Исходники объектов базы данных, которыми владеет модуль. |
| `dbsrc/<schema>/dat/` | Декларативные наборы данных, которые миграционный модуль синхронизирует из исходников. |
| `forms/` | Файлы frontend-форм модуля, если пакет предоставляет пользовательский интерфейс. |
| `menu.json` | Пункты меню, экспортируемые модулем для общей навигации приложения. |
| `msgs.json` | Словари сообщений модуля, которые загрузчик добавляет в общий реестр. |

Необязательные каталоги и файлы появляются по контракту самого модуля. Backend-модуль без UI не обязан содержать `forms/`; модуль, которому не нужны меню или пользовательские сообщения, не обязан объявлять эти ресурсы.

## Контракт `nf-module.js`

Экземпляр `web` инициализируется `@nfjs/back`. Модуль регистрирует свои маршруты в `init()` и экспортирует `init`, чтобы загрузчик ядра мог вызвать её после импорта. `meta.require.after` и `meta.require.before` задают зависимости порядка инициализации.

```js
import { web } from '@nfjs/back';

const meta = {
  require: {
    after: ['@nfjs/back', '@nfjs/auth']
  }
};

async function init() {
  web.on('POST', '/example', { middleware: ['session', 'auth', 'json'] }, async (context) => {
    context.send({ data: { accepted: true } });
  });
}

export { init, meta };
```

Список middleware включает только компоненты, которые зарегистрированы загруженными модулями. Например, `session` и `auth` принадлежат `@nfjs/auth`, а `json` регистрируется `@nfjs/back`. Укажи `@nfjs/back` и `@nfjs/auth` в зависимости npm, а также в `meta.require.after`, чтобы импорты были доступны, а middleware зарегистрированы до инициализации маршрута.

## Зависимости и инициализация

`@nfjs/core` ищет файлы `nf-module.js` в установленных пакетах и применяет `@nfjs/core.modules.only` / `disabled`. После импорта он проверяет `meta.require` и упорядочивает модули. `after` означает, что текущий пакет инициализируется после указанного; `before` — до указанного. Если зависимость отсутствует, загрузчик сообщает о ней; циклический порядок приводит к ошибке загрузки.

`init()` вызывается загрузчиком при запуске приложения. В нём регистрируют маршруты, обработчики расширения, middleware и адаптеры.

`modules.only` и `modules.disabled` задают состав загруженных модулей, но не их порядок; порядок задают только метаданные зависимостей. Если два пакета регистрируют один HTTP-маршрут с заменой обработчика, укажи порядок явно. Например, `@nfjs/front-pl` регистрирует `/front/action/getMenu`, а `@nfjs/back-dbfw` заменяет его своим обработчиком с `override: true`; для этого случая DBFW должен инициализироваться после `front-pl`. Это требование относится к конфликтующим маршрутам, а не ко всем доменным модулям.

## Экспорт ресурсов

Если модуль экспортирует `menu`, загрузчик добавляет его пункты в общее меню. Если экспортирует `msgs`, загрузчик сливает словари по пространствам имён; DB-провайдер и другие потребители могут искать сообщения в общем реестре.

Файл JSON загружается через API ядра `api.loadJSON(path)`. В модуле путь обычно строится относительно `import.meta.url`, чтобы пакет не зависел от текущего рабочего каталога приложения.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/extension.js" target="_blank" rel="noopener">Обнаружение, порядок и экспорт ресурсов модулей</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/index.js" target="_blank" rel="noopener">Запуск init()</a>
  <a href="https://github.com/nf-framework/nf-back/blob/main/nf-module.js" target="_blank" rel="noopener">Регистрация backend middleware и routes</a>
  <a href="https://github.com/nf-framework/nf-auth/blob/main/nf-module.js" target="_blank" rel="noopener">Регистрация session/auth middleware</a>
  <a href="https://github.com/nf-framework/nf-front-pl/blob/main/nf-module.js" target="_blank" rel="noopener">Маршрут получения меню в front-pl</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw/blob/main/nf-module.js" target="_blank" rel="noopener">Переопределение маршрута меню в DBFW</a>
</footer>
