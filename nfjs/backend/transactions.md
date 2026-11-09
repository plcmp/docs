# Соединения и транзакции

Транзакция объединяет несколько операций в одно изменение. Если запись любой строки завершается ошибкой, должны откатиться все изменения этой операции. В NFJS для этого получают один `Connect` и выполняют все вызовы через него.

## Методы Connect

```js
const connect = await dbapi.getConnect(context);
```

Второй аргумент `getConnect` — настройки: `provider`, `connectPlace`, `forceCredentials`. По умолчанию используется провайдер `default`. После получения соединения контекст его сессии уже установлен; транзакция ещё не начата.

| Метод | Назначение |
| --- | --- |
| `begin()` | Начать транзакцию |
| `query(sql, params, options, control)` | Прочитать данные на этом соединении |
| `broker(action, params)` | Выполнить операцию записи на этом соединении |
| `func(name, params)` | Вызвать функцию на этом соединении |
| `commit()` | Зафиксировать все изменения транзакции |
| `rollback()` | Отменить все незакоммиченные изменения |
| `release()` | Вернуть соединение в пул или закрыть его |
| `context(values)` | Установить дополнительные переменные контекста адаптера; обычному HTTP-обработчику не требуется |

Методам `connect.query` и `connect.broker` повторно передавать HTTP-контекст не нужно: он задан при получении соединения.

## Шаблон операции

```js
const connect = await dbapi.getConnect(context);
try {
  await connect.begin();
  await connect.broker('company.employee.upd', employee);
  await connect.broker('company.employee_contact.add', contact);
  await connect.commit();
} catch (error) {
  await connect.rollback();
  throw error;
} finally {
  await connect.release();
}
```

`commit` выполняется только после успеха всех вызовов. `rollback` находится в `catch`, а освобождение соединения — в `finally`, поэтому срабатывает и при успехе, и при ошибке. Преобразование ошибки в HTTP-ответ можно оставить внешнему обработчику.

Не вызывай внутри этого блока `dbapi.broker`: он откроет другое соединение и отдельную транзакцию. Используй именно `connect.broker`.

## Родитель и изменённые дочерние строки

Для сохранения сотрудника и контактов входной контракт может иметь форму:

```json
{
  "employee": { "id": 42, "lastname": "Волкова" },
  "contacts": {
    "del": [{ "id": 7 }],
    "upd": [{ "id": 8, "contact": "anna@example.test" }],
    "add": [{ "contact_type": 1, "contact": "+7 900 000-00-00" }]
  }
}
```

Сначала сохраняется родитель. Его идентификатор нужен новым дочерним строкам. Затем обрабатываются удаления, изменения и добавления. Удаление перед добавлением позволяет заменить запись с тем же уникальным ключом в пределах одной операции.

<details class="docs-code">
<summary>Сохранение сотрудника и контактов одной транзакцией</summary>

```js
export async function saveEmployee(context, { employee, contacts = {} }) {
  const connect = await dbapi.getConnect(context);
  try {
    await connect.begin();
    const result = await connect.broker(
      employee.id ? 'company.employee.upd' : 'company.employee.add', employee
    );
    const id = employee.id ?? result.data.id;
    for (const row of contacts.del ?? []) {
      await connect.broker('company.employee_contact.del', { id: row.id });
    }
    for (const row of contacts.upd ?? []) {
      await connect.broker('company.employee_contact.upd', row);
    }
    for (const row of contacts.add ?? []) {
      await connect.broker('company.employee_contact.add', { ...row, employee_id: id });
    }
    await connect.commit();
    return { id };
  } catch (error) {
    await connect.rollback();
    throw error;
  } finally {
    await connect.release();
  }
}
```

</details>

Идентификатор родителя для новой дочерней записи устанавливает сервер. Контракт конкретного раздела определяет допустимые поля, принадлежность записи и проверку прав; HTTP-обработчик не заменяет эти проверки предварительным запросом.

На клиенте новый снимок `pl-data-observer` принимается после успешного ответа и загрузки сохранённых данных. Если транзакция откатилась, введённые значения и журнал изменений остаются в форме для исправления ошибки.

## Транзакция serverEndpoints

Исполнитель `action` начинает транзакцию, выполняет `@main`, обходит вложенные обработчики и затем делает commit. Исключение в любом действии приводит к rollback. Для одного PostgreSQL-провайдера это даёт атомарное сохранение родителя и детей.

`out: 'id'` переносит идентификатор результата основного действия в аргументы. Вложенный обработчик получает его через `/id`. Синтаксис и пример приведены в [serverEndpoints](/nfjs/server-endpoints).

Если действия используют несколько провайдеров, исполнитель открывает отдельную транзакцию у каждого. Это не общая распределённая транзакция: частично завершённый commit требует прикладного решения. Для атомарной записи связанных строк держи их в одном провайдере.

## Что проверить

1. Успешная операция сохраняет родителя и всех изменённых детей.
2. Ошибка в последнем дочернем действии откатывает изменение родителя и предыдущих детей.
3. Повторное чтение после ошибки возвращает прежнее состояние базы.
4. Соединение освобождается в обеих ветках.
5. Форма после ошибки сохраняет введённые значения и позволяет повторить сохранение.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://github.com/nf-framework/nf-back/blob/main/lib/dbapi.js" target="_blank" rel="noopener">Connect</a>
  <a href="https://github.com/nf-framework/nf-back/blob/main/src/endpoint-action.js" target="_blank" rel="noopener">Транзакция исполнителя FSE</a>
</footer>
