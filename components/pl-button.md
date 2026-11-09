# pl-button

Кнопка запускает действие. Текст задаётся свойством `label` или содержимым слота по умолчанию.

Пакет: `@plcmp/pl-button`.

## Подключение

```js
import '@plcmp/pl-button';
```

Для размеров, цветов и типографики подключи переменные темы.

## Варианты

<div class="demo">
  <pl-flex-layout wrap>
    <pl-button variant="primary" label="Сохранить"></pl-button>
    <pl-button variant="secondary" label="Отмена"></pl-button>
    <pl-button variant="ghost" label="Подробнее"></pl-button>
    <pl-button variant="link" label="Открыть"></pl-button>
  </pl-flex-layout>
</div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-button variant="primary" label="Сохранить"></pl-button>
<pl-button variant="secondary" label="Отмена"></pl-button>
<pl-button variant="ghost" label="Подробнее"></pl-button>
<pl-button variant="link" label="Открыть"></pl-button>
```

`variant="link"` меняет оформление. Компонент остаётся кнопкой и сам не выполняет переход по URL.

## Негативное действие

<div class="demo"><pl-button negative variant="primary" label="Удалить"></pl-button></div>

```html
<pl-button negative variant="primary" label="Удалить"></pl-button>
```

`negative` переключает палитру на `--pl-negative-*`. Это оформление не добавляет подтверждение и не выполняет удаление само по себе.

## Значок в слоте

<div class="demo">
  <pl-button label="Настройки">
    <pl-icon slot="prefix" iconset="demo" icon="settings" size="16"></pl-icon>
  </pl-button>
</div>

```html
<pl-button label="Настройки">
  <pl-icon slot="prefix" iconset="demo" icon="settings" size="16"></pl-icon>
</pl-button>
```

Перед выводом кнопки подключи `pl-icon` и зарегистрируй выбранный набор значков.

## Загрузка и отключение

<div class="demo">
  <pl-flex-layout wrap>
    <pl-button loading label="Сохраняем…" variant="primary"></pl-button>
    <pl-button disabled label="Недоступно"></pl-button>
  </pl-flex-layout>
</div>

```html
<pl-button loading label="Сохраняем…" variant="primary"></pl-button>
<pl-button disabled label="Недоступно"></pl-button>
```

`loading` обозначает занятость и подавляет распространение клика. Он не рисует индикатор загрузки автоматически. Меняй подпись или содержимое слота, если нужно явно показать выполнение.

## Обработчик

Фрагмент шаблона `PlElement` или `PlForm`:

```html
<pl-button label="Сохранить" on-click="[[save]]" disabled="[[invalid]]"></pl-button>
```

`save` — метод экземпляра. Работающий пример с обработчиком и изменением состояния есть на странице [pl-checkbox](/components/pl-checkbox?id=Двусторонняя-привязка).

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `label` | `String` | `undefined` | Текст кнопки. |
| `variant` | `String` | `'secondary'` | Вариант оформления: `primary`, `secondary`, `ghost` или `link`. |
| `disabled` | `Boolean` | `undefined` | Отключённое состояние. |
| `hidden` | `Boolean` | `undefined` | Скрывает кнопку. |
| `negative` | `Boolean` | `undefined` | Негативная палитра. |
| `loading` | `Boolean` | `undefined` | Состояние выполнения. |

## Слоты

| Слот | Описание |
| --- | --- |
| По умолчанию | Содержимое кнопки; обычно используется вместо `label`. |
| `prefix` | Содержимое перед текстом. |
| `suffix` | Содержимое после текста. |

Событие действия — обычный `click`.

## Стилизация

Кнопка оформляет сам хост: у него находятся фон, рамка и размеры. CSS размещай в стилях формы или компонента-владельца. Для состояний используй `variant`, `negative` и `disabled`; размер можно изменить локально через `--pl-base-size`.

```css
pl-button {
  min-width: 120px;
  --pl-base-size: 32px;
}

pl-button::part(prefix),
pl-button::part(suffix) {
  opacity: 0.8;
}
```

Части `prefix` и `suffix` соответствуют слотам по краям текста. Собственный `pl-icon`, переданный в слот, доступен обычным селектором владельца; его цвет задаётся по правилам [pl-icon](/components/pl-icon). Основные цвета состояний кнопки берутся из семейства `--pl-primary-*`, скругление — из `--pl-border-radius`.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-button/pl-button.js" target="_blank" rel="noopener">pl-button.js</a>
</footer>
