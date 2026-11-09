# pl-flex-layout

Flex-контейнер для размещения дочерних элементов в строку или столбец. Управляет направлением, переносом, выравниванием, промежутками и прокруткой.

Пакет: `@plcmp/pl-flex-layout`.

## Подключение

```js
import '@plcmp/pl-flex-layout';
```

Значения отступов берутся из общей темы.

## Строка и столбец

Переключи флажок: `vertical` меняется через однонаправленный биндинг, а контейнер отражает свойство в атрибут и перестраивает раскладку.

<div class="demo">
  <pl-doc-flex-demo></pl-doc-flex-demo>
</div>
<p class="demo-status" role="status">Загружаем примеры…</p>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/flex-layout.js ':include :type=code javascript')

</details>

## Перенос и выравнивание

<div class="demo">
  <pl-flex-layout wrap stretch justify="space-between" align="center" gap="16">
    <pl-button label="Назад"></pl-button>
    <pl-button label="Продолжить" variant="primary"></pl-button>
  </pl-flex-layout>
</div>

```html
<pl-flex-layout wrap stretch justify="space-between" align="center" gap="16">
  <pl-button label="Назад"></pl-button>
  <pl-button label="Продолжить" variant="primary"></pl-button>
</pl-flex-layout>
```

`wrap` разрешает перенос, `stretch` даёт контейнеру всю ширину родителя. Без свободного места `justify="space-between"` не раздвинет элементы.

## Прокрутка

<div class="demo">
  <pl-flex-layout vertical scrollable stretch style="height: 132px;">
    <pl-button label="Первый раздел"></pl-button>
    <pl-button label="Второй раздел"></pl-button>
    <pl-button label="Третий раздел"></pl-button>
    <pl-button label="Четвёртый раздел"></pl-button>
  </pl-flex-layout>
</div>

```html
<pl-flex-layout vertical scrollable stretch style="height: 132px;">
  <pl-button label="Первый раздел"></pl-button>
  <pl-button label="Второй раздел"></pl-button>
  <pl-button label="Третий раздел"></pl-button>
  <pl-button label="Четвёртый раздел"></pl-button>
</pl-flex-layout>
```

Прокрутке нужна ограниченная высота или ширина. `scrollable` сам по себе не ограничивает размер.

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `vertical` | `Boolean` | `undefined` | Располагает дочерние элементы в столбец; без него — в строку. |
| `wrap` | `Boolean` | `undefined` | Разрешает перенос дочерних элементов на следующую строку или в следующий столбец. |
| `stretch` | `Boolean` | `undefined` | Ширина 100%. |
| `fit` | `Boolean` | `undefined` | Ширина и высота 100%. |
| `scrollable` | `Boolean` | `undefined` | Включает прокрутку при переполнении контейнера: `overflow: auto`. |
| `align` | `String` | `'flex-start'` | Выравнивание по поперечной оси: `flex-start`, `center`, `flex-end` или `baseline`. |
| `justify` | `String` | `'flex-start'` | Выравнивание по основной оси: `flex-start`, `center`, `flex-end` или `space-between`. |
| `gap` | `Number` | `undefined` | Промежуток в px; без значения — `--pl-space-md`. |
| `labelWidth` | `Number` | `undefined` | `label-width`: задаёт `--pl-label-width` и горизонтальную ориентацию подходящих потомков. |
| `hidden` | `Boolean` | `undefined` | Скрывает контейнер. |

## Слот и ограничения

Слот по умолчанию принимает дочерние элементы. Контейнер не меняет их бизнес-состояние и не генерирует специальных событий.

Обработчик `gap` применяет только значение, которое JavaScript преобразует в `true`: числовой `0` через биндинг не сбросит ранее заданный промежуток. Для нулевого отступа используй явное CSS-правило `gap: 0` на контейнере.

`labelWidth` обходит существующих потомков при изменении свойства. Для динамически создаваемого поля явно укажи `orientation`, если нужна горизонтальная подпись.

Связанная тема: [стили и Shadow DOM](/guide/styles).

## Стилизация

Раскладка находится на самом хосте. Направление, перенос и выравнивание задавай через `vertical`, `wrap`, `align` и `justify`. В CSS владельца можно ограничить размеры контейнера и распределить пространство между его непосредственными детьми:

```css
pl-flex-layout.toolbar {
  width: 100%;
  min-width: 0;
  gap: var(--pl-space-sm);
}

.toolbar > pl-input {
  flex: 1 1 240px;
  min-width: 0;
}

.toolbar > pl-button {
  flex: 0 0 auto;
}
```

Класс `toolbar` назначь самому `pl-flex-layout`; полю добавь `stretch`. Если `gap` задан атрибутом или биндингом, компонент записывает промежуток в inline-стиль. Для управления промежутком только из CSS оставь свойство `gap` незаданным. Частей `part` у контейнера нет.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-flex-layout/pl-flex-layout.js" target="_blank" rel="noopener">pl-flex-layout.js</a>
</footer>
