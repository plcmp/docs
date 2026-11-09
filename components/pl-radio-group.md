# pl-radio-group

Группа взаимоисключающих вариантов. `selected` хранит `name` выбранного дочернего элемента. Поддерживает обычные радиопереключатели `pl-radio` и сегменты `pl-radio-button`.

Пакет: `@plcmp/pl-radio-group`.

## Подключение

```js
import '@plcmp/pl-radio-group';
import '@plcmp/pl-radio-button';
import '@plcmp/pl-radio-button/pl-radio.js';
```

## Выбор и обязательность

Выбери формат: кнопка «Применить» станет доступна. У двух групп независимое состояние. Режим чтения блокирует взаимодействие, сохраняя значения.

<div class="demo"><pl-doc-radio-demo></pl-doc-radio-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-radio-group label="Формат" selected="{{format}}" required>
  <pl-radio-button name="brief" label="Краткий"></pl-radio-button>
  <pl-radio-button name="full" label="Полный"></pl-radio-button>
</pl-radio-group>
```

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/radio.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `selected` | `String` | `undefined` | Имя выбранного дочернего варианта. |
| `label` | `String` | `undefined` | Подпись группы. |
| `orientation` | `String` | `undefined` | Расположение подписи в `pl-labeled-container`; не направление вариантов. |
| `required` | `Boolean` | `false` | Требует определённое `selected`. |
| `invalid` | `Boolean` | `false` | Результат проверки обязательности. |
| `disabled` | `Boolean` | `undefined` | Отключает взаимодействие и меняет оформление. |
| `readonly` | `Boolean` | `undefined` | Запрещает изменение указателем. |
| `hidden` | `Boolean` | `undefined` | Скрывает группу. |

## Слоты и проверка

| Слот | Описание |
| --- | --- |
| По умолчанию | Прямые дочерние `pl-radio` или `pl-radio-button`. |
| `label-prefix` | Перед подписью группы. |
| `label-suffix` | После подписи группы. |

| Метод | Описание |
| --- | --- |
| `validate()` | Обновляет `invalid` и отправляет `validation-changed`; проверку учитывает [pl-valid-observer](/nfjs/validation). |

При `required` отсутствие — `null` или `undefined`; пустая строка не считается отсутствием. Для сброса присвой `undefined` и используй уникальные непустые `name`.

## Варианты группы

`pl-radio-group` хранит выбор и синхронизирует дочерние флаги `selected`. Подключай используемый вариант явно, как в блоке импорта выше. Прямое переключение флага одного элемента не обеспечивает взаимоисключение всей группы.

### pl-radio

Обычный радиопереключатель с круглым индикатором.

```html
<pl-radio-group selected="{{choice}}" label="Вариант">
  <pl-radio name="first" label="Первый"></pl-radio>
  <pl-radio name="second" label="Второй"></pl-radio>
</pl-radio-group>
```

### pl-radio-button

Сегмент выбора с текстом. Крайние сегменты оформляет группа. Этот вариант показан в примере выше; слоты `prefix` и `suffix` позволяют добавить значки по сторонам текста.

### Свойства вариантов

Оба компонента используют один контракт:

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `String` | `undefined` | Значение, которое группа записывает в `selected`. |
| `selected` | `Boolean` | `undefined` | Признак выбранного варианта; им управляет группа. |
| `label` | `String` | `undefined` | Текст варианта. |

`disabled`, `readonly` и `required` задавай группе. У дочерних элементов этих свойств нет. Событие `radio-selected` сообщает группе о клике; для ручной подписки используй `addEventListener('radio-selected', ...)`, поскольку шаблонный `on-radio-selected` преобразует имя в `radioSelected`. Встроенной обработки стрелок и пробела у вариантов нет.

## Стилизация

Для размеров и цветов используй переменные темы на группе — они наследуются вариантами выбора. Внешний CSS может оформить хосты `pl-radio` и `pl-radio-button`; у обычного варианта дополнительно доступна часть `radio` — круг выбора.

```css
pl-radio-group {
  --pl-base-size: 32px;
  --pl-label-width: 160px;
}

pl-radio::part(radio) {
  border-width: 2px;
}

pl-radio-button {
  min-width: 100px;
}
```

У группы и `pl-radio-button` экспортированных частей нет. Сегменты передаются в слот группы, поэтому правило `pl-radio-button` действует на них из CSS владельца. Фон выбранного сегмента задаёт `--pl-primary-base`; форма скруглений первого и последнего сегментов определяется группой.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-radio-button/pl-radio.js" target="_blank" rel="noopener">pl-radio.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-radio-button/pl-radio-button.js" target="_blank" rel="noopener">pl-radio-button.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-radio-group/pl-radio-group.js" target="_blank" rel="noopener">pl-radio-group.js</a>
</footer>
