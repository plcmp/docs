# pl-checkbox

Флажок для независимого булевого выбора. Поле `checked` хранит состояние, `caption` — текст рядом с флажком, `label` — подпись внешнего контейнера.

Пакет: `@plcmp/pl-checkbox`.

## Подключение

```js
import '@plcmp/pl-checkbox';
```

## Простое использование

<div class="demo">
  <pl-checkbox caption="Показывать завершённые задачи" checked></pl-checkbox>
</div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-checkbox caption="Показывать завершённые задачи" checked></pl-checkbox>
```

## Подписи label и caption

`label` подписывает поле целиком, `caption` поясняет само переключаемое состояние. Их можно использовать вместе. По умолчанию подпись поля находится сверху; `orientation="horizontal"` переносит её слева.

<div class="demo demo-stack">
  <pl-checkbox label="Уведомления" caption="Получать письма о новых задачах" checked></pl-checkbox>
  <pl-checkbox label="Профиль" caption="Показывать контактный телефон" orientation="horizontal"></pl-checkbox>
</div>

```html
<pl-checkbox label="Уведомления" caption="Получать письма о новых задачах" checked></pl-checkbox>
<pl-checkbox label="Профиль" caption="Показывать контактный телефон" orientation="horizontal"></pl-checkbox>
```

## Двусторонняя привязка

Нажми флажок: состояние родительского элемента и подпись изменятся. Кнопка сбрасывает родительское свойство, и флажок обновляется через ту же связь.

<div class="demo"><pl-doc-checkbox-demo></pl-doc-checkbox-demo></div>

[Код примера](../demos/checkbox.js ':include :type=code javascript')

Используй `checked="{{enabled}}"`, когда пользователь меняет значение. Связь `[[enabled]]` передаёт состояние только вниз и не возвращает изменение родителю.

## Отключение и чтение

<div class="demo demo-stack">
  <pl-checkbox caption="Выбранное значение для чтения" checked readonly></pl-checkbox>
  <pl-checkbox caption="Недоступная настройка" checked disabled></pl-checkbox>
</div>

```html
<pl-checkbox caption="Выбранное значение для чтения" checked readonly></pl-checkbox>
<pl-checkbox caption="Недоступная настройка" checked disabled></pl-checkbox>
```

`readonly` сохраняет обычное оформление и запрещает переключение. `disabled` дополнительно меняет внешний вид. Эти свойства не проверяют права на сервере.

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `checked` | `Boolean` | `undefined` | Текущее состояние; присвоенные `null` и `undefined` обрабатываются как неопределённое состояние. |
| `caption` | `String` | `undefined` | Текст справа от флажка. |
| `label` | `String` | `undefined` | Подпись контейнера. |
| `orientation` | `String` | `undefined` | `horizontal` или `vertical`; без значения контейнер располагает подпись сверху. |
| `disabled` | `Boolean` | `undefined` | Отключает взаимодействие указателем. |
| `readonly` | `Boolean` | `undefined` | Запрещает изменение пользователем. |
| `hidden` | `Boolean` | `undefined` | Скрывает элемент. |

Для обычного двухпозиционного выбора явно задай `value: false` у связанного свойства родителя. В таблице `undefined` означает отсутствие начального значения в исходнике, а не отдельное значение `false`.

## Слоты

| Слот | Описание |
| --- | --- |
| `label-prefix` | Содержимое перед подписью контейнера. |
| `label-suffix` | Содержимое после подписи контейнера. |

## События

| Событие | Описание |
| --- | --- |
| `checked-changed` | Уведомление Polylib об изменении свойства; биндинг `{{...}}` обрабатывает его автоматически. |

## Ограничения

У компонента нет свойств `required`, `invalid`, `size` и отдельного `indeterminate`. Неопределённое состояние задаётся присваиванием `checked = null` или `undefined`; обычный клик переключает его в `true`.

У компонента нет встроенного управления с клавиатуры и `role="checkbox"`. Нельзя считать такой флажок полноценным обязательным полем только после добавления атрибута `required`.

Подробнее: [биндинги](/guide/bindings), [состояние и реактивность](/guide/reactivity).

## Стилизация

У флажка нет экспортированных частей `part`. Настраивай его через переменные на хосте; расположение подписи задавай свойством `orientation`.

```css
pl-checkbox {
  --pl-base-size: 32px;
  --pl-label-width: 160px;
  --pl-text-color: var(--pl-header-color);
}
```

`--pl-base-size` влияет и на высоту строки с `caption`, и на размер квадрата флажка. `--pl-label-width` задаёт ширину `label` при горизонтальном расположении. Цвет текста `caption` берётся из `--pl-text-color`, цвет выбранного состояния — из `--pl-primary-base`. Внутренние классы `.checkbox` и `.caption` недоступны из CSS владельца.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-checkbox/pl-checkbox.js" target="_blank" rel="noopener">pl-checkbox.js</a>
</footer>
