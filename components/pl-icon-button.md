# pl-icon-button

Компактная кнопка со значком. Подходит для действия с понятным изображением; добавляй текстовую подсказку и доступное имя.

Пакет: `@plcmp/pl-icon-button`.

## Подключение

```js
import '@plcmp/pl-icon-button';
```

Компонент импортирует `pl-icon`. Зарегистрируй набор `demo` до вывода кнопок. Также нужны переменные темы.

## Варианты

<div class="demo">
  <pl-flex-layout wrap>
    <pl-icon-button variant="primary" iconset="demo" icon="settings" title="Настройки" aria-label="Настройки"></pl-icon-button>
    <pl-icon-button variant="secondary" iconset="demo" icon="download" title="Скачать" aria-label="Скачать"></pl-icon-button>
    <pl-icon-button variant="ghost" iconset="demo" icon="search" title="Найти" aria-label="Найти"></pl-icon-button>
    <pl-icon-button variant="link" iconset="demo" icon="settings" title="Дополнительные настройки" aria-label="Дополнительные настройки"></pl-icon-button>
  </pl-flex-layout>
</div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-icon-button variant="primary" iconset="demo" icon="settings"
  title="Настройки" aria-label="Настройки"></pl-icon-button>
```

Для другого оформления меняй `variant`: `primary`, `secondary`, `ghost`, `link`. Атрибут `negative` включает негативную палитру.

## Состояния

<div class="demo">
  <pl-flex-layout wrap>
    <pl-icon-button disabled iconset="demo" icon="download" title="Скачивание недоступно" aria-label="Скачивание недоступно"></pl-icon-button>
    <pl-icon-button loading iconset="demo" icon="search" title="Выполняется поиск" aria-label="Выполняется поиск"></pl-icon-button>
  </pl-flex-layout>
</div>

```html
<pl-icon-button disabled iconset="demo" icon="download"
  title="Скачивание недоступно" aria-label="Скачивание недоступно"></pl-icon-button>
<pl-icon-button loading iconset="demo" icon="search"
  title="Выполняется поиск" aria-label="Выполняется поиск"></pl-icon-button>
```

`loading` подавляет распространение клика и меняет курсор. `animated` запускает анимации внутри SVG, если они есть; статический SVG от этого не начинает вращаться.

## Набор иконок через pl-iconset

Набор регистрируется один раз до создания кнопок. Каждая группа SVG получает имя `id`; `pl-icon` выбирает её по свойствам `iconset` и `icon`.

<div class="demo">
  <pl-flex-layout wrap align="center">
    <pl-icon iconset="demo" icon="search" size="24" title="Поиск"></pl-icon>
    <pl-icon iconset="demo" icon="download" size="24" title="Скачать"></pl-icon>
    <pl-icon iconset="demo" icon="settings" size="24" title="Настройки"></pl-icon>
    <pl-icon iconset="demo" icon="plus" size="24" title="Добавить"></pl-icon>
    <pl-icon iconset="demo" icon="check" size="24" title="Готово"></pl-icon>
  </pl-flex-layout>
</div>

<details class="docs-code">
<summary>Регистрация набора demo</summary>

[Регистрация набора demo](../assets/iconset.js ':include :type=code javascript')

</details>

`pl-iconset` читает группы после события `slotchange`. Дождись регистрации набора, затем создавай элементы `pl-icon`. В примере `currentColor` позволяет значку наследовать цвет кнопки; отдельная палитра ему не нужна.

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `iconset` | `String` | `undefined` | Имя загруженного набора; в примерах всегда `demo`. |
| `icon` | `String` | `undefined` | Имя значка в наборе. |
| `size` | `Number` | `'16'` | Размер значка в px. В исходнике начальное значение задано строкой; размер всей кнопки определяется темой. |
| `variant` | `String` | `'secondary'` | Вариант оформления: `primary`, `secondary`, `ghost` или `link`. |
| `disabled` | `Boolean` | `undefined` | Показывает отключённое состояние, исключает кнопку из перехода клавишей Tab и останавливает распространение клика. |
| `hidden` | `Boolean` | `undefined` | Скрывает кнопку. |
| `negative` | `Boolean` | `undefined` | Использует негативную палитру для опасного действия. |
| `loading` | `Boolean` | `undefined` | Показывает курсор ожидания и останавливает распространение клика; индикатор загрузки автоматически не добавляется. |
| `animated` | `Boolean` | `undefined` | Передаёт одноимённое свойство внутреннему `pl-icon` для анимации значка. |
| `tabindex` | `String` | `'0'` | Положение в последовательности фокуса. |

`title` и `aria-label` в примерах — стандартные HTML-атрибуты. Специальных слотов нет; обработчик команды задаётся через `on-click="[[handler]]"` в шаблоне родителя.

Компонент получает фокус, но не обрабатывает Enter и Space. Доступное имя само по себе не добавляет управление с клавиатуры.

## Стилизация

Квадрат кнопки — сам хост. Его сторона задаётся `--pl-base-size`, а размер SVG — свойством `size`. Это независимые настройки:

```css
pl-icon-button {
  --pl-base-size: 32px;
  --pl-border-radius: 6px;
}
```

При `size="16"` этот пример оставляет значок размером 16 px внутри кнопки 32 × 32 px. Цветовые состояния задавай через `variant` и `negative`; они используют цвета темы `--pl-primary-*` и `--pl-negative-*`. Внутренний `pl-icon` не экспортирован через `part`, поэтому внешний селектор `pl-icon-button pl-icon` его не выберет.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-icon-button/pl-icon-button.js" target="_blank" rel="noopener">pl-icon-button.js</a>
</footer>
