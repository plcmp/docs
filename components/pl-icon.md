# pl-icon

Показывает SVG-значок из зарегистрированного набора. `iconset` выбирает набор, `icon` — идентификатор SVG-группы, `size` — размер в пикселях.

Пакет: `@plcmp/pl-icon`.

## Подключение

```js
import '@plcmp/pl-icon';
```

## Штатный набор

```js
import '@plcmp/pl-iconset-default';
```

<div class="demo">
  <pl-icon iconset="pl-default" icon="date" size="16" title="Дата"></pl-icon>
  <pl-icon iconset="pl-default" icon="check-circle" size="24" title="Готово"></pl-icon>
  <pl-icon iconset="pl-default" icon="download" size="32" title="Скачать"></pl-icon>
</div>

```html
<pl-icon iconset="pl-default" icon="date" size="16" title="Дата"></pl-icon>
<pl-icon iconset="pl-default" icon="check-circle" size="24" title="Готово"></pl-icon>
<pl-icon iconset="pl-default" icon="download" size="32" title="Скачать"></pl-icon>
```

## Собственный набор и смена значка

<div class="demo"><pl-doc-iconset-demo></pl-doc-iconset-demo></div>
<p class="demo-status" role="status">Загружаем примеры…</p>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/icons.js ':include :type=code javascript')

</details>

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `iconset` | `String` | `'pl-default'` | Имя зарегистрированного набора. |
| `icon` | `String` | `undefined` | Идентификатор группы `<g>`. |
| `size` | `Number` | `16` | Ширина и высота SVG в пикселях. |
| `title` | `String` | `undefined` | Стандартная подсказка на элементе. |
| `hidden` | `String` | `undefined` | Отражается в атрибут `hidden`; наличие атрибута скрывает значок. |
| `animated` | `Boolean` | `undefined` | Запускает SVG-анимации; без него анимации стоят на первом кадре. |

## Цвет и регистрация

Заливка использует `--pl-icon-fill-color`, по умолчанию — `currentColor`. Обводка использует `--pl-icon-stroke-color`. Собственные `fill` и `stroke` внутри SVG-группы могут задавать другой рисунок.

```css
pl-icon { color: var(--pl-primary-base); }
```

Набор должен быть зарегистрирован до первого вывода значка. `pl-icon` ищет группу при изменении `icon`/`iconset` и не ожидает позднюю регистрацию автоматически. Отсутствующий идентификатор не заменяется другим значком; чтобы явно очистить SVG, присвой пустой `icon`.

Для кликабельной команды используй [pl-icon-button](/components/pl-icon-button) с доступным названием. Собственные наборы описаны в [pl-iconset](/components/pl-iconset).

## Стилизация

CSS размещай в стилях компонента-владельца. Значок рисуется во внутреннем SVG, поэтому его `fill` и `stroke` настраиваются через поддерживаемые CSS-переменные, а не селекторами внутренних узлов.

```css
pl-icon {
  --pl-icon-fill-color: var(--pl-primary-base);
  --pl-icon-stroke-color: currentColor;
}
```

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-icon/pl-icon.js" target="_blank" rel="noopener">pl-icon.js</a>
</footer>
