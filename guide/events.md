# События

Атрибут `on-<имя-события>` связывает событие DOM с методом компонента. В обработчик передаётся объект события.

## Подключение обработчика

Передай ссылку на метод через биндинг:

```html
<button on-click="[[save]]">Сохранить</button>
```

```js
save(event) {
  // Сохранение данных по нажатию кнопки.
}
```

Указывай имя метода без скобок и аргументов. Выражение `[[save(row.id)]]` вычисляется как обычный биндинг: оно вызывает метод при обновлении зависимостей, а его результат пытается использовать как обработчик. Для аргументов текущей строки используй `event.model`, как показано ниже.

## Как преобразуются имена

Polylib убирает префикс `on-` и преобразует оставшееся имя из записи с дефисами в camelCase: `row-selected` становится `rowSelected`. Это правило действует и для стандартных, и для пользовательских событий.

| Атрибут шаблона | Имя события, которое слушает Polylib | Что должно быть отправлено |
| --- | --- | --- |
| `on-click` | `click` | Обычное событие `click` |
| `on-mousedown` | `mousedown` | Обычное событие `mousedown` |
| `on-mouse-down` | `mouseDown` | Событие `mouseDown`; браузерное `mousedown` имеет другое имя |
| `on-row-selected` | `rowSelected` | Пользовательское событие `rowSelected` |
| `on-value-changed` | `valueChanged` | Событие `valueChanged`; событие изменения свойства `value-changed` сюда не подходит |

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

**Неправильно: отправлять имя с дефисом, когда обработчик ждёт camelCase**

```js
this.dispatchEvent(new CustomEvent('row-selected'));
```

Обработчик `on-row-selected` подписан на `rowSelected`, поэтому событие `row-selected` его не вызовет.

## Контекст повторения

Внутри `d:repeat` текущая запись доступна через `event.model.item`; при `d:as="row"` — через `event.model.row`. Вложенные повторы добавляют свои именованные записи в ту же модель.

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

**Правильно: прочитать текущую строку по имени из `d:as`**

```js
const row = event.model.row;
```

**Неправильно: извлекать строку из DOM ради контекста повтора**

```js
const id = event.target.dataset.id;
```

Используй имя, объявленное в `d:as`: при перестановке строк оно продолжает указывать на текущую запись. Обновляй состояние через `set`, чтобы связанные шаблоны получили уведомление.

## События изменения свойства

Двусторонний биндинг свойства и `on-*` работают по разным правилам. `{{value}}` подписывается на точное событие изменения свойства `value-changed` и передаёт изменение в свойство родителя. Атрибут `on-value-changed` пройдёт `fromDashed()` и подпишется на `valueChanged`, поэтому он не поймает `value-changed`.

```html
<pl-input value="{{search}}"></pl-input>
<button on-click="[[clearSearch]]">Очистить</button>
```

Для обычной синхронизации значения используй `{{value}}`. Когда нужен именно обработчик дефисного DOM-события, подпишись на его точное имя через `addEventListener` и сними подписку при отключении элемента:

<details class="docs-code">
<summary>Код JavaScript</summary>

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

</details>

Стрелочная функция хранит `this` компонента: обычный метод, переданный в `addEventListener`, вызвался бы с `this`, равным целевому элементу.

## Ограничения

* Именованные записи в `event.model` доступны обработчикам внутри соответствующего повтора.

* У пользовательского события задай `bubbles: true` для всплытия и `composed: true` для прохождения границы Shadow DOM. Это стандартные свойства `CustomEvent`.

* Подписка `on-*` обновляется при изменении связанного обработчика. Свои подписки на `window`, `document` и другие внешние объекты снимай в `disconnectedCallback`.

См. также: [биндинги](/guide/bindings), [шаблоны](/guide/templates), [жизненный цикл](/guide/lifecycle).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/polylib/engine/v1/template.js" target="_blank" rel="noopener">template.js</a>
  <a href="https://cdn.jsdelivr.net/npm/polylib/common.js" target="_blank" rel="noopener">common.js</a>
</footer>
