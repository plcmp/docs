# Состояние и реактивность

Polylib отслеживает присваивания объявленным свойствам и изменения через методы контекста. По уведомлению обновляются биндинги и вызываются наблюдатели — методы, которые реагируют на изменение данных. Затем компонент отправляет событие `<имя-свойства>-changed`.

## Объявление свойств

Описание свойства поддерживает `type`, `value`, `observer` и `reflectToAttribute`. Фабрика `value` вызывается при создании экземпляра, если тип свойства не `Function`.

```js
static properties = {
  title: { type: String, value: '' },
  profile: { type: Object, value: () => ({ name: '', city: '' }) },
  rows: { type: Array, value: () => [] },
  active: { type: Boolean, value: false, observer: 'activeChanged' }
};

activeChanged(value, oldValue, mutation) {
  // Реакция на изменение active.
}
```

Для массивов и объектов задавай фабрику. Так каждый экземпляр получает собственное значение.

`type` описывает свойство и участвует в обработке атрибутов, но не проверяет каждое JavaScript-присваивание. Например, `type: Number` не превращает любой вход в число. Приводи внешние значения к нужному типу на границе своего API.

Объявленное свойство уже имеет метод записи (setter): меняй `this.title`, не создавай поверх него поле класса `title = ''`. Повторное объявление вызывает ошибку создания экземпляра `Cannot redefine property`. Примеры — [конфликт поля класса и реактивного свойства](/guide/edge-cases?id=Поле-класса-конфликтует-с-реактивным-свойством).

**Правильно: создавать новое значение для каждого элемента**

```js
const settingsProperty = { type: Object, value: () => ({}) };
```

**Неправильно: переиспользовать объект из описания свойства**

```js
const settingsProperty = { type: Object, value: {} };
```

Если задать объект напрямую, несколько экземпляров могут получить одну ссылку. Изменение данных в одном экземпляре тогда затронет остальные.

## Обновление данных

```js
this.set('profile.name', 'Мира');
this.assign('profile', { name: 'Мира', city: 'Казань' });
this.push('rows', { id: 3, title: 'Третья' });
this.splice('rows', 0, 1, { id: 4, title: 'Замена' });
```

Прямые `obj.field = value`, `array.push(...)` и `array[index] = value` не уведомляют Polylib-контекст. Например, `this.rows.push(row)` может изменить данные, но не обновить повторяющийся DOM. Используй `push`, `splice` или `set`.

Корневой объект или массив должны существовать до вызова метода. `set('profile.name', value)` не создаёт отсутствующий `profile`. Для полной замены модели достаточно `this.profile = nextProfile`; для вложенной правки используй `set`. Присваивание той же ссылки повторного уведомления не даёт.

`assign` уведомляет о каждом поле отдельно, а `push` разворачивает переданный массив как набор элементов. Эти особенности, значение `oldValue` и работу одного объекта по нескольким путям смотри в [технических нюансах](/guide/edge-cases).

**Правильно: сообщить контексту об изменении вложенного поля**

```js
this.set('profile.name', nextName);
```

**Неправильно: присвоить вложенное поле напрямую**

```js
this.profile.name = nextName;
```

## Наблюдатели и вычисления

Одно свойство может иметь `observer: 'method'`. Для зависимости от нескольких путей объяви статический массив строк:

```js
static properties = {
  startDate: { type: String },
  endDate: { type: String },
  label: { type: String }
};

static observers = ['rangeChanged(startDate, endDate)'];

rangeChanged(startDate, endDate) {
  this.label = startDate && endDate ? `${startDate} — ${endDate}` : '';
}
```

Наблюдатель реагирует на уведомление об изменении. Начальное значение `value` само по себе не гарантирует вызов наблюдателя при подключении. Если нужна начальная операция, вызови её явно после подключения. Чистое отображение производного значения удобнее вычислять прямо в биндинге.

В `static observers` используется запись `имя(аргументы)`. Polylib не поддерживает `computed` в описании свойства: для производного значения используй наблюдатель или вызов функции в биндинге.

Функция, вызванная в биндинге, пересчитывается при изменениях перечисленных аргументов. Держи её чистой: одинаковые аргументы дают одинаковое значение, без записи в состояние и без сетевых запросов.

**Правильно: синхронно форматировать переданные значения**

```js
fullName(first, last) {
  return `${first} ${last}`;
}
```

**Неправильно: выполнять запрос внутри функции биндинга**

```js
async fullName(first, last) {
  return await fetch(`/name/${first}/${last}`);
}
```

Используй `[[fullName(firstName, lastName)]]` для локального форматирования. Функция биндинга не ожидает Promise; асинхронную операцию запускай в обработчике или интеграционном слое и записывай готовый результат в свойство.

См. также: [биндинги](/guide/bindings), [события](/guide/events), [асинхронная работа формы](/guide/lifecycle).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/polylib/engine/v1/properties.js" target="_blank" rel="noopener">properties.js</a>
  <a href="https://cdn.jsdelivr.net/npm/polylib/engine/v1/ctx.js" target="_blank" rel="noopener">ctx.js</a>
  <a href="https://cdn.jsdelivr.net/npm/polylib/template-mixin.js" target="_blank" rel="noopener">template-mixin.js</a>
</footer>
