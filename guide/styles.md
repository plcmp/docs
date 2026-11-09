# Стили

По умолчанию `PlElement` создаёт открытый Shadow DOM. Шаблон и стили компонента изолированы от обычных селекторов страницы; глобальные стили документа также не проникают внутрь Shadow DOM.

Стили задаются через `static css` и присоединяются к корню компонента при подключении:

```js
import { css, html, PlElement } from 'polylib';

class PlStatusBadge extends PlElement {
  static properties = { label: { type: String, value: '' } };

  static css = css`
    :host {
      display: inline-flex;
      align-items: center;
    }
  `;

  static template = html`<span>[[label]]</span>`;
}
```

`:host` выбирает сам custom element внутри его Shadow DOM. Применяй его для внешнего display, размеров и иных свойств самого компонента.

**Правильно: обратиться к корню элемента через `:host`**

```css
:host { display: block; }
```

**Неправильно: ожидать, что селектор документа попадёт внутрь Shadow DOM**

```css
body .status-badge span { color: red; }
```

Второй селектор работает только там, где DOM не изолирован shadow root. Для оформления содержимого задавай классы и селекторы в CSS самого компонента.

## Поверхности и темы

CSS Custom Properties наследуются через границу Shadow DOM. Поэтому токен, заданный приложением на предке или custom element, может использоваться внутри компонента:

```css
:host {
  color: var(--component-text-color, currentColor);
  padding: var(--component-padding, 0.5rem);
}
```

Компоненты `@plcmp/*` используют переменные `--pl-*`. Сам Polylib предоставляет механизм CSS и Shadow DOM; названия и значения переменных задаёт библиотека компонентов или приложение.

**Правильно: использовать переменную темы компонента**

```css
:host { color: var(--pl-text-color); }
```

**Неправильно: зафиксировать цвет, который должен меняться с темой**

```css
:host { color: #293142; }
```

Второй вариант жёстко связывает компонент с одним цветом и мешает теме приложения. Для своего компонента можно определить отдельные CSS-переменные с понятным назначением.

## Атрибуты и состояния

Селекторы атрибутов подходят для состояния, отражаемого в атрибут. `reflectToAttribute` на свойстве включает синхронизацию свойства с атрибутом; обычный `hidden` атрибут имеет стандартную семантику HTML.

```css
:host([disabled]) { opacity: 0.6; }
```

Разница между property и attribute — в [биндингах](/guide/bindings).

## Ограничения

* Поле `static css` принимает Polylib CSS-шаблон или `CSSStyleSheet`; поддержка adopted stylesheets зависит от браузера.
* В Shadow DOM селекторы страницы не стилизуют внутренние узлы напрямую.
* `:host` относится к Shadow DOM; `PlElement` можно создать с light DOM конфигурацией, и тогда изоляции нет.

См. [стайлгайд](/guide/style-guide), [модель Polylib](/guide/mental-model).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/polylib/engine/v1/properties.js" target="_blank" rel="noopener">properties.js</a>
  <a href="https://cdn.jsdelivr.net/npm/polylib/template-mixin.js" target="_blank" rel="noopener">template-mixin.js</a>
</footer>
