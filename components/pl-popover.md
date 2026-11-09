# pl-popover

Основа для позиционирования всплывающего содержимого около элемента или точки. Оформление, скрытие по атрибуту и условия закрытия задаёт владелец.

Пакет: `@plcmp/pl-popover`.

## Подключение

```js
import '@plcmp/pl-popover';
```

## Карточка около кнопки

Кнопка открывает карточку в верхнем слое браузера. Карточка закрывается явной командой.

<div class="demo"><pl-doc-popover-demo></pl-doc-popover-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

`PlPopover` предоставляет позиционирование, но не содержит шаблона для вывода содержимого. Создай подкласс со слотом и оформлением:

```js
import { html, css } from 'polylib';
import { PlPopover } from '@plcmp/pl-popover';

class PlEmployeePopover extends PlPopover {
  static template = html`<slot></slot>`;
  static css = css`
    :host {
      display: none;
      position: absolute;
      inset: unset;
      margin: 0;
      padding: var(--pl-space-lg);
      background: var(--pl-surface-color);
      border: 1px solid var(--pl-grey-light);
    }
    :host([visible]) { display: block; }
  `;
}
customElements.define('pl-employee-popover', PlEmployeePopover);
```

В шаблоне владельца:

```html
<pl-button id="anchor" label="Сведения" on-click="[[show]]"></pl-button>
<pl-employee-popover id="popup" top-layer direction="down">
  <strong>Анна Смирнова</strong>
  <pl-button label="Закрыть" on-click="[[hide]]"></pl-button>
</pl-employee-popover>
```

```js
show() { this.$.popup.show(this.$.anchor); }
hide() { this.$.popup.hide(); }
```

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/popover.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `visible` | `Boolean` | `undefined` | Состояние видимости; отражается атрибутом. |
| `topLayer` | `Boolean` | `undefined` | Включает браузерный Popover API при подключении элемента. |
| `direction` | `String` | `'down'` | Первое направление для расчёта. |
| `allowDirections` | `Array` | [Все направления](/components/pl-dropdown?id=Направления) | Запасные направления, если окно не помещается в основном направлении. |

## Методы и размещение

| Метод | Описание |
| --- | --- |
| `show(target, container)` | Показывает и размещает содержимое около элемента или `DOMPoint`. |
| `hide()` | Скрывает содержимое. |
| `reFit(target, container)` | Пересчитывает положение; без `container` использует границы окна. |

Направления совпадают с [pl-dropdown](/components/pl-dropdown). `top-layer` нужно задать до подключения: свойство используется в `connectedCallback`. При верхнем слое компонент не обрезается `overflow` родителя.

В компоненте нет встроенного оформления, автоматического закрытия снаружи и подписки на прокрутку. Если цель перемещается, повтори `reFit()`. Для меню с этими обработчиками используй `pl-dropdown`; для подсказки — [pl-tooltip](/components/pl-tooltip).

## Стилизация

`PlPopover` задаёт позиционирование, а оформление принадлежит созданному тобой подклассу. В его `static css` используй `:host`; в CSS владельца — зарегистрированный тег. Для класса из примера выше это `pl-employee-popover`:

```css
pl-employee-popover {
  padding: var(--pl-space-md);
  color: var(--pl-text-color);
  background: var(--pl-background-color);
  border: 1px solid var(--pl-grey-light);
  border-radius: var(--pl-border-radius);
}
```

Показ и скрытие через `:host([visible])` задаются в подклассе, как в примере подключения. Положение `left` и `top` рассчитывает `reFit()`; не закрепляй их вручную. Публичных частей `part` у базового компонента нет. Собственные классы карточки оформляй там, где создаётся её разметка.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-popover/pl-popover.js" target="_blank" rel="noopener">pl-popover.js</a>
</footer>
