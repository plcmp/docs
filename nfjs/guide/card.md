# Карточка и сохранение

Карточка получает `employeeId` при открытии, загружает сотрудника и связывает его поля с контролами. Новая запись начинается с пустого объекта и получает `id` после успешного сохранения.

![Карточка сотрудника с контактами](../../assets/images/nfjs/employee-card.png)

## 1. Объяви состояние

```js
static properties = {
  urlParams: { value: () => ['employeeId'] },
  employeeId: {},
  employee: { type: Object, value: () => ({ gender: 2 }) },
  contacts: { type: Array, value: () => [] },
  invalid: { type: Boolean, value: false },
  saving: { type: Boolean, value: false },
  employeeChanged: { type: Boolean },
  contactsChanged: { type: Boolean }
};
```

Фабрики `value` создают отдельные объект и массив для каждого экземпляра формы. `employeeId` — параметр навигации; `employee.id` — идентификатор загруженной записи. После создания они должны соответствовать одной записи.

## 2. Загрузи запись

| REST | serverEndpoints |
| --- | --- |
| `aGet` вызывает `/guide/employee/get` | `aGet` выполняет `action.aGet` в классе формы |
| Обработчик читает `context.body.args.employeeId` | Параметр `:employeeId` получает значение из аргументов действия |
| Отправляет `{ data: employee }` | Запрос `@main` возвращает первую запись |

Клиентский вызов одинаков:

```js
const employee = await this.$.aGet.execute({ employeeId: this.employeeId });
this.employee = employee;
this.$.obEmployee.snapshot();
```

Снимок принимается **после** загрузки: эти значения считаются сохранённым состоянием. В полной карточке сотрудник и контакты загружаются параллельно, затем оба наблюдателя получают новые снимки.

## 3. Свяжи поля и валидацию

```html
<pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
<pl-input label="Фамилия" value="{{employee.lastname}}" required></pl-input>
<pl-input label="Имя" value="{{employee.firstname}}" required></pl-input>
<pl-datetime label="Дата рождения" value="{{employee.birthdate}}" required></pl-datetime>
<pl-data-observer id="obEmployee" data="{{employee}}"
  is-changed="{{employeeChanged}}"></pl-data-observer>
```

Двусторонние биндинги обновляют свойства `employee`. `pl-valid-observer` собирает состояние обязательных полей; `pl-data-observer` сравнивает данные со снимком. Это разные задачи: корректные данные могут быть изменёнными, а неизменённые — не пройти текущую проверку формы.

Булевы свойства, передаваемые в вычисляемую функцию биндинга, имеют начальное значение `false`: при `undefined` Polylib может отложить её вычисление.

Кнопка сохранения отключается, когда `invalid` или `saving` истинны. `saving` связан с `executing` действия, поэтому повторный щелчок во время запроса не запускает ещё одно сохранение.

## 4. Сохрани и перечитай результат

### REST

```js
const result = await this.$.aSave.execute({
  employee: this.employee,
  contacts: this.contacts._mutations
});
this.employeeId = result.id;
await this.reload();
```

### serverEndpoints

```html
<pl-action id="aSave" paths="contacts" executing="{{saving}}"></pl-action>
```

```js
const result = await this.$.aSave.execute({
  ...this.employee,
  contacts: this.contacts
});
this.employeeId = result.id;
await this.reload();
```

В REST аргументы разделены на объект сотрудника и журнал контактов. В операции формы поля сотрудника лежат в корне, а `paths="contacts"` преобразует дочернюю коллекцию для вложенных действий. Формат выбирается по серверному контракту; это не взаимозаменяемые тела запроса.

`reload()` возвращает состояние из базы и принимает снимки. Если запрос завершился ошибкой, выполнение не доходит до перечитывания: введённые значения и признаки изменений остаются в форме.

## 5. Обработай закрытие

```js
onClose() {
  if (this.employeeChanged || this.contactsChanged) {
    return this.showConfirm('Закрыть карточку без сохранения изменений?');
  }
}
```

Проверяются обе области данных. После сохранения и принятия снимков подтверждение не нужно. При ошибке записи оно продолжает защищать несохранённый ввод.

## Проверь результат

1. Открой существующего сотрудника и измени отчество.
2. Удали обязательную фамилию: сохранение должно стать недоступным. Верни фамилию.
3. Сохрани карточку, закрой и открой заново: отчество должно сохраниться.
4. Измени поле и закрой карточку без сохранения: должно появиться подтверждение.
5. Через «Добавить сотрудника» заполни новую запись. После сохранения у неё появится `id`, а повторное сохранение должно изменить эту запись.

<details class="docs-code">
<summary>Полная карточка: REST</summary>

[REST](../../examples/nfjs/modules/demo-company-guide/forms/guide/rest/card.js ':include :type=code javascript')

</details>

<details class="docs-code">
<summary>Полная карточка: serverEndpoints</summary>

[serverEndpoints](../../examples/nfjs/modules/demo-company-guide/forms/guide/endpoints/card.js ':include :type=code javascript')

</details>

Дальше: [сотрудник и контакты](/nfjs/guide/relations).
