# pl-dropdown

Выпадающий контейнер с произвольным содержимым. Открывается относительно элемента, выбирает подходящее положение и закрывается при клике снаружи.

Пакет: `@plcmp/pl-dropdown`.

## Подключение

```js
import '@plcmp/pl-dropdown';
```

## Меню действий

Открой меню и выбери действие. В примере выбор только меняет подпись; файл не скачивается.

<div class="demo"><pl-doc-dropdown-demo></pl-doc-dropdown-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-button id="anchor" label="Действия" on-click="[[openMenu]]"></pl-button>
<pl-dropdown id="menu" direction="down">
  <pl-button label="Закрыть" on-click="[[closeMenu]]"></pl-button>
</pl-dropdown>
```

```js
openMenu() { this.$.menu.open(this.$.anchor); }
closeMenu() { this.$.menu.close(); }
```

Присваивание `opened = true` не выполняет позиционирование и подключение обработчиков. Открывай и закрывай контейнер методами; свойство `opened` используй для чтения состояния.

[Код примера](../demos/dropdown.js ':include :type=code javascript')

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `opened` | `Boolean` | `false` | Состояние открытия. |
| `fitInto` | `Object` | `null` | Элемент, ограничивающий область размещения. |
| `direction` | `String` | `'down'` | Предпочтительное направление. |
| `ignoreOutsideClick` | `Boolean` | `false` | Оставляет окно открытым при клике снаружи. |
| `allowDirections` | `Array` | [Все направления](/components/pl-dropdown?id=Направления) | Запасные направления при нехватке места. |

## Методы

| Метод | Описание |
| --- | --- |
| `open(target, fitInto, opts)` | Открывает возле `target`. `fitInto` ограничивает область; `opts.model` передаёт контекст в события клика внутри меню. |
| `close()` | Закрывает окно и снимает глобальные обработчики. |
| `reFit(target, fitInto)` | Заново рассчитывает положение. |

### Направления

По умолчанию `allowDirections` содержит все поддерживаемые направления:

```js
['down', 'down-left', 'up', 'up-left', 'right', 'right-up', 'left', 'left-up']
```

Сначала компонент проверяет `direction`. Если окно не помещается, он перебирает `allowDirections` и выбирает положение с наибольшей видимой площадью. Массив ограничивает только запасные направления. Без `fitInto` границей служит окно браузера. При изменении размера и прокрутке позиция пересчитывается.

## Содержимое и события

Содержимое помещается в обычный слот. Часть `popover` открывает внутреннюю поверхность для стилизации.

| Событие | Описание |
| --- | --- |
| `pl-dropdown-show` | Контейнер открыт. |
| `pl-dropdown-hide` | Контейнер закрыт. |

Для этих дефисных имён используй `addEventListener` с точной строкой. `on-pl-dropdown-show` слушал бы другое имя после преобразования Polylib. При отключении владельца вызови `close()`, чтобы убрать глобальные обработчики.

Для самостоятельного управления размещением и закрытием есть [pl-popover](/components/pl-popover).

## Стилизация

Размести правило в стилях компонента, который использует `pl-dropdown`:

```css
pl-dropdown::part(popover) {
  padding: var(--pl-space-md);
  color: var(--pl-text-color);
  background: var(--pl-background-color);
  border: 1px solid var(--pl-grey-light);
  border-radius: var(--pl-border-radius);
}
```

Стиль действует и при отображении выпадающего содержимого в верхнем слое браузера.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-dropdown/pl-dropdown.js" target="_blank" rel="noopener">pl-dropdown.js</a>
</footer>
