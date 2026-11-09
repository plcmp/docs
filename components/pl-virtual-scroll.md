# pl-virtual-scroll

Виртуальный список: хранит полный массив данных и создаёт DOM только для видимых строк и небольшого запаса. При прокрутке использует уже созданные элементы повторно.

Пакет: `@plcmp/pl-virtual-scroll`.

## Подключение

```js
import '@plcmp/pl-virtual-scroll';
```

## Тысяча строк

Прокрути список: счётчик показывает количество элементов в DOM. Клик возвращает текущую строку через `event.model.employee`. Кнопка изменения проверяет обновление данных через `set`.

<div class="demo"><pl-doc-virtual-demo></pl-doc-virtual-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-virtual-scroll items="{{employees}}" as="employee" style="height: 280px">
  <template>
    <div class="employee-row" on-click="[[selectEmployee]]">
      [[employee.name]]
    </div>
  </template>
</pl-virtual-scroll>
```

```css
.employee-row {
  box-sizing: border-box;
  width: 100%;
  height: 44px;
}
```

```js
selectEmployee(event) {
  this.selected = event.model.employee;
}
```

Шаблон должен находиться внутри `html` Polylib. Список получает его с контекстом владельца; простой HTML без обработки Polylib не создаст такой контекст.

## Разная высота строк

При `variable-row-height` высота измеряется для каждой строки. Контейнер по-прежнему имеет ограниченную высоту.

<div class="demo"><pl-doc-virtual-demo variable></pl-doc-virtual-demo></div>

[Код примера](../demos/virtual-scroll.js ':include :type=code javascript')

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `items` | `Array` | `undefined` | Массив отображаемых объектов. |
| `as` | `String` | `'item'` | Имя строки в шаблоне и `event.model`. |
| `variableRowHeight` | `Boolean` | `false` | Включает измерение неодинаковых строк. |
| `canvas` | `Object` | `undefined` | Элемент для размещения строк; без значения компонент использует внутренний `div`. Его родитель должен прокручиваться. |
| `rowHeight` | `Number` | `undefined` | Объявлено, но при измерении строк не используется; высоту задаёт CSS. |
| `phyItems` | `Array` | `[]` | Служебная коллекция; не используется как вход списка. |

## Перерисовка и состояние

`render()` пересчитывает видимое окно. Вызови его после показа ранее скрытого контейнера или изменения размеров. Изменение `items` и прокрутка вызывают обновление автоматически; отдельного наблюдателя за размером контейнера нет.

В обычном режиме первая измеренная высота применяется ко всем строкам. Задай одинаковую высоту корневого элемента строки и не добавляй внешние отступы между строками. Для разной высоты включи `variable-row-height`.

При повторном использовании DOM локальное состояние вложенного элемента управления может относиться к предыдущей строке. Храни редактируемые значения в объекте строки и связывай их через `{{employee.field}}`. Для узнавания строки используй alias из `event.model`, поскольку DOM-узел не закреплён за одним индексом.

Поддержка `PlaceHolder` позволяет вызвать `items.load()` для ещё не загруженной строки. Сам список не формирует HTTP-запросы и не предоставляет интерфейс страниц; загрузкой управляет источник данных.

Для колонок, сортировки и выбора строк используй [pl-table](/components/pl-table).

## Стилизация

Контейнер работает в Light DOM: собственные элементы шаблона строки доступны стилям владельца списка. Задай ограниченную высоту прокручиваемой области и устойчивую высоту строки:

```css
pl-virtual-scroll {
  height: 320px;
  overflow: auto;
}

pl-virtual-scroll .row {
  min-height: 48px;
  box-sizing: border-box;
  padding: var(--pl-space-sm);
  border-bottom: 1px solid var(--pl-grey-light);
}
```

Назначь класс `row` корневому элементу своего шаблона. Если строки имеют разную высоту, включи `variable-row-height`. Не меняй служебное абсолютное позиционирование и координаты `.vs-item`: ими управляет виртуализация. Для изменения высоты строк после загрузки содержимого вызови `render()`.

Компонент не публикует `part`. Shadow DOM компонентов внутри строки сохраняет свои границы: например, внутренний ввод `pl-input` оформляется через его собственные части и переменные.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-virtual-scroll/pl-virtual-scroll.js" target="_blank" rel="noopener">pl-virtual-scroll.js</a>
</footer>
