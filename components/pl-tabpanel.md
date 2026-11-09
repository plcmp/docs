# pl-tabpanel

Контейнер вкладок `pl-tab`. Хранит имя выбранной вкладки и прокручивает длинную строку заголовков.

Пакет: `@plcmp/pl-tabpanel`.

## Подключение

```js
import '@plcmp/pl-tabpanel';
import '@plcmp/pl-icon';
```

Для значков нужен зарегистрированный набор иконок; его создание описано в [pl-iconset](/components/pl-iconset).

## Переключение и сохранение состояния

Измени имя, переключись на контакты и вернись. Поля сохраняют состояние: содержимое вкладок остаётся в DOM. Флажок демонстрирует проверку перехода через `beforeSelect`.

<div class="demo"><pl-doc-tabs-demo></pl-doc-tabs-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-tabpanel id="tabs" selected="{{selectedTab}}" style="height: 220px">
  <pl-tab name="profile" header="Сотрудник">
    <pl-icon slot="prefix" iconset="demo" icon="person" size="16" title="Сотрудник"></pl-icon>
    Карточка сотрудника
  </pl-tab>
  <pl-tab name="contacts">
    <span slot="header">Контакты</span>
    <pl-icon slot="suffix" iconset="demo" icon="mail" size="16" title="Почта"></pl-icon>
    Контакты
  </pl-tab>
</pl-tabpanel>
```

Контейнеру нужна определённая высота: содержимое выбранной вкладки размещается абсолютно внутри панели.

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/tabs.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `selected` | `String` | `undefined` | `name` выбранной вкладки; при первом подключении выбирается первая, если значение не задано. |
| `arrowsVisible` | `Boolean` | `true` | Видимость кнопок прокрутки; компонент пересчитывает её по ширине заголовков. |

## Проверка перехода

`beforeSelect(tab)` вызывается перед обработкой клика. Верни `false`, чтобы оставить текущую вкладку. Метод может вернуть `Promise`. Например, проверка формы может запрещать переход к следующему шагу.

```js
this.$.tabs.beforeSelect = tab => tab.name !== 'contacts' || this.allowContacts;
```

Прямое присваивание `selected` не вызывает `beforeSelect`; используй его для уже принятого решения. Значение должно совпадать с `name` существующей вкладки: обработчик рассчитывает найти её.

| Метод | Описание |
| --- | --- |
| `scrollLeft()` | Прокручивает заголовки влево. |
| `scrollRight()` | Прокручивает заголовки вправо. |

## pl-tab

`pl-tab` задаёт заголовок и содержимое одной вкладки. Он должен быть прямым ребёнком `pl-tabpanel`; панель управляет его выбранным состоянием.


`pl-tabpanel` уже регистрирует `pl-tab`. Для связи с `selected` задавай постоянное `name` явно.

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `String` | `undefined` | Имя вкладки; без заданного значения при подключении генерируется случайная строка. |
| `header` | `String` | `undefined` | Текст заголовка. |
| `selected` | `Boolean` | `undefined` | Показывает содержимое и подчёркивает заголовок; обычно управляется панелью. |
| `disabled` | `Boolean` | `undefined` | Блокирует клик по заголовку. |
| `hidden` | `Boolean` | `undefined` | Скрывает вкладку. |

| Слот | Описание |
| --- | --- |
| По умолчанию | Содержимое вкладки. |
| `header` | Дополнительное содержимое в области заголовка. |
| `prefix` | Содержимое перед заголовком. |
| `suffix` | Содержимое после заголовка. |

При переключении содержимое скрывается CSS и остаётся в DOM. Для отложенного создания используй условный шаблон с `d:if` и `d:restamp`. `disabled` блокирует указатель, но не запрещает владельцу программно выбрать вкладку. Событие `select-tab` содержит вкладку в `event.detail.tab` и обрабатывается родителем `pl-tabpanel`.

## Стилизация

Панель публикует `tabs` и `line`; вкладка — `header` и `content`. Добавляй эти правила во внешнюю таблицу стилей компонента-владельца `pl-tabpanel` и `pl-tab`:

```css
pl-tabpanel::part(tabs) {
  background: var(--pl-grey-lightest);
}

pl-tabpanel::part(line) {
  background: var(--pl-primary-base);
}

pl-tab::part(header) {
  padding-inline: var(--pl-space-md);
}

pl-tab::part(content) {
  padding: var(--pl-space-md);
}
```

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-tabpanel/pl-tab.js" target="_blank" rel="noopener">pl-tab.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-tabpanel/pl-tabpanel.js" target="_blank" rel="noopener">pl-tabpanel.js</a>
</footer>
