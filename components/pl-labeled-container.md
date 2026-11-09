# pl-labeled-container

Объединяет подпись и произвольное содержимое. Используется внутри полей ввода и подходит для собственного контрола с общей системой размеров.

Пакет: `@plcmp/pl-labeled-container`.

## Подключение

```js
import '@plcmp/pl-labeled-container';
```

Контейнер использует переменные темы для ширины, промежутков и подписи.

## Расположение подписи

<div class="demo demo-stack">
  <pl-labeled-container label="Подпись сверху">
    <pl-button label="Действие"></pl-button>
  </pl-labeled-container>
  <pl-labeled-container label="Подпись слева" orientation="horizontal" label-width="120" content-width="140">
    <pl-button label="Действие"></pl-button>
  </pl-labeled-container>
</div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-labeled-container label="Подпись сверху">
  <pl-button label="Действие"></pl-button>
</pl-labeled-container>
<pl-labeled-container label="Подпись слева" orientation="horizontal" label-width="120" content-width="140">
  <pl-button label="Действие"></pl-button>
</pl-labeled-container>
```

## Ширина и слоты

`label-width` и `content-width` принимают ширины в px. В горизонтальном варианте контейнер складывает ширину подписи и содержимого. Учитывай это на узком экране.

<div class="demo">
  <pl-labeled-container label="Настройки" content-width="200">
    <pl-icon slot="label-prefix" iconset="demo" icon="settings"></pl-icon>
    <pl-button label="Открыть настройки"></pl-button>
  </pl-labeled-container>
</div>

```html
<pl-labeled-container label="Настройки" content-width="200">
  <pl-icon slot="label-prefix" iconset="demo" icon="settings"></pl-icon>
  <pl-button label="Открыть настройки"></pl-button>
</pl-labeled-container>
```

## Свойства и слоты

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `label` | `String` | `undefined` | Текст подписи |
| `orientation` | `String` | `vertical` | Подпись сверху или слева (`horizontal`) |
| `labelWidth` | `Number` | `undefined` | Ширина подписи; исходная тема задаёт `240px` |
| `contentWidth` | `Number` | `undefined` | Ширина содержимого; исходная тема задаёт `240px` |

| Слот | Назначение |
| --- | --- |
| По умолчанию | Дочерний контрол или другое содержимое |
| `label-prefix` | Содержимое перед подписью |
| `label-suffix` | Содержимое после подписи |

Контейнер не хранит редактируемое значение и не валидирует дочерний контрол. Эти обязанности остаются у самого поля.

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-labeled-container/pl-labeled-container.js" target="_blank" rel="noopener">pl-labeled-container.js</a>
</footer>
