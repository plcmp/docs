# Модель Polylib

Polylib связывает состояние JavaScript-объекта с DOM шаблона. `PlElement` — базовый класс пользовательского элемента: он объединяет свойства и уведомления об изменениях, контекст данных и экземпляр шаблона.

## Три части элемента

* **Свойства** объявляются в `static properties`. Установленное значение свойства становится входом для биндингов и observers.
* **Шаблон** объявляется через `html`. Polylib разбирает его при создании `Template`, затем клонирует и подключает к DOM при `connectedCallback`.
* **Контекст** хранит пути данных и рассылает изменения биндингам. Для управляемых изменений используй `set`, `push`, `splice` и `assign`.

```js
import { html, PlElement } from 'polylib';

class PlUserCard extends PlElement {
  static properties = {
    user: { type: Object, value: () => ({ name: '' }) },
    rows: { type: Array, value: () => [] }
  };

  static template = html`<p>[[user.name]]</p>`;
}

customElements.define('pl-user-card', PlUserCard);
```

### Обновление состояния

**Правильно: обновить данные через контекст**

```js
this.set('user.name', 'Ася');
this.push('rows', { id: 2, title: 'Новая строка' });
```

**Неправильно: менять объект и массив напрямую**

```js
this.user.name = 'Ася';
this.rows.push({ id: 2, title: 'Новая строка' });
```

Второй вариант меняет объект или массив без уведомления контекста. Биндинги и observers могут оставить экран со старым значением. Для вложенного поля передавай путь в `set`; для коллекции используй методы контекста.

```js
this.assign('user', { name: 'Ася', role: 'редактор' });
this.splice('rows', index, 1);
```

`set(path, value)` назначает одно значение, `assign(path, object)` вызывает `set` для каждого поля, `push(path, value)` отправляет splice-уведомление о добавлении, `splice(path, index, count, ...items)` сообщает об изменении массива.

## Границы библиотеки

Polylib — браузерная библиотека Web Components. Она не задаёт серверный транспорт, маршруты приложения, формат API или бизнес-правила. Работу с сервером и навигацией добавляет [интеграция NFJS](/integration/forms).

Ядро предоставляет свойства, шаблоны, биндинги, observers, директивы `d:if` и `d:repeat`. Конкретные контракты разобраны в [реактивности](/guide/reactivity), [биндингах](/guide/bindings) и [шаблонах](/guide/templates).

### Ограничения

* Изменение обычного вложенного объекта само по себе не становится реактивным. Уведомляй контекст через его методы.
* Свойства Polylib не являются автоматически сериализуемой моделью или состоянием приложения.
* Для пользовательских Web Components имя тега должно содержать дефис по правилам браузера. Префикс `pl-` используется для единообразия имён в примерах.
* `PlForm`, загрузка форм, `open()` и `close()` принадлежат адаптеру NFJS `@nfjs/front-pl`, а не пакету Polylib.

Дальше: [реактивность](/guide/reactivity), [жизненный цикл](/guide/lifecycle), [стайлгайд](/guide/style-guide).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/polylib/pl-element.js" target="_blank" rel="noopener">pl-element.js</a>
  <a href="https://cdn.jsdelivr.net/npm/polylib/engine/v1/ctx.js" target="_blank" rel="noopener">ctx.js</a>
</footer>
