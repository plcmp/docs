# pl-datetime

Поле даты или даты со временем. Объединяет маскированный ввод, календарь и часы. После пользовательского ввода `value` содержит объект `Date` либо `null`.

Пакет: `@plcmp/pl-datetime`.

## Подключение

```js
import '@plcmp/pl-datetime';
```

## Дата и время

Первое поле ограничено ноябрём; 12 и 13 ноября недоступны в календаре. Второе позволяет выбрать дату и время. Кнопка показывает обновление полей из состояния родителя.

<div class="demo"><pl-doc-datetime-demo></pl-doc-datetime-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-datetime label="Дата" type="date" value="{{date}}" required></pl-datetime>
<pl-datetime label="Начало встречи" type="datetime" value="{{meeting}}"></pl-datetime>
```

Инициализируй дату фабрикой, например `value: () => new Date(2026, 10, 16)`. Месяц в конструкторе `Date` начинается с нуля. Поле показывает локальную дату: `DD.MM.YYYY` или `DD.MM.YYYY HH:mm`. Формат серверного значения и часовой пояс определяет контракт приложения.

## Ограничения и проверка

`min` и `max` участвуют в проверке значения. В режиме `date` сравниваются календарные дни, в `datetime` — время целиком. `restricted` блокирует дни в календаре, но не входит в `validator()` ручного ввода: для полного запрета этих дат добавь проверку в контракт формы.

При обязательном поле свяжи `invalid` или используй [pl-valid-observer](/nfjs/validation). Неполный ввод не является готовой датой: `value` становится `null`.

[Код примера](../demos/datetime.js ':include :type=code javascript')

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `value` | `Date` | `undefined` | Выбранная дата; пустое значение — `null`. Вход также разбирается через Day.js. |
| `type` | `String` | `'date'` | `date` или `datetime`. |
| `label` | `String` | `undefined` | Подпись поля. |
| `required` | `Boolean` | `undefined` | Обязательный ввод. |
| `invalid` | `Boolean` | `undefined` | Результат проверки. |
| `min` | `Date` | `null` | Минимально допустимое значение. |
| `max` | `Date` | `null` | Максимально допустимое значение. |
| `restricted` | `Array` | `[]` | Недоступные дни в календаре. |
| `readonly` | `Boolean` | `undefined` | Запрещает редактирование и скрывает кнопки выбора. |
| `disabled` | `Boolean` | `undefined` | Отключает поле. |
| `hidden` | `Boolean` | `undefined` | Скрывает компонент. |
| `stretch` | `Boolean` | `undefined` | Занимает доступную ширину. |
| `orientation` | `String` | `undefined` | Расположение подписи. |
| `contentWidth` | `Number` | `undefined` | Ширина ввода в пикселях. |
| `labelWidth` | `Number` | `undefined` | Ширина подписи в пикселях. |
| `fitInto` | `Object` | `undefined` | Граница размещения выпадающего окна. |

## Слоты

| Слот | Описание |
| --- | --- |
| `prefix` | Содержимое до ввода. |
| `suffix` | Содержимое после ввода. |

## Методы

| Метод | Описание |
| --- | --- |
| `validator()` | Возвращает сообщение о нарушении `min`/`max` или `undefined`. Проверяет диапазон; обязательность проверяет вложенный ввод. |

## Календарь и выбор времени

Для встроенного в страницу календаря используй [pl-calendar](/components/pl-calendar): там показаны выбор дня и переключение месяца и года. Для отдельного выбора часов и минут — [pl-time-picker](/components/pl-time-picker).

## Стилизация

Для ширины поля используй `content-width` или `stretch`, для подписи — `label-width`. Эти настройки передаются внутреннему `pl-input`. Поле даты экспортирует его части, поэтому CSS владельца может оформить рамку, ввод и подпись:

```css
pl-datetime {
  --pl-content-width: 220px;
}

pl-datetime::part(input-container) {
  border-radius: 6px;
}

pl-datetime::part(native-input) {
  font-variant-numeric: tabular-nums;
}

pl-datetime::part(label) {
  font-weight: 600;
}
```

Кроме показанных частей доступна `labeled-container` — контейнер поля с подписью. Изменение `--pl-base-size` наследуется и полем, и календарём, поэтому для локальной правки только поля предпочитай `::part`.

Внутренние ячейки календаря и часы не экспортируют `part` наружу. Их основные подходы к оформлению описаны на страницах [календаря](/components/pl-calendar) и [выбора времени](/components/pl-time-picker).

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-datetime/pl-datetime.js" target="_blank" rel="noopener">pl-datetime.js</a>
</footer>
