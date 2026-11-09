# pl-iconset

Регистрирует именованный набор SVG-групп для `pl-icon` и кнопок со значками. Один набор создаётся один раз, после чего его имя используется во всём документе.

Пакет: `@plcmp/pl-iconset`.

## Подключение

```js
import '@plcmp/pl-iconset';
```

## Две фигуры в одном наборе

Кнопка меняет `icon`, оба размера используют один SVG-источник.

<div class="demo"><pl-doc-iconset-demo></pl-doc-iconset-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-iconset iconset="shapes" hidden>
  <svg xmlns="http://www.w3.org/2000/svg">
    <g id="circle" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="none"
        stroke="currentColor" stroke-width="2"></circle>
    </g>
    <g id="triangle" viewBox="0 0 24 24">
      <path d="M12 3 22 21H2Z" fill="none"
        stroke="currentColor" stroke-width="2"></path>
    </g>
  </svg>
</pl-iconset>
```

После регистрации:

```html
<pl-icon iconset="shapes" icon="circle" size="24"></pl-icon>
```

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/icons.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `iconset` | `String` | `undefined` | Уникальное имя набора. |

## Как регистрируется набор

В слот передаётся один `<svg>`. Компонент находит его группы `<g>` и записывает их в `document.iconMap[iconset]` после `slotchange`. У каждого значка должен быть свой `id`; `viewBox` удобно задавать на группе.

Импорт одного `pl-iconset` не создаёт набор. Зарегистрируй SVG до создания использующих его `pl-icon`. В примере модуль ждёт `slotchange`, затем регистрирует компонент демонстрации. Повторная регистрация с тем же именем заменяет запись набора, но уже показанные значки автоматически не перерисовывает.

`hidden` в примере — стандартный HTML-атрибут для контейнера исходных SVG. Он не мешает регистрации. Для штатных значков достаточно импорта `@plcmp/pl-iconset-default`.

## Стилизация

`pl-iconset` — невизуальный реестр SVG-групп и не предоставляет `part` или CSS-переменных для оформления. Стили размещай у видимого потребителя иконки; например, цвет самого `pl-icon` задаётся его переменными через хост.

```css
pl-icon {
  --pl-icon-fill-color: var(--pl-primary-base);
  --pl-icon-stroke-color: currentColor;
}
```

Эти правила не изменяют SVG, хранящийся в реестре; собственные `fill` и `stroke` внутри группы могут их переопределить. Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-iconset/pl-iconset.js" target="_blank" rel="noopener">pl-iconset.js</a>
</footer>
