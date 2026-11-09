# pl-combobox

Выбор значения из списка, поиск, множественный выбор и дерево. `value` хранит ключ, `selected` — объект строки, `text` — отображаемую подпись.

Пакет: `@plcmp/pl-combobox`.

## Подключение

```js
import '@plcmp/pl-combobox';
```

## Выбор и привязка

Выбери отдел, отметь несколько отделов в соседнем поле или введи свой город. Под полями показаны значения родительского компонента. Кнопка меняет `value` программно.

<div class="demo"><pl-doc-combobox-demo></pl-doc-combobox-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-combobox label="Отдел" data="[[departments]]"
  text-property="name" value-property="id"
  value="{{department}}" selected="{{selected}}" required>
</pl-combobox>
```

Данные: массив объектов, например `{ id: 'dev', name: 'Разработка' }`. Для массива строк компонент сам строит объекты с полями `value` и `text`. Для сохранения обычно достаточно `value`; `selected` удобен для чтения дополнительных полей выбранной записи.

## Несколько значений

Включи `multi-select`, свяжи `value-list="{{departmentIds}}"`. `selected-list` содержит соответствующие объекты. `variant="tags"` показывает отдельные метки; `variant="text"` — первый элемент и количество остальных. Кнопка «выбрать все» работает по всему `data`.

```html
<pl-combobox data="[[departments]]" multi-select variant="tags"
  text-property="name" value-property="id"
  value-list="{{departmentIds}}" selected-list="{{departmentsSelected}}">
</pl-combobox>
```

## Дерево

Передай плоский массив с ключом и ключом родителя. `select-only-leaf` разрешает выбор конечных узлов. Стрелка рядом с родителем раскрывает дочерние строки.

<div class="demo"><pl-doc-combobox-tree-demo></pl-doc-combobox-tree-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-combobox data="[[departments]]" tree select-only-leaf
  key-property="id" pkey-property="parent"
  text-property="name" value-property="id" value="{{departmentId}}">
</pl-combobox>
```

## Поиск и произвольное значение

Список фильтруется по `textProperty`, начиная с двух символов. Поиск не учитывает регистр. В дереве сохраняются родители найденных строк. `allow-custom-value` разрешает записать введённый текст в `value`, даже если такого варианта нет в `data`. При выключенном свойстве введённый текст сам по себе не означает новый выбранный ключ.

[Код примера](../demos/combobox.js ':include :type=code javascript')

## Свойства pl-combobox

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `data` | `Array` | `[]` | Список строк или объектов; для дерева — плоский список. |
| `value` | `String` | `null` | Ключ одиночного выбора; связать через `{{...}}`. |
| `text` | `String` | `undefined` | Отображаемый и вводимый текст. |
| `selected` | `Object` | `null` | Объект выбранной строки. |
| `textProperty` | `String` | `'text'` | Поле подписи. |
| `valueProperty` | `String` | `'value'` | Поле ключа. |
| `titleProperty` | `String` | `undefined` | Поле всплывающего заголовка метки множественного выбора. |
| `multiSelect` | `Boolean` | `false` | Выбор нескольких строк. |
| `valueList` | `Array` | `[]` | Массив выбранных ключей. |
| `selectedList` | `Array` | `[]` | Массив выбранных объектов. |
| `variant` | `String` | `'text'` | Представление множественного выбора: `text` или `tags`. |
| `allowCustomValue` | `Boolean` | `false` | Разрешает собственный текст вместо ключа из списка. |
| `tree` | `Boolean` | `undefined` | Древовидное представление. |
| `keyProperty` | `String` | `undefined` | Ключ узла дерева. |
| `pkeyProperty` | `String` | `undefined` | Ключ родителя. |
| `hasChildProperty` | `String` | `'_haschildren'` | Поле признака наличия детей. |
| `selectOnlyLeaf` | `Boolean` | `false` | Запрещает выбор строк, у которых в данных есть дети. |
| `label` | `String` | `undefined` | Подпись поля. |
| `placeholder` | `String` | `undefined` | Подсказка пустого поля. |
| `required` | `Boolean` | `undefined` | Требует ключ или непустой `valueList`. |
| `invalid` | `Boolean` | `undefined` | Результат проверки вложенного `pl-input`. |
| `readonly` | `Boolean` | `undefined` | Запрещает пользовательское изменение. |
| `disabled` | `Boolean` | `undefined` | Отключает взаимодействие. |
| `hidden` | `Boolean` | `undefined` | Скрывает компонент. |
| `stretch` | `Boolean` | `undefined` | Занимает доступную ширину. |
| `orientation` | `String` | `undefined` | Расположение подписи: `horizontal` или `vertical`. |
| `contentWidth` | `Number` | `undefined` | Ширина области ввода в пикселях. |
| `labelWidth` | `Number` | `undefined` | Ширина подписи в пикселях. |
| `fitInto` | `Object` | `null` | Элемент, в границах которого размещается список. |
| `direction` | `String` | `'down'` | Предпочтительное направление раскрытия. |
| `autocomplete` | `Boolean` | `false` | Передаётся во вложенный `pl-input`; не включает фильтрацию списка. |

