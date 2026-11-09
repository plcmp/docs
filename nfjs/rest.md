# REST-операции Demo-company

REST в Demo-company — обычные маршруты NFJS. Обработчики получают JSON в `context.body.args` и сами определяют, как читать и менять данные. `pl-action` только отправляет запрос и возвращает поле `data` ответа.

## Маршруты и формат

Модуль регистрирует POST-маршруты `/employee/list`, `/employee/get`, `/employee/create`, `/employee/update`, `/employee/delete`, `/employee/save` и `/employee/contactsList`. Для них включены middleware `session`, `auth`, `json`.

Форма вызывает маршрут через `pl-action`:

```html
<pl-action id="aGet" endpoint="/employee/get"
  args="[[_compose('employeeId', employeeId)]]"></pl-action>
<pl-action id="aSave" endpoint="/employee/save"></pl-action>
```

```js
const employee = await this.$.aGet.execute();
const result = await this.$.aSave.execute({
  employee: this.employee,
  contacts: this.contacts._mutations
});
this.employeeId = result.id;
```

POST-тело `pl-action` имеет вид `{ args: ... }`. `/employee/get` читает `context.body.args.employeeId` и отправляет `{ data: row }`; `/employee/save` отправляет `{ data: { id } }`. Поэтому `execute()` возвращает саму запись либо объект с `id`, без внешней оболочки `data`.

## Сохранение сотрудника и контактов

Текущий `save` — единая прикладная операция. Она начинает транзакцию на соединении, добавляет или обновляет сотрудника, затем проходит три группы `contacts.add`, `contacts.upd`, `contacts.del`. Для новых контактов обработчик подставляет `employee_id` из результата добавления сотрудника. После всех изменений выполняется commit; исключение приводит к rollback.

Обработчик сохранения:

```js
import { dbapi } from '@nfjs/back';
import { api } from '@nfjs/core';

export async function save(context) {
  const connect = await dbapi.getConnect(context);
  const { employee, contacts } = context.body.args;
  let employeeId = employee.id;
  try {
    await connect.begin();
    if (!employeeId) {
      const result = await connect.broker('company.employee.add', employee);
      employeeId = result.data.id;
    } else {
      await connect.broker('company.employee.upd', employee);
    }

    for (const row of contacts?.add || []) {
      row.employee_id = employeeId;
      await connect.broker('company.employee_contact.add', row);
    }
    for (const row of contacts?.upd || []) {
      await connect.broker('company.employee_contact.upd', row);
    }
    for (const row of contacts?.del || []) {
      await connect.broker('company.employee_contact.del', row);
    }

    await connect.commit();
    context.send({ data: { id: employeeId } });
  } catch (error) {
    await connect.rollback();
    context.send(api.nfError(error, error.message).json());
  } finally {
    connect.release();
  }
}
```

`pl-data-observer` формирует `_mutations` на коллекции контактов. Форма передаёт именно эти группы; REST-обработчик управляет транзакцией и связывает новые строки с сотрудником. Подробности о `$action` и `paths` — в [изменениях вложенных данных](/nfjs/nested-changes).

## Чтение коллекций и граница контракта

`/employee/list` передаёт `context.body.control` в `dbapi.query`; `/employee/contactsList` читает `employeeId` и возвращает строки контактов сотрудника. Это два разных маршрута с разными входными данными.

REST-обработчик отвечает за прикладную оркестрацию: выбирает broker-команды, порядок вызовов и формат ответа. Если нужно сохранять только одну часть модели, оформи для неё отдельный маршрут/контракт или используй вложенное действие FSE, которое обрабатывает выбранную коллекцию. Не очищай общий наблюдатель через `snapshot()` после сохранения одной зоны, пока другие зоны остаются изменёнными; см. [частичное сохранение](/nfjs/partial-save).

См. также: [`pl-action`](/nfjs/actions), [`pl-dataset`](/nfjs/datasets), [серверные операции формы](/nfjs/server-endpoints).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/demo/blob/master/modules/demo-company/nf-module.js" target="_blank" rel="noopener">Demo-company: маршруты</a>
  <a href="https://github.com/nf-framework/demo/blob/master/modules/demo-company/lib/employees.js" target="_blank" rel="noopener">Demo-company: операции с сотрудниками</a>
</footer>
