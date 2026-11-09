# События

Атрибут `on-<имя-события>` связывает событие DOM с методом из контекста биндинга. При разборе шаблона Polylib убирает префикс `on-`, передаёт остаток в `fromDashed()` и подписывается на событие с получившимся именем. В ядре используется замена `/-[a-z\u00E0-\u00F6\u00F8-\u00FE-]/g`: дефис убирается, следующий символ переводится в верхний регистр. Например, `row-selected` превращается в `rowSelected`.

## Как преобразуются имена

| Атрибут шаблона | Имя события, которое слушает Polylib | Что должно быть отправлено |
| --- | --- | --- |
| `on-click` | `click` | Обычное событие `click` |
| `on-mousedown` | `mousedown` | Обычное событие `mousedown` |
| `on-mouse-down` | `mouseDown` | Событие `mouseDown`; браузерное `mousedown` имеет другое имя |
| `on-row-selected` | `rowSelected` | Пользовательское событие `rowSelected` |
| `on-value-changed` | `valueChanged` | Событие `valueChanged`; property-событие `value-changed` сюда не подходит |

Имена DOM-событий регистрозависимы. HTML приводит имена атрибутов к нижнему регистру, поэтому запись `on-rowSelected` станет `on-rowselected` и будет слушать `rowselected`. Для пользовательского camelCase-события пиши атрибут в dash-case и отправляй точное имя через `CustomEvent`. В браузерные имена дополнительные дефисы не вставляй: `on-mousedown`, `on-keydown`, `on-pointerdown`.

`rowSelected` ниже — пример контракта собственного компонента, это не событие Polylib или стандартного элемента:

```js
this.dispatchEvent(new CustomEvent('rowSelected', {
  detail: { row },
  bubbles: true,
  composed: true
}));
```

**Правильно: имя атрибута преобразуется в имя отправленного события**

```html
<pl-row-picker on-row-selected="[[handleRowSelected]]"></pl-row-picker>
```

**Обработчик события `rowSelected`**

```js
handleRowSelected(event) {
  this.set('selectedId', event.detail.row.id);
}
```

**Неправильно: отправлять дефисное имя, когда listener ждёт camelCase**

```js
this.dispatchEvent(new CustomEvent('row-selected'));
```

Обработчик `on-row-selected` подписан на `rowSelected`, поэтому событие `row-selected` его не вызовет.

```html
<button on-click="[[save]]">Сохранить</button>
```

```js
save(event) {
  // Метод вызван для события click.
}
```

Значением обработчика должна быть ссылка на функцию. Вызовы функций допустимы как вычисления биндинга, но для `on-*` указывай сам метод, без скобок и аргументов.

**Правильно: передать ссылку на обработчик**

```html
<button on-click="[[save]]">Сохранить</button>
```

**Неправильно: передать вызов метода как выражение обработчика**

```html
<button on-click="[[save(row.id)]]">Сохранить</button>
```

## Контекст повторения

Внутри `d:repeat` Polylib создаёт `event.model`. По умолчанию элемент доступен как `event.model.item`; при `d:as="row"` — как `event.model.row`. Вложенные повторы добавляют свои alias в ту же модель.

```html
<template d:repeat="[[rows]]" d:as="row">
  <button on-click="[[selectRow]]">[[row.title]]</button>
</template>
```

```js
selectRow(event) {
  this.set('selectedId', event.model.row.id);
}
```

**Правильно: прочитать текущую строку из alias повтора**

```js
const row = event.model.row;
```

**Неправильно: извлекать строку из DOM ради контекста повтора**

```js
const id = event.target.dataset.id;
```

При повторениях используй alias, объявленный в шаблоне; это устойчивее, чем индекс DOM или внешний поиск. Обновляй состояние через `set`, чтобы связанные шаблоны получили уведомление.

## Поля и команды

Двусторонний property-биндинг и `on-*` работают по разным правилам. `{{value}}` подписывается на точное property-событие `value-changed` и передаёт изменение в свойство родителя. Атрибут `on-value-changed` пройдёт `fromDashed()` и подпишется на `valueChanged`, поэтому он не поймает `value-changed`.

```html
<pl-input value="{{search}}"></pl-input>
<button on-click="[[clearSearch]]">Очистить</button>
```

Для обычной синхронизации значения используй `{{value}}`. Когда нужен именно обработчик дефисного DOM-события, подпишись на его точное имя через `addEventListener` и сними подписку при отключении элемента:

```js
import { html, PlElement } from 'polylib';
import '@plcmp/pl-input';

class PlValueField extends PlElement {
  static properties = {
    value: { type: String, value: '' }
  };

  static template = html`<pl-input id="field"></pl-input>`;

  constructor() {
    super();
    this._onValueChanged = event => {
      this.value = event.detail.value;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.field.addEventListener('value-changed', this._onValueChanged);
  }

  disconnectedCallback() {
    this.$.field.removeEventListener('value-changed', this._onValueChanged);
    super.disconnectedCallback();
  }
}

customElements.define('pl-value-field', PlValueField);
```

Стрелочная функция хранит `this` компонента: обычный метод, переданный в `addEventListener`, вызвался бы с `this`, равным целевому элементу.

События, биндинги и имя свойства описаны в [биндингах](/guide/bindings). Структура повторов — в [шаблонах](/guide/templates).

## Ограничения

* `event.model` появляется, если обработчик размещён внутри контекста повторения.
* Для пользовательских событий компонента продумай bubbling и `composed`, если событие должно пересечь границу Shadow DOM. Это стандартные свойства `CustomEvent`; Polylib не отправляет событие за компонент автоматически.
* Listener переустанавливается при изменении связанного обработчика. При удалении TemplateInstance Polylib отсоединяет DOM; пользовательские подписки на внешние объекты очищай в жизненном цикле.

См. [жизненный цикл](/guide/lifecycle) и [реактивность](/guide/reactivity).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/polylib/engine/v1/template.js" target="_blank" rel="noopener">template.js</a>
  <a href="https://cdn.jsdelivr.net/npm/polylib/common.js" target="_blank" rel="noopener">common.js</a>
</footer>