## Слоты

| Слот | Описание |
| --- | --- |
| `prefix` | Содержимое перед текстом поля. |
| `suffix` | Содержимое после текста поля. |
| `label-prefix` | Перед подписью. |
| `label-suffix` | После подписи. |
| `dropdown-prefix` | Над списком вариантов. |
| `dropdown-suffix` | Под списком вариантов. |

## Методы

| Метод | Описание |
| --- | --- |
| `onSelectAll()` | Переключает выбор всех строк и очистку в режиме `multiSelect`. |
| `validator()` | Возвращает сообщение обязательности или `undefined`; итоговый `invalid` вычисляет вложенный ввод. |

## Особенности

Ключи в `valueList` должны присутствовать в загруженном `data`. Для программного изменения коллекций используй `push`, `splice` и `set`. При поиске одиночного `value` числовой ключ `0` считается ложным по правилам JavaScript. Для справочников выбирай ненулевые ключи.

Дерево дополняет строки служебными полями `_opened`, `_level` и `_haschildren`. Учитывай общие ссылки при передаче `data="[[rows]]"`: односторонняя связь не клонирует объекты.

Проверка формы описана в разделе [валидация](/nfjs/validation).

## pl-combobox-list

Внутренний компонент списка можно использовать отдельно, если нужен список без поля ввода. Он отображает подготовленные строки и отправляет событие `select`; открытие выпадающего окна и синхронизацию выбранного значения он не выполняет.

```js
import '@plcmp/pl-combobox/pl-combobox-list.js';
```

Нажми на строку в примере. Обработчик получает объект выбора из `event.detail.model`.

<div class="demo"><pl-doc-combobox-list-demo></pl-doc-combobox-list-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-combobox-list data="[[rows]]" _vdata="[[rows]]"
  text-property="text" value-property="value" on-select="[[select]]">
</pl-combobox-list>
```

```js
select(event) {
  this.selected = event.detail.model;
}
```

`data` содержит исходные строки, `_vdata` — строки для отображения. В составе `pl-combobox` список получает `_vdata` после фильтрации и обработки дерева. Для автономного плоского списка оба свойства могут ссылаться на один массив.

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `data` | `Array` | `undefined` | Исходные строки, также используются для проверки потомков. |
| `_vdata` | `Array` | `undefined` | Подготовленные строки для отображения. |
| `textProperty` | `String` | `undefined` | Имя поля подписи; задаётся явно. |
| `valueProperty` | `String` | `undefined` | Имя поля ключа; задаётся явно. |
| `valueList` | `Array` | `undefined` | Ключи, отмеченные флажками в режиме `multiSelect`. |
| `multiSelect` | `Boolean` | `undefined` | Показывает флажки выбора. |
| `tree` | `Boolean` | `undefined` | Показывает отступы и кнопки раскрытия дерева. |
| `keyProperty` | `String` | `undefined` | Поле ключа узла. |
| `pkeyProperty` | `String` | `undefined` | Поле ключа родителя. |
| `selectOnlyLeaf` | `Boolean` | `undefined` | Разрешает выбирать только листья. |
| `text` | `String` | `undefined` | Текст, переданный родительским полем. |
| `selected` | `Object` | `undefined` | Объявленное свойство; клик по строке его сам не меняет. |
| `_search` | `String` | `undefined` | Текст, который нужно подсветить в строке. |

| Событие | Данные | Описание |
| --- | --- | --- |
| `select` | `event.detail.model` | Выбранная строка; слушай через `on-select`. |

При `multiSelect` список отображает состояние флажков по `valueList`, но изменение массива выполняет владелец. Строки дерева должны уже содержать `_level`, `_opened` и `_haschildren`. Режим дерева или плоского списка выбирается при создании шаблона; для переключения пересоздай элемент.


## Стилизация

Ширину поля задавай через `content-width` или `stretch`, а ограничение высоты списка — через `--pl-dropdown-max-height`. В режиме множественного выбора `--pl-tag-max-width` ограничивает ширину одного выбранного значения.

```css
pl-combobox {
  --pl-content-width: 280px;
  --pl-dropdown-max-height: 240px;
  --pl-tag-max-width: 180px;
}

pl-combobox::part(input-container) {
  border-radius: 6px;
}

pl-combobox::part(native-input) {
  text-align: start;
}

pl-combobox::part(label) {
  font-weight: 600;
}
```

Комбобокс экспортирует части вложенного `pl-input`: `input-container` — рамка поля, `native-input` — ввод, `label` — подпись и `labeled-container` — весь контейнер поля с подписью. Эти селекторы размещай в CSS владельца комбобокса.

У `pl-combobox-list` собственных частей `part` нет. Переменные наследуются в список, а классы собственного шаблона строки оформляются в области, где этот шаблон создаётся. Обычный селектор владельца не проходит сквозь Shadow DOM вложенного списка.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-combobox/pl-combobox-list.js" target="_blank" rel="noopener">pl-combobox-list.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-combobox/pl-combobox.js" target="_blank" rel="noopener">pl-combobox.js</a>
</footer>
