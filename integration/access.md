# Проверка доступа через pl-access

`pl-access` входит в пакет `@nfjs/back-dbfw-ui-pl`. Компонент читает endpoint доступа и помещает весь полученный JSON в свойство `data`. Сам по себе он не скрывает кнопки и не блокирует команды: форма использует полученные значения в привязках видимости.

## Настройка и запуск

Если endpoint не задан, `pl-access` строит адрес FSE по имени родительской формы и `id` компонента. По умолчанию запрос запускается при подключении. Атрибут `no-auto-execute` отключает автозапуск, после чего запрос запускают вручную:

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

## Payload и применение в интерфейсе

Endpoint пакета может вернуть запрошенные группы доступа. Например, `privs` строится как дерево по dotted path; `roles` и `options` становятся объектами с кодами в качестве ключей. В generic формах пакета права читаются по пути `pr.privs[mdl][unit].add`, `.upd` и `.del`.

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

Пример показывает только управление доступностью элемента интерфейса. Проверка права на изменение данных должна выполняться backend-контрактом записи. Скрытая кнопка не заменяет серверную проверку.

## Promise `executed`

Хотя `executed` объявлено как Boolean, при подключении компонент записывает в него Promise, который разрешается значением `true` после успешного `execute()`. Это особенность текущего runtime, а не надёжный Boolean-индикатор. Для явного управления состоянием используй собственное свойство формы и `await this.$.access.execute()`.

При ошибке запроса `execute()` отклоняет Promise, но внутренний Promise в `executed` не отклоняется. Поэтому для ручного запуска обрабатывай ошибку через `try/catch`, как в примере выше.

## Связь с Demo-company

В формах Demo-company нет `pl-access` и endpoint-а доступа. Следующий блок — учебное расширение демонстрации: компонент обращается к локальному сервису примера и не вызывает боевой backend.

<div class="demo"><pl-doc-company-access-demo></pl-doc-company-access-demo></div>

[company-access.js](../demos/company-access.js ':include :type=code javascript')

См. также [действия](/integration/actions) и [чтение коллекций](/integration/datasets).
