# pl-tooltip

Подсказка около целевого элемента. Показывается после наведения с задержкой 500 мс; может также открываться явно, следовать за указателем и содержать шаблон.

Пакет: `@plcmp/pl-tooltip`.

## Подключение

```js
import '@plcmp/pl-tooltip';
```

## Текстовая подсказка

Наведи указатель на кнопку или нажми её для явного открытия. Вторая строка показывает обёртку `pl-tooltip-target`.

<div class="demo"><pl-doc-tooltip-demo></pl-doc-tooltip-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-button id="target" label="Отчёт"></pl-button>
<pl-tooltip target="[[$.target]]" text="Сотрудники выбранного отдела"></pl-tooltip>
```

Без `target` целью становится родительский элемент подсказки. Укажи цель до подключения: обработчик наведения связывается с ней в `connectedCallback`.

## Шаблон содержимого

```html
<pl-tooltip target="[[$.target]]" keep-hover>
  <template>
    <strong>[[employee.name]]</strong>
    <div>[[employee.department]]</div>
  </template>
</pl-tooltip>
```

Вложенный `<template>` обрабатывается в шаблоне Polylib. `keep-hover` позволяет перевести указатель с цели на подсказку.

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/tooltip.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `text` | `String` | `undefined` | Текст стандартного шаблона. |
| `target` | `Object` | `undefined` | Целевой элемент; без значения используется родитель. |
| `followCursor` | `Boolean` | `undefined` | Перемещает открытую подсказку за указателем. |
| `keepHover` | `Boolean` | `undefined` | Сохраняет подсказку при переводе указателя на неё. |
| `contentTemplate` | `Object` | `undefined` | Объявлено, но не используется для выбора шаблона; передавай вложенный `<template>`. |
| `visible` | `Boolean` | `undefined` | Унаследованное состояние видимости. |
| `direction` | `String` | `'down'` | Предпочтительное направление. |
| `allowDirections` | `Array` | `все направления` | Порядок поиска положения. |
| `topLayer` | `Boolean` | `true` | При подключении всегда включается верхний слой браузера. |

## Методы и оформление

| Метод | Описание |
| --- | --- |
| `show(target, contexts)` | Показывает подсказку; второй аргумент — дополнительные контексты шаблона. |
| `hide()` | Скрывает подсказку. |
| `reFit(target, container)` | Пересчитывает положение, унаследован от `pl-popover`. |

Для создания из JavaScript экспортируется `createTooltip(template, contexts)`. Он возвращает элемент; его нужно добавить в DOM до показа. Пустой шаблон без размеров не открывается.

## pl-tooltip-target

`pl-tooltip-target` связывает содержимое обёртки с текстовой подсказкой. Используй его, если не нужно передавать `target` отдельному `pl-tooltip`.

```html
<pl-tooltip-target text="Отчёт доступен после выбора отдела">
  <span>Наведи указатель на эту строку</span>
</pl-tooltip-target>
```

В обычный слот можно поместить текст, кнопку или другой элемент. Компонент создаёт внутреннюю цель и связывает её с `pl-tooltip`. Пакет `@plcmp/pl-tooltip` регистрирует оба компонента.

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `text` | `String` | `undefined` | Текст подсказки. |
| `keepHover` | `Boolean` | `undefined` | Позволяет перевести указатель на подсказку. |
| `topLayer` | `Boolean` | `undefined` | Передаётся подсказке; `pl-tooltip` при подключении всё равно включает верхний слой. |

Обёртка использует `display: contents`, а целевой элемент — внутренний блочный контейнер. Учитывай это в строчной раскладке. Для пользовательского шаблона, явного открытия или отслеживания указателя используй `pl-tooltip`.

## Стилизация

Часть `outerBox` позволяет оформить поверхность подсказки. Размести правило в стилях компонента, который использует `pl-tooltip`:

```css
pl-tooltip::part(outerBox) {
  padding: var(--pl-space-md);
  color: var(--pl-text-color);
  background: var(--pl-background-color);
  border: 1px solid var(--pl-grey-light);
  border-radius: var(--pl-border-radius);
}
```

Правила из CSS страницы не пересекают Shadow DOM владельца. Для `pl-tooltip`, созданного внутри таблицы, добавляй оформление через `<template is="extra styles">` самой таблицы.

Наведение — основной встроенный триггер; для клавиатуры и сенсорного сценария владелец вызывает `show()` и `hide()` явно, как кнопка в примере.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-tooltip/pl-tooltip-target.js" target="_blank" rel="noopener">pl-tooltip-target.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-tooltip/pl-tooltip.js" target="_blank" rel="noopener">pl-tooltip.js</a>
</footer>
