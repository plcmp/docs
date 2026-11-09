# pl-calendar

Календарная сетка месяца. `date` определяет показанный месяц, `selected` — подсвеченный день. Выбор передаётся через событие, поэтому владелец сам обновляет `selected`.

Пакет: `@plcmp/pl-datetime`.

## Подключение

```js
import '@plcmp/pl-datetime/pl-calendar.js';
import '@plcmp/pl-datetime/pl-datetime-month-selector.js';
import '@plcmp/pl-datetime/pl-datetime-year-selector.js';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-iconset-default';
```

## Выбор дня и навигация

Переключи месяц стрелками, затем выбери день. 12 и 13 ноября исключены через `restricted`.

<div class="demo"><pl-doc-calendar-demo></pl-doc-calendar-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-calendar id="calendar" date="[[month]]" selected="[[selected]]"
  restricted="[[restricted]]"></pl-calendar>
```

Для события используй точное имя `on-day-click`. Запись `on-on-day-click` в шаблоне преобразуется в другое имя; правила преобразования описаны в [событиях](/guide/events).

```js
this.$.calendar.addEventListener('on-day-click', event => {
  this.selected = event.detail.day.toDate();
});
```

В полном примере обработчик сохраняется в поле и снимается при отключении компонента.

[Код примера](../demos/calendar.js ':include :type=code javascript')

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `date` | `Date` | `new Date()` | Месяц для отображения. |
| `selected` | `Date` | `null` | Подсвеченный день. |
| `min` | `Date` | `null` | Первый доступный день. |
| `max` | `Date` | `null` | Последний доступный день. |
| `restricted` | `Array` | `[]` | Массив запрещённых дат. |
| `marked` | `Array` | `[]` | Объявлено в API, но отрисовка отметок не реализована. |

## События

| Событие | Данные | Описание |
| --- | --- | --- |
| `on-day-click` | `event.detail.day` | Объект Day.js выбранного дня; `.toDate()` возвращает `Date`. Событие всплывает и пересекает Shadow DOM. |

Календарь сам не присваивает новое `selected`. Передача `selected="{{selected}}"` без обработчика выбора не заменяет этот контракт. Недоступные дни блокируются указателем; проверку сохраняемого значения выполняет форма.

## Переключение месяца и года

В примере `pl-datetime-month-selector` и `pl-datetime-year-selector` меняют общее свойство `month`. Календарь получает его через одностороннюю привязку и перерисовывает сетку дней. Выбранный день хранится отдельно в `selected`.

```html
<pl-datetime-month-selector date="{{month}}"></pl-datetime-month-selector>
<pl-datetime-year-selector date="{{month}}"></pl-datetime-year-selector>
<pl-calendar date="[[month]]" selected="[[selected]]"></pl-calendar>
```

### pl-datetime-month-selector

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `date` | `Date` | `null` | Показанный месяц. Стрелки присваивают новую дату; переход через декабрь меняет год. Без значения отсчёт начинается с текущей даты. |

### pl-datetime-year-selector

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `date` | `Date` | `new Date()` | Показанный год. Стрелки присваивают новую дату. |
| `min` | `Date` | `null` | Объявлено, но не ограничивает переходы стрелками. |
| `max` | `Date` | `null` | Объявлено, но не ограничивает переходы стрелками. |

Допустимые дни задавай через `min`, `max` и `restricted` самого календаря. Переключатели отвечают за навигацию; проверку итогового значения выполняет форма.

## Стилизация

CSS размещай в стилях формы, которая использует календарь. Компонент рисует сетку внутри Shadow DOM и не публикует `part`; извне задавай размер хоста и наследуемые переменные темы.

```css
pl-calendar {
  width: max-content;
  --pl-base-size: 36px;
}
```

Селекторы месяца и года — отдельные внутренние компоненты без опубликованных `part`; для расположения календаря используй внешний контейнер. Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-datetime/pl-datetime-month-selector.js" target="_blank" rel="noopener">pl-datetime-month-selector.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-datetime/pl-datetime-year-selector.js" target="_blank" rel="noopener">pl-datetime-year-selector.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-datetime/pl-calendar.js" target="_blank" rel="noopener">pl-calendar.js</a>
</footer>
