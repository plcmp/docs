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

Введи текст: `value` обновится, `invalid` станет `false`, кнопка станет доступной. Очисти поле — обязательность снова заблокирует кнопку. Демо ничего не отправляет на сервер.

<div class="demo"><pl-doc-textarea-demo></pl-doc-textarea-demo></div>

[Полный код работающего примера](../demos/textarea.js ':include :type=code javascript')

Ввод передаётся в `value` с задержкой 100 мс. Валидация асинхронная: не считывай `invalid` сразу после присваивания `value` в том же синхронном вызове. Для формы с несколькими полями используй [общий наблюдатель валидации](/integration/validation).

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
| `value` | `String` | `''` | Текст; для редактирования связывай через `{{...}}` |
| `label` | `String` | `undefined` | Подпись |
| `orientation` | `String` | `undefined` | Расположение подписи: `horizontal` — слева, `vertical` — сверху |
| `placeholder` | `String` | `''` | Подсказка в пустом поле |
| `title` | `String` | `undefined` | Подсказка браузера |
| `required` | `Boolean` | `undefined` | Проверяет, что значение не `''`, `null` или `undefined` |
| `invalid` | `Boolean` | `undefined` | Результат валидации, пересчитывается компонентом |
| `disabled` | `Boolean` | `undefined` | Отключает ввод; отключённое поле не считается невалидным |
| `readonly` | `Boolean` | `undefined` | Запрещает редактирование; обязательность продолжает проверяться |
| `hidden` | `Boolean` | `undefined` | Скрывает поле |
| `stretch` | `Boolean` | `false` | Занимает доступную ширину |
| `fit` | `Boolean` | `false` | Занимает ширину и высоту |
| `hideResizer` | `Boolean` | `false` | Атрибут `hide-resizer`, запрещает ручное изменение размера |
| `grow` | `Boolean` | `false` | Объявлено в исходнике, но автоматический рост не реализован |

Пробелы проходят стандартную проверку `required`: она проверяет пустое значение, не бизнес-правила текста. Не приписывай компоненту встроенную проверку длины или обрезку пробелов.

## Слоты

| Слот | Назначение |
| --- | --- |
| `label-prefix` | Содержимое перед подписью |
| `label-suffix` | Содержимое после подписи |

## События

| Событие | Описание |
| --- | --- |
| `value-changed` | Уведомляет об изменении текста; биндинг `{{...}}` обрабатывает его автоматически |
| `invalid-changed` | Уведомляет об изменении результата валидации; биндинг `{{...}}` обрабатывает его автоматически |
| `validation-changed` | Всплывающее событие после проверки; используется наблюдателем валидации |

Метод `validate()` запускает проверку и возвращает Promise. Он не возвращает булевый результат; после ожидания смотри `invalid`.

Связанные темы: [биндинги](/guide/bindings), [валидация формы](/integration/data).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@plcmp/pl-textarea/pl-textarea.js" target="_blank" rel="noopener">pl-textarea.js</a>
</footer>
