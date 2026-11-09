# Доступ: pl-access

`pl-access` входит в пакет `@nfjs/back-dbfw-ui-pl`. Компонент запрашивает права пользователя и помещает весь полученный JSON в свойство `data`. Форма использует эти значения, чтобы показывать, скрывать или отключать действия.

## Настройка и запуск

Если `endpoint` не задан, `pl-access` строит адрес [серверной операции формы](/nfjs/server-endpoints) по имени формы и `id` компонента. По умолчанию запрос запускается при подключении. Атрибут `no-auto-execute` отключает автозапуск:

```html
<pl-access id="access" data="{{accessData}}"
  no-auto-execute></pl-access>
```

```js
async onConnect() {
  try {
    await this.$.access.execute();
    this.accessReady = true;
  } catch (error) {
    this.accessError = error.message;
  }
}
```

Явный `endpoint` нужен, когда используется маршрут вне стандартного FSE. `execute()` отправляет POST и присваивает целый JSON-ответ в `data`. Форма сама решает, как читать поля `roles`, `privs` или `options`.

## Ответ и применение в интерфейсе

Операция доступа возвращает запрошенные группы. `privs` строится как дерево по пути, разделённому точками; `roles` и `options` становятся объектами с кодами в качестве ключей. Например, право `company.employee.add` доступно как `pr.privs.company.employee.add`:

```html
<pl-access id="acPrivs" data="{{pr}}"></pl-access>
<pl-button label="Добавить"
  hidden="[[!canAdd(pr)]]"></pl-button>
```

```js
canAdd(pr) {
  return Boolean(pr?.privs?.company?.employee?.add);
}
```

Пример показывает только управление доступностью элемента интерфейса. Проверка права на изменение данных должна выполняться серверным контрактом записи. Скрытая кнопка не заменяет серверную проверку.

## Promise `executed`

Хотя `executed` объявлено как Boolean, при подключении компонент записывает в него Promise, который разрешается значением `true` после успешного `execute()`. Это особенность реализации компонента, а не надёжный булев признак. Для явного управления состоянием используй собственное свойство формы и `await this.$.access.execute()`.

При ошибке запроса `execute()` отклоняет Promise, но внутренний Promise в `executed` не отклоняется. Поэтому для ручного запуска обрабатывай ошибку через `try/catch`, как в примере выше.

## Доступность действий сотрудника

В Demo-company нет готовой операции доступа. В этом примере её ответ воспроизводит сервис в памяти страницы. Переключай права и проверяй, как меняется доступность действий.

<div class="demo"><pl-doc-company-access-demo></pl-doc-company-access-demo></div>

[Код примера](../demos/company-access.js ':include :type=code javascript')

См. также: [действия](/nfjs/actions) и [чтение коллекций](/nfjs/datasets).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/back-dbfw-ui-pl/components/pl-access.js" target="_blank" rel="noopener">pl-access.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/back-dbfw-ui-pl/lib/endpoint-access.js" target="_blank" rel="noopener">endpoint-access.js</a>
</footer>
