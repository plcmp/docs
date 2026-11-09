# Сохранение части формы

Если персональные данные и контакты сохраняются независимо, у каждой части должны быть собственные границы запроса и снимка. После сохранения фамилии изменённая электронная почта остаётся в редакторе и продолжает считаться несохранённой.

## Попробовать на сотруднике

Измени фамилию и контакт. Нажми «Сохранить данные»: флаг контактов останется включённым. Затем сохрани контакты и раскрой запрос — в нём будут только их изменения. Кнопка «Ошибка следующего запроса» позволяет проверить, что неуспешное сохранение оставляет правки на месте.

<div class="demo"><pl-doc-company-editor-demo></pl-doc-company-editor-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

Пример использует настоящие `pl-action`, `pl-dataset` и `pl-data-observer`. Учебный сервис хранит данные в памяти страницы. Персональные данные используют форму контракта `/employee/update` и `/employee/get`. Отдельная операция сохранения контактов — учебное расширение Demo-company: она принимает `{ employeeId, contacts: { add, upd, del, touch } }` и возвращает `{ data: { contacts } }` со всей сохранённой коллекцией.

## Общее сохранение в Demo-company

В `level2/employee_add.js` и `level3/employee/main.js` используется один запрос:

```js
const res = await this.$.aSave.execute({
  employee: this.employee,
  contacts: this.contacts._mutations
});
```

Обработчик `/employee/save` сохраняет сотрудника и применяет `contacts.add`, `contacts.upd`, `contacts.del` через broker в одной транзакции. Ответ содержит идентификатор сотрудника. Затем существующая форма перечитывает обе части и создаёт новые снимки.

Здесь частичной является **передача строк контактов**: неизменённые контакты в журнал не входят. Сам сотрудник всё равно участвует в команде. Передача только `{ contacts: ... }` в действующий `/employee/save` не подходит: обработчик ожидает `employee`.

## Независимые части

Для отдельной кнопки сохранения персональных данных используй `/employee/update`. Для отдельной кнопки контактов нужен контракт, сохраняющий только контакты указанного сотрудника.

| Часть | Наблюдатель | Что передаётся | Что обновить после успеха |
| --- | --- | --- | --- |
| Персональные данные | `obEmployee` | Объект `employee` | Только `employee`, затем его снимок |
| Контакты | `obContacts` | `employeeId` и журнал контактов | Только `contacts`, затем их снимок |

```html
<pl-data-observer id="obEmployee" data="{{employee}}"
  is-changed="{{employeeChanged}}"></pl-data-observer>
<pl-data-observer id="obContacts" data="{{contacts}}"
  is-changed="{{contactsChanged}}"></pl-data-observer>

<pl-action id="aUpdate" endpoint="/employee/update"></pl-action>
<pl-action id="aGet" endpoint="/employee/get"></pl-action>
<pl-action id="aSaveContacts" endpoint="[[contactsSaveEndpoint]]"></pl-action>
```

`contactsSaveEndpoint` — объявленное свойство формы с адресом отдельной операции. Его контракт должен явно определять владельца контактов, операции над строками и результат сохранения.

## Принять ответ только своей части

Фрагмент сохранения персональных данных. `employeeSaving`, `employeeError` и остальные используемые поля объявляются в `static properties`; редактирование этой части блокируется на время операции:

```js
async saveEmployee() {
  if (this.employeeSaving) return;
  this.employeeSaving = true;
  this.employeeError = '';
  try {
    await this.$.aUpdate.execute(this.employee);
    // Контракт обновления не обещает полную модель: перечитываем эту часть.
    this.employee = await this.$.aGet.execute({ employeeId: this.employee.id });
    this.$.obEmployee.snapshot();
  } catch (error) {
    this.employeeError = error.message;
  } finally {
    this.employeeSaving = false;
  }
}
```

Контакты здесь не перечитываются и их снимок не меняется. Если операция сразу возвращает полную сохранённую модель, примени её без дополнительного чтения.

Для контактов учебный контракт возвращает полную коллекцию с назначенными сервером идентификаторами:

```js
const result = await this.$.aSaveContacts.execute({
  employeeId: this.employee.id,
  contacts: this.contacts._mutations
});
this.splice('contacts', 0, this.contacts.length, ...result.contacts);
this.$.obContacts.snapshot();
```

Dataset сохраняет владение своим `ControlledArray`: заменяется содержимое коллекции. Только после применения ответа новый снимок становится исходным. До успеха не очищай журнал и не вызывай `reset()`.

## Правки во время запроса

Самый прямой вариант — блокировать сохранение и поля только отправленной части до завершения операции. В примере контакты остаются доступны, пока сохраняются персональные данные, и наоборот.

Если ввод должен продолжаться и в сохраняемой части, потребуется отдельная модель запроса и учёт более поздних правок. Простое присваивание ответа и `snapshot()` примут эти новые правки за сохранённые или затрут их. Одного `pl-data-observer` для такого согласования недостаточно.

Аналогично при смене сотрудника во время запроса: проверь идентификатор и поколение запроса перед применением ответа. Запоздавший ответ предыдущей карточки не должен заменять текущую.

## Общий признак и закрытие

Родитель объединяет признаки независимых частей. Дополнительный наблюдатель над `{ employee, contacts }` для этого не нужен:

```js
hasChanges(employeeChanged, contactsChanged) {
  return employeeChanged || contactsChanged;
}

onClose() {
  if (this.employeeSaving || this.contactsSaving) return false;
  if (this.hasChanges(this.employeeChanged, this.contactsChanged)) {
    return this.showConfirm('Остались несохранённые изменения. Закрыть форму?');
  }
}
```

Проверку заполнения полей связывай с доступностью соответствующей команды. Не блокируй сохранение корректной части из-за незаполненного поля в другой независимо сохраняемой части — подробнее о [валидации](/integration/validation).

## Полный пример

[Редактор сотрудника и контактов](../demos/company-editor.js ':include :type=code javascript')

Следующий шаг — [личные карточки со своими действиями и вложенными периодами](/integration/nested-changes).
