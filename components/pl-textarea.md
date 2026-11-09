# pl-textarea

Многострочное текстовое поле с подписью, обязательным заполнением и состояниями чтения и отключения.

Пакет: `@plcmp/pl-textarea`.

## Подключение

```js
import '@plcmp/pl-textarea';
```

## Поле с подписью

<div class="demo">
  <pl-textarea label="Описание задачи" placeholder="Добавь детали" stretch></pl-textarea>
</div>
<p class="demo-status" role="status">Загружаем примеры…</p>

```html
<pl-textarea label="Описание задачи" placeholder="Добавь детали" stretch></pl-textarea>
```

## Значение и обязательное заполнение

Введи текст: `value` обновится, `invalid` станет `false`, кнопка станет доступной. Очисти поле — обязательность снова заблокирует кнопку. Пример ничего не отправляет на сервер.

<div class="demo"><pl-doc-textarea-demo></pl-doc-textarea-demo></div>

<details class="docs-code">
<summary>Полный код примера</summary>

[Код примера](../demos/textarea.js ':include :type=code javascript')

</details>

Ввод передаётся в `value` с задержкой 100 мс. Валидация асинхронная: не считывай `invalid` сразу после присваивания `value` в том же синхронном вызове. Для формы с несколькими полями используй [общий наблюдатель валидации](/nfjs/validation).

## Состояния и размеры

<div class="demo demo-stack">
  <pl-textarea label="Только чтение" value="Утверждённое описание" readonly stretch hide-resizer></pl-textarea>
  <pl-textarea label="Недоступное поле" value="Действие недоступно" disabled stretch hide-resizer></pl-textarea>
</div>

```html
<pl-textarea label="Только чтение" value="Утверждённое описание" readonly stretch hide-resizer></pl-textarea>
<pl-textarea label="Недоступное поле" value="Действие недоступно" disabled stretch hide-resizer></pl-textarea>
```

`stretch` занимает ширину родителя. `fit` занимает ширину и высоту; родитель должен иметь определённую высоту. `hide-resizer` скрывает ручное изменение размера.

## Свойства

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `value` | `String` | `''` | Текст; для редактирования связывай через `{{...}}`. |
| `label` | `String` | `undefined` | Подпись. |
| `orientation` | `String` | `undefined` | Расположение подписи: `horizontal` — слева, `vertical` — сверху. |
| `placeholder` | `String` | `''` | Подсказка в пустом поле. |
| `title` | `String` | `undefined` | Подсказка браузера. |
| `required` | `Boolean` | `undefined` | Проверяет, что значение не `''`, `null` или `undefined`. |
| `invalid` | `Boolean` | `undefined` | Результат валидации, пересчитывается компонентом. |
| `disabled` | `Boolean` | `undefined` | Отключает ввод; отключённое поле не считается невалидным. |
| `readonly` | `Boolean` | `undefined` | Запрещает редактирование; обязательность продолжает проверяться. |
| `hidden` | `Boolean` | `undefined` | Скрывает поле. |
| `stretch` | `Boolean` | `false` | Занимает доступную ширину. |
| `fit` | `Boolean` | `false` | Занимает ширину и высоту. |
| `hideResizer` | `Boolean` | `false` | Атрибут `hide-resizer`, запрещает ручное изменение размера. |
| `grow` | `Boolean` | `false` | Объявлено в исходнике, но автоматический рост не реализован. |

Пробелы проходят стандартную проверку `required`: она проверяет пустое значение, не бизнес-правила текста. Не приписывай компоненту встроенную проверку длины или обрезку пробелов.

## Слоты

| Слот | Описание |
| --- | --- |
| `label-prefix` | Содержимое перед подписью. |
| `label-suffix` | Содержимое после подписи. |

## События

| Событие | Описание |
| --- | --- |
| `value-changed` | Уведомляет об изменении текста; биндинг `{{...}}` обрабатывает его автоматически. |
| `invalid-changed` | Уведомляет об изменении результата валидации; биндинг `{{...}}` обрабатывает его автоматически. |
| `validation-changed` | Всплывающее событие после проверки; используется наблюдателем валидации. |

## Методы

| Метод | Описание |
| --- | --- |
| `validate()` | Запускает проверку и возвращает Promise. Не возвращает булевый результат; после ожидания смотри `invalid`. |

См. также: [биндинги](/guide/bindings), [валидация формы](/nfjs/validation).

## Стилизация

Ширину поля задавай через `stretch`, заполнение всей области — через `fit`. Для начального размера внутреннего `textarea` предусмотрены переменные:

```css
pl-textarea {
  --pl-content-width: 320px;
  --pl-textarea-content-width: 320px;
  --pl-textarea-content-height: 120px;
}
```

`--pl-content-width` задаёт ширину контейнера подписи и минимальную ширину ввода. `--pl-textarea-content-width` и `--pl-textarea-content-height` задают размер области редактирования. При `stretch` ширина ввода становится 100%, при `fit` — ширина и высота; для `fit` родителю нужна заданная высота.

Поле не экспортирует части `part`. Цвета и шрифт меняй через `--pl-background-color`, `--pl-text-color` и `--pl-text-font`, а ручное изменение размера отключай свойством `hide-resizer`.

Подробнее: [стили и Shadow DOM](/guide/styles).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-textarea/pl-textarea.js" target="_blank" rel="noopener">pl-textarea.js</a>
</footer>
