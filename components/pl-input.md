# pl-input

Однострочное поле ввода с подписью, проверкой значения и слотами для дополнительного содержимого.

Пакет: `@plcmp/pl-input`.

## Подключение

```js
import '@plcmp/pl-input';
```

## Значение и подпись

<div class="demo demo-stack">
  <pl-input label="Название" placeholder="Введи название" stretch></pl-input>
  <pl-input label="Код" value="DEMO" orientation="horizontal" label-width="80" content-width="160"></pl-input>
</div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-input label="Название" placeholder="Введи название" stretch></pl-input>
<pl-input label="Код" value="DEMO" orientation="horizontal" label-width="80" content-width="160"></pl-input>
```

В шаблоне формы связывай редактируемое значение через `value="{{title}}"`. Пример с обновлением родительского состояния — в главе [биндинги](/guide/bindings).

## Типы ввода

<div class="demo demo-stack">
  <pl-input label="Количество" type="number" min="1" max="10" step="1" value="2"></pl-input>
  <pl-input label="Пароль" type="password" placeholder="Введи пароль"></pl-input>
  <pl-input label="Уровень" type="range" min="0" max="100" value="40"></pl-input>
  <pl-input label="Цвет" type="color" value="#3a817d"></pl-input>
</div>

```html
<pl-input label="Количество" type="number" min="1" max="10" step="1" value="2"></pl-input>
<pl-input label="Пароль" type="password"></pl-input>
<pl-input label="Уровень" type="range" min="0" max="100" value="40"></pl-input>
<pl-input label="Цвет" type="color" value="#3a817d"></pl-input>
```

При вводе значение поступает строкой с задержкой 100 мс. Для `type="number"` обработчик потери фокуса преобразует его в число, а пустое поле — в `null`. Не считай значение числом на каждом промежуточном шаге ввода.

## Валидация и состояния

<div class="demo demo-stack">
  <pl-input label="Обязательное название" required placeholder="Введи текст" stretch></pl-input>
  <pl-input label="Код из цифр" pattern="^[0-9]+$" value="abc" stretch></pl-input>
  <pl-input label="Только чтение" readonly value="Утверждено" stretch></pl-input>
  <pl-input label="Недоступное поле" disabled value="Отключено" stretch></pl-input>
</div>

```html
<pl-input label="Обязательное название" value="{{title}}" required invalid="{{invalid}}"></pl-input>
<pl-input label="Код из цифр" pattern="^[0-9]+$"></pl-input>
<pl-input label="Только чтение" readonly value="Утверждено"></pl-input>
<pl-input label="Недоступное поле" disabled value="Отключено"></pl-input>
```

`invalid` вычисляет компонент. Для нескольких полей используй [наблюдатель валидации](/nfjs/validation). Стандартная проверка `required` не удаляет пробелы.

## Слоты

<div class="demo">
  <pl-input label="Поиск" placeholder="Название документа" stretch>
    <pl-icon slot="prefix" iconset="demo" icon="search"></pl-icon>
  </pl-input>
</div>

```html
<pl-input label="Поиск" placeholder="Название документа" stretch>
  <pl-icon slot="prefix" iconset="demo" icon="search"></pl-icon>
</pl-input>
```

| Слот | Описание |
| --- | --- |
| `label-prefix` | Содержимое перед подписью. |
| `label-suffix` | Содержимое после подписи. |
| `prefix` | Содержимое перед полем ввода. |
| `suffix` | Содержимое после поля ввода. |
| `input` | Дополнительное содержимое области ввода. |
| По умолчанию | Содержимое после контейнера. |

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `label` | `String` | `undefined` | Подпись поля. |
| `title` | `String` | `undefined` | Подсказка браузера при наведении на поле. |
| `orientation` | `String` | `undefined` | Расположение подписи: `horizontal` — слева, `vertical` — сверху. |
| `type` | `String` | `'text'` | Тип нативного поля. |
| `value` | `String` | `undefined` | Значение поля. Объявлен тип `String`; при `type="number"` после потери фокуса значение может стать числом — см. пример выше. |
| `placeholder` | `String` | `''` | Подсказка пустого поля. |
| `contentWidth` | `Number` | `undefined` | Ширина области ввода в px; без значения используется ширина из темы. |
| `labelWidth` | `Number` | `undefined` | Ширина подписи в px; без значения используется ширина из темы. |
| `pattern` | `String` | `undefined` | Регулярное выражение проверки. |
| `min` | `Number` | `undefined` | Нижняя граница числового значения; передаётся нативному полю. Встроенный валидатор пропускает границу `0`. |
| `max` | `Number` | `undefined` | Верхняя граница числового значения; передаётся нативному полю. Встроенный валидатор пропускает границу `0`. |
| `step` | `String` | `undefined` | Шаг нативного поля. |
| `required` | `Boolean` | `undefined` | Делает поле обязательным: значения `''`, `null` и `undefined` не проходят проверку. |
| `readonly` | `Boolean` | `undefined` | Запрещает редактирование; значение продолжает проверяться валидаторами. |
| `disabled` | `Boolean` | `undefined` | Отключает ввод и фокусировку; отключённое поле не считается невалидным. |
| `hidden` | `Boolean` | `undefined` | Скрывает компонент целиком, включая подпись. |
| `stretch` | `Boolean` | `undefined` | Растягивает компонент на всю доступную ширину. |
| `invalid` | `Boolean` | `undefined` | Признак ошибки, который компонент пересчитывает при проверке значения. |
| `autocomplete` | `Boolean` | `false` | Управляет нативным `autocomplete` (`on`/`off`). |

Уведомления `value-changed` и `invalid-changed` используются биндингами Polylib. `validation-changed` сообщает о завершении проверки.

## Методы

| Метод | Описание |
| --- | --- |
| `validate()` | Возвращает Promise; результат проверки находится в `invalid`. |

## Стилизация

Размер поля задавай свойствами `stretch`, `contentWidth` и `labelWidth`. Для внутренней разметки доступны части: `input-container` — рамка, `native-input` — ввод, `label` — подпись, `labeled-container` — общий контейнер. Размещай CSS в стилях владельца поля:

```css
pl-input {
  --pl-content-width: 280px;
  --pl-label-width: 160px;
}

pl-input::part(input-container) {
  border-radius: 6px;
}

pl-input::part(native-input) {
  font-variant-numeric: tabular-nums;
}

pl-input::part(label) {
  font-weight: 600;
}
```

`label` экспортируется из вложенного `pl-labeled-container`. Изменение общей переменной `--pl-base-size` влияет на высоту поля, а `--pl-text-font` и `--pl-text-color` — на вводимый текст. Переопределение всей рамки через `border` может перекрыть её оформление при ошибке и фокусе; для изменения только формы рамки достаточно `border-radius`.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-input/pl-input.js" target="_blank" rel="noopener">pl-input.js</a>
</footer>
