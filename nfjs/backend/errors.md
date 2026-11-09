# Ошибки и msgs.json

`msgs.json` связывает технический код ошибки с текстом для пользователя. Словарь лежит в модуле, который владеет правилом: база сообщает код нарушения и параметры, backend находит текст, а `pl-action` показывает его в форме.

Словарь также можно использовать в JavaScript для сообщений об успешном выполнении и других результатов операции. Он не выполняет проверку данных сам: правило остаётся в ограничении, триггере или контракте записи.

## Словарь и его подключение

Первый уровень JSON — пространство имён, второй — коды сообщений. В одном файле можно держать несколько пространств:

```json
{
  "dbWarn": {
    "company.employee_contact.contact#notnull": "Укажи значение контакта."
  },
  "companyDataWarn": {
    "company.employee_card.ch4employee_card8begin_not_before_birth":
      "Дата начала действия личного дела [{0}] не должна быть ранее даты рождения сотрудника."
  },
  "companyInfo": {
    "employee_saved": "Сотрудник «{0}» сохранён."
  }
}
```

`dbWarn` используется PostgreSQL-провайдером для известных ошибок ограничений. `companyDataWarn` и `companyInfo` — пространства сообщений прикладного модуля. Точки в коде сообщения являются частью ключа.

Файл нужно загрузить и **экспортировать как `msgs`** из `nf-module.js`:

```js
import { api } from '@nfjs/core';
import { fileURLToPath } from 'node:url';

const msgs = await api.loadJSON(
  fileURLToPath(new URL('./msgs.json', import.meta.url))
);

export { msgs };
```

В полном модуле этот экспорт находится рядом с `meta`, `menu` и `init`. Само наличие файла не подключает словарь. При запуске загрузчик объединяет экспортированные пространства в общий реестр сообщений. Для обновления текста перезапусти приложение; миграция БД для изменения `msgs.json` не требуется.

Одинаковый код в одном пространстве имён может быть переопределён другим модулем. Для прикладных сообщений используй своё пространство, а для ограничений — полный код объекта.

## Пример: обязательное значение контакта

Колонка `company.employee_contact.contact` имеет ограничение `NOT NULL`. Если операция `company.employee_contact.add` получает `contact: null`, PostgreSQL возвращает SQLSTATE `23502` и сведения о схеме, таблице и колонке.

Провайдер составляет ключ `company.employee_contact.contact#notnull`, ищет его в `dbWarn` и заменяет технический текст на «Укажи значение контакта». Для обычного ограничения не нужен отдельный `RAISE` в функции — ошибка уже сформирована PostgreSQL.

В REST-сохранении ошибка проходит через обычный `catch`:

```js
try {
  await connect.begin();
  await connect.broker('company.employee_contact.add', contact);
  await connect.commit();
  context.send({ data: { saved: true } });
} catch (error) {
  await connect.rollback();
  context.send(api.nfError(error).json());
} finally {
  await connect.release();
}
```

Здесь `connect` уже получен через `dbapi.getConnect(context)`. Существенное поле ответа:

```json
{ "error": "Укажи значение контакта." }
```

`pl-action` показывает этот текст и отклоняет Promise. Вызов `snapshot()` после `await execute()` не происходит, поэтому введённые данные остаются изменёнными. В `serverEndpoints` PostgreSQL-провайдер использует тот же словарь; формировать собственный HTTP-ответ в классе формы не требуется.

Полная транзакция сотрудника и контактов приведена в [сохранении карточки](/nfjs/guide/card).

## Ключи ошибок ограничений

| SQLSTATE | Нарушение | Ключ в `dbWarn` |
| --- | --- | --- |
| `23505` | `UNIQUE` | `<schema>.<table>.<constraint>` |
| `23502` | `NOT NULL` | `<schema>.<table>.<column>#notnull` |
| `23503` | Внешний ключ при вставке или обновлении дочерней строки | `<schema>.<table>.<constraint>#iu` |
| `23503` | Внешний ключ при изменении или удалении ссылаемой строки | `<schema>.<table>.<constraint>#ud` |
| `23514` | `CHECK` | `<schema>.<table>.<constraint>` |
| `23P01` | `EXCLUDE` | `<schema>.<table>.<constraint>` |

Для `UNIQUE`, `NOT NULL`, `CHECK` и `EXCLUDE` при отсутствии прикладного текста провайдер ищет соответствующее общее сообщение в `dbWarnCommon`.

У внешнего ключа порядок подробнее: сначала ключ ограничения с `#iu` или `#ud` в `dbWarn`, затем общий `foreign_key_violation#iu` или `#ud` в `dbWarnCommon`, далее ключ ограничения без суффикса и общий `foreign_key_violation`. Учти этот порядок, когда задаёшь разные тексты для записи дочерней строки и удаления родителя.

## Пример: собственная проверка с параметрами

В Demo-company дата начала личного дела не должна предшествовать дате рождения сотрудника. Проверка в триггере поднимает кодированную ошибку:

```sql
raise '%', nfc.f_msg8prepare(
  'company.employee_card.ch4employee_card8begin_not_before_birth',
  'companyDataWarn',
  new.date_begin::text
);
```

`nfc.f_msg8prepare` получает код сообщения, пространство имён и значения подстановок. Она возвращает JSON-текст для исключения; обычный `RAISE` выдаёт SQLSTATE `P0001`. PostgreSQL-провайдер разбирает этот JSON и получает сообщение из словаря.

