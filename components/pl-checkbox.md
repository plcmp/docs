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

## Двусторонняя привязка

Нажми флажок: состояние родительского элемента и подпись изменятся. Кнопка сбрасывает родительское свойство, и флажок обновляется через ту же связь.

<div class="demo"><pl-doc-checkbox-demo></pl-doc-checkbox-demo></div>

[Полный код работающего примера](../demos/checkbox.js ':include :type=code javascript')

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
| `checked` | `Boolean` | `undefined` | Текущее состояние; присвоенные `null` и `undefined` обрабатываются как неопределённое состояние |
| `caption` | `String` | `undefined` | Текст справа от флажка |
| `label` | `String` | `undefined` | Подпись контейнера |
| `orientation` | `String` | `undefined` | `horizontal` или `vertical`; без значения контейнер располагает подпись сверху |
| `disabled` | `Boolean` | `undefined` | Отключает взаимодействие указателем |
| `readonly` | `Boolean` | `undefined` | Запрещает изменение пользователем |
| `hidden` | `Boolean` | `undefined` | Скрывает элемент |

Для обычного двухпозиционного выбора явно задай `value: false` у связанного свойства родителя. В таблице `undefined` означает отсутствие начального значения в исходнике, а не отдельное значение `false`.

## Слоты

| Слот | Назначение |
| --- | --- |
| `label-prefix` | Содержимое перед подписью контейнера |
| `label-suffix` | Содержимое после подписи контейнера |

## События

| Событие | Описание |
| --- | --- |
| `checked-changed` | Уведомление Polylib об изменении свойства; биндинг `{{...}}` обрабатывает его автоматически |

## Ограничения

У компонента нет свойств `required`, `invalid`, `size` и отдельного `indeterminate`. Неопределённое состояние задаётся присваиванием `checked = null` или `undefined`; обычный клик переключает его в `true`.

У компонента нет встроенного управления с клавиатуры и `role="checkbox"`. Нельзя считать такой флажок полноценным обязательным полем только после добавления атрибута `required`.

Подробнее: [биндинги](/guide/bindings), [состояние и реактивность](/guide/reactivity).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-checkbox/pl-checkbox.js" target="_blank" rel="noopener">pl-checkbox.js</a>
</footer>
