# Жизненный цикл

Polylib создаёт Shadow DOM в конструкторе `PlElement`, а экземпляр шаблона подключает в `connectedCallback`. При удалении элемента `disconnectedCallback` отсоединяет экземпляр шаблона и запускает hooks контекста.

```js
class PlNotice extends PlElement {
  constructor() {
    super();
    // Инициализация, не требующая DOM.
  }

  connectedCallback() {
    super.connectedCallback();
    // DOM шаблона уже подключён после вызова super.
  }

  disconnectedCallback() {
    // Снять свои внешние подписки.
    super.disconnectedCallback();
  }
}
```

Вызов `super.connectedCallback()` необходим: он подключает шаблон и биндинги. В `disconnectedCallback` базовый миксин запускает hooks; сам `PlTemplateMixin` отсоединяет TemplateInstance. Сохраняй вызов базового метода при переопределении.

**Правильно: подключить базовый шаблон и снять свою подписку**

```js
connectedCallback() {
  super.connectedCallback();
  this.addEventListener('change', this.onChange);
}

disconnectedCallback() {
  this.removeEventListener('change', this.onChange);
  super.disconnectedCallback();
}
```

**Неправильно: пропустить базовое подключение**

```js
connectedCallback() {
  this.addEventListener('change', this.onChange);
}
```

## Асинхронные результаты

Ядро Polylib не управляет сетевыми запросами и не предотвращает применение устаревшего ответа. Если запрос выполняется компонентом, проверяй, что результат всё ещё относится к актуальным входным данным и экземпляру.

```js
_requestId = 0;

static properties = {
  record: { type: Object }
};

async loadFor(id) {
  const requestId = ++this._requestId;
  const result = await this.fetchRecord(id);
  if (requestId !== this._requestId || !this.isConnected) return;
  this.set('record', result);
}

disconnectedCallback() {
  this._requestId++;
  super.disconnectedCallback();
}
```

Здесь `fetchRecord` — условный метод приложения, не API Polylib. Проверка номера запроса не даёт позднему ответу затереть новое состояние; `isConnected` блокирует запись после отключения элемента.

## Ссылки на элементы

Элемент с `id` в своём шаблоне доступен через `this.$`:

```html
<pl-input id="titleInput" value="{{title}}"></pl-input>
```

```js
validateTitle() {
  return this.$.titleInput?.validate();
}
```

Обращайся к нему после подключения шаблона. Узел внутри `d:if` может ещё не существовать или быть удалён через `d:restamp`; не сохраняй его навсегда в отдельном поле. В повторяемом списке один `id` не определяет нужную строку — используй `event.model` в обработчике строки.

**Правильно: проверить актуальность и подключение элемента**

```js
applyResult(requestId, result) {
  if (requestId === this._requestId && this.isConnected) {
    this.set('record', result);
  }
}
```

**Неправильно: записать результат без проверки запроса**

```js
async load(id) {
  this.set('record', await this.fetchRecord(id));
}
```

## PlForm в NFJS

`PlForm` — интеграционный класс из `@nfjs/front-pl`, не класс ядра Polylib. Он загружает custom elements шаблона, после подключения вызывает `onConnect`, а методы `open` и `close` работают с менеджером форм NFJS. Подробнее — [формы и навигация](/integration/forms).

Держи сетевые команды, переходы маршрута и контракт формы на интеграционном уровне. Вычислительные функции биндинга оставляй чистыми и синхронными: [реактивность](/guide/reactivity).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/polylib/template-mixin.js" target="_blank" rel="noopener">template-mixin.js</a>
  <a href="https://cdn.jsdelivr.net/npm/polylib/engine/v1/ctx.js" target="_blank" rel="noopener">ctx.js</a>
</footer>
