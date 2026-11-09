# pl-time-picker

Круговой выбор времени: сначала часы, затем минуты. Часы и минуты хранятся раздельно, календарная дата в этот компонент не входит.

Пакет: `@plcmp/pl-datetime`.

## Подключение

```js
import '@plcmp/pl-datetime/pl-time-picker.js';
```

## Часы и минуты

Выбери положение на циферблате. Кнопки позволяют отдельно переключить режим; после завершения выбора минут приходит `done`.

<div class="demo"><pl-doc-time-picker-demo></pl-doc-time-picker-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-time-picker value-hour="{{hour}}" value-minute="{{minute}}"
  mode="{{mode}}" on-done="[[timeSelected]]"></pl-time-picker>
```

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/time-picker.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `valueHour` | `Number` | `undefined` | Часы, от 0 до 23. |
| `valueMinute` | `Number` | `undefined` | Минуты, от 0 до 59. |
| `mode` | `String` | `'hours'` | `hours` или `minutes`. |
| `size` | `Number` | `192` | Диаметр расположения внешних цифр. |
| `sizeSmall` | `Number` | `136` | Диаметр внутреннего круга часов. |
| `value` | `String` | `undefined` | Объявлено, но не синхронизируется с часами и минутами. |

## События и размер

| Событие | Описание |
| --- | --- |
| `done` | Завершён выбор минут; событие не всплывает, слушатель ставится на сам компонент. |

Для изменения размера согласуй `size`, `sizeSmall` и CSS-переменную `--pl-datetime-clock-size`. `sizeSmall` не пересчитывается автоматически после изменения `size`. Для полноценного поля со вводом используй [pl-datetime](/components/pl-datetime).

## Стилизация

Размер циферблата задаётся CSS-переменной, а расположение цифр и обработка координат — свойствами `size` и `sizeSmall`. Меняй их согласованно:

```html
<pl-time-picker class="clock" size="220" size-small="164"
  value-hour="{{hour}}" value-minute="{{minute}}"></pl-time-picker>
```

```css
pl-time-picker.clock {
  --pl-datetime-clock-size: 220px;
}
```

`size` должен совпадать с размером хоста; для внутреннего кольца `sizeSmall` в этом примере меньше на 56 px. Одно изменение CSS-размера растянет область, но не пересчитает позиции цифр и координаты выбора. Циферблат не экспортирует части `part`; CSS владельца оформляет его хост, а не внутренние цифры и стрелку.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-datetime/pl-time-picker.js" target="_blank" rel="noopener">pl-time-picker.js</a>
</footer>
