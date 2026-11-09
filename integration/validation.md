# Валидация формы и субформ

Поля проверяют собственные значения, `pl-valid-observer` собирает их `invalid`, а форма связывает этот результат с доступностью команды. Бизнес-ограничения и права записи проверяет серверный контракт.

## Поля и общий результат

```html
<section>
  <pl-valid-observer invalid="{{employeeInvalid}}"></pl-valid-observer>
  <pl-input label="Фамилия" value="{{employee.lastname}}" required></pl-input>
  <pl-input label="Имя" value="{{employee.firstname}}" required></pl-input>
  <pl-button label="Сохранить" on-click="[[saveEmployee]]"
    disabled="[[saveBlocked(employeeInvalid, employeeSaving, employeeChanged)]]"></pl-button>
</section>
```

```js
saveBlocked(invalid, saving, changed) {
  return invalid || saving || !changed;
}
```

Свойства `employeeInvalid`, `employeeSaving`, `employeeChanged` объявляются на форме. Обязательность задаётся атрибутом `required` на самом контроле. Наблюдатель не делает необязательное поле обязательным.

## Границы наблюдения

По умолчанию контейнером служит родительский DOM-узел `pl-valid-observer`; при необходимости его задают свойством `targetContainer`. Наблюдатель слушает `validation-changed`, затем проверяет `invalid` элементов контейнера с задержкой 100 мс.

`pl-valid-observer` отслеживает удаление поля через lifecycle hook Polylib. Наблюдатель агрегирует состояние контролов, но не запускает их произвольную валидацию сам.

Контейнер не обходит Shadow DOM вложенной субформы. Дочерняя форма собирает свой `invalid` и передаёт его родителю явно:

```html
<pl-form-level3.employee.general employee="{{employee}}"
  invalid="{{employeeInvalid}}"></pl-form-level3.employee.general>
<pl-form-level3.employee.contacts contacts="{{contacts}}"
  invalid="{{contactsInvalid}}"></pl-form-level3.employee.contacts>
```

В каждой субформе объяви `invalid` и размести свой `pl-valid-observer`. Родитель может объединить результаты в helper для общей кнопки сохранения.

## Общая команда или отдельные команды

Если сотрудник и контакты сохраняются одной командой, её доступность зависит от обеих частей:

```js
saveAllBlocked(employeeInvalid, contactsInvalid, saving) {
  return employeeInvalid || contactsInvalid || saving;
}
```

Если части сохраняются независимо, кнопка персональных данных зависит только от их валидации, изменений и состояния запроса. Ошибка в несохраняемых контактах не должна блокировать корректное изменение фамилии. Такой вариант работает в [примере частичного сохранения](/integration/partial-save).

## Проверка непосредственно перед запросом

Изменение значения и обновление агрегированного `invalid` могут происходить в разные моменты. В обработчике команды проверяй поля через публичный `validate()`, если этот метод предусмотрен их API:

```js
await Promise.all([
  this.$.lastname.validate(),
  this.$.firstname.validate()
]);
if (this.$.lastname.invalid || this.$.firstname.invalid) return;
await this.$.aSave.execute(this.employee);
```

Здесь `lastname` и `firstname` — `id` полей `pl-input`. У разных контролов контракт валидации отличается. Например, `pl-checkbox` не поддерживает `required` и `invalid`; установка таких атрибутов не добавит проверку.

`pl-input` исключает `disabled`-поле из своего `invalid`. Не отключай поле перед `validate()`, если хочешь проверить его значение. В редакторах во время сохранения поля получают `readonly`, а кнопки — `disabled`: ввод блокируется, результат проверки сохраняется.

Скрытие уже созданной ветки `d:if` не исключает её поля из проверки. При пересоздании через `d:restamp` поля удаляются, а общий флаг обновляется с задержкой. Разбор — [скрытые поля и валидация](/guide/edge-cases?id=Скрытое-поле-остаётся-участником-валидации).

## Ошибка сервера

Отправляй запрос в `try/catch`, сохраняй введённые данные при отказе и оставляй наблюдатель изменений нетронутым. Ошибка операции не означает, что пользовательские правки нужно принять через `snapshot()` или убрать через `reset()`.

Повторный запрос запускается явным действием пользователя или изменением входных параметров чтения. Не связывай повторное выполнение с собственным `error` или `invalid`: это может создать цикл запросов.