| Аргумент | Назначение |
| --- | --- |
| `p_msgcode` | Ключ второго уровня в `msgs.json` |
| `p_namespace` | Пространство имён первого уровня |
| `p_replaces` | Последовательность текстовых значений для `{0}`, `{1}` и следующих подстановок |

Для даты `1989-01-01` сообщение получится таким: «Дата начала действия личного дела [1989-01-01] не должна быть ранее даты рождения сотрудника».

Формат передаваемых данных можно сформировать и явно:

```sql
raise exception using
  errcode = 'P0001',
  message = json_build_object(
    'msgcode', 'company.employee_card.ch4employee_card8begin_not_before_birth',
    'namespace', 'companyDataWarn',
    'replaces', json_build_array(new.date_begin::text)
  )::text;
```

Оба варианта передают один контракт. Порядок значений должен соответствовать номерам в тексте; форматтер подставляет строки, но не форматирует дату или денежную сумму. Нужное представление значения подготовь перед вызовом.

## Получение сообщения в JavaScript

```js
import { message } from '@nfjs/core';

const text = message.getMsg(
  'employee_saved', 'companyInfo', ['Анна Смирнова']
);
// Сотрудник «Анна Смирнова» сохранён.
```

| Параметр `getMsg` | Назначение |
| --- | --- |
| `code` | Код сообщения |
| `namespace` | Пространство имён; указывай явно для однозначного поиска |
| `replaces` | Массив значений подстановок; по умолчанию `[]` |

После успешного сохранения backend может вернуть такой текст в своём контракте:

```js
context.send({ data: { id, message: text } });
```

Тогда форма получает сообщение вместе с результатом:

```js
const result = await this.$.aSave.execute(args);
await this.reload();
this.notify(result.message);
```

Это явная договорённость операции о поле `data.message`. Сам вызов `getMsg` не показывает уведомление и не меняет состояние формы. При отсутствии ключа в указанном пространстве метод возвращает `undefined`; проверь код и подключение словаря.

## NFError и ответ REST

`api.nfError(error, message, detail)` создаёт ошибку NFJS, сохраняя сведения об исходном исключении. Для передачи уже подготовленной ошибки провайдера достаточно `api.nfError(error).json()`: так прикладной текст из `msgs.json` сохраняется.

Если нужен дополнительный контекст операции, вторым аргументом можно передать сообщение, третьим — детали:

```js
const error = api.nfError(cause, 'Не удалось сохранить сотрудника', {
  operation: 'save', employeeId
});
context.send(error.json());
```

Новый текст становится основным сообщением. Не подменяй им полезную конкретную причину из `msgs.json`, например нарушение периода или обязательного поля.

`json()` по умолчанию возвращает `error`, `stack`, `nfDetail` и `nfStack`. Вариант `json({ checkDebugConfig: true })` учитывает `debug.includeToResponse`: при выключенном параметре остаётся только `error`, при включённом возвращается полная структура.

## Проверка сообщений

1. Проверь, что модуль включён и экспортирует `msgs`.
2. Вызови `message.getMsg` с известным ключом, пространством и параметрами. Результат должен совпасть с ожидаемым текстом.
3. В учебном приложении отправь контакт с `contact: null` через REST или действие `serverEndpoints`. Ответ должен содержать «Укажи значение контакта».
4. Убедись, что ошибка откатывает всю транзакцию, а форма сохраняет введённые данные для исправления.

Если вместо сообщения показан технический текст, сравни имя ограничения или колонки с ключом словаря, проверь namespace и перезапуск приложения после редактирования файла. Если в тексте появился `undefined`, не хватает значения в массиве подстановок.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/errors.js" target="_blank" rel="noopener">NFError и JSON-сериализация</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/index.js" target="_blank" rel="noopener">api.nfError()</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/extension.js" target="_blank" rel="noopener">Подключение пространств сообщений</a>
  <a href="https://github.com/nf-framework/nf-core/blob/main/api/message.js" target="_blank" rel="noopener">Поиск сообщений</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw/blob/main/dbsrc/nfc/src/function/f_msg8prepare.sql" target="_blank" rel="noopener">Подготовка кодированной ошибки в PostgreSQL</a>
  <a href="https://github.com/nf-framework/demo/blob/master/modules/demo-company/msgs.json" target="_blank" rel="noopener">Словарь Demo-company</a>
  <a href="https://github.com/nf-framework/nf-db-postgres/blob/main/lib/utils.js" target="_blank" rel="noopener">Преобразование ошибок PostgreSQL</a>
  <a href="https://github.com/nf-framework/nf-db-postgres/blob/main/lib/provider.js" target="_blank" rel="noopener">Обработка ошибок адаптером</a>
  <a href="https://github.com/nf-framework/nf-front-pl/blob/main/components/pl-action.js" target="_blank" rel="noopener">Обработка ошибки в pl-action</a>
  <a href="https://github.com/plcmp/pl-data-observer/blob/main/pl-data-observer.js" target="_blank" rel="noopener">Снимки и мутации данных формы</a>
  <a href="https://github.com/nf-framework/nf-back-dbfw/blob/main/msgs.json" target="_blank" rel="noopener">DBFW-сообщения ограничений</a>
</footer>
