# Формы и навигация

`PlForm` — расширение `PlElement` из `@nfjs/front-pl`. Оно добавляет загрузку вложенных элементов, связь с контейнером форм, навигацию и служебные методы.

Для работы с формами нужно приложение NFJS с подключённым `@nfjs/front-pl`.

## Файл и имя формы

Загрузчик сопоставляет имя `handbook.card` с `forms/handbook/card.js` в зарегистрированном модуле. Файл экспортирует класс формы по умолчанию. Регистрацию тега `pl-form-handbook.card` выполняет загрузчик.

```js
import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl';

export default class HandbookCard extends PlForm {
  static properties = {
    formTitle: { type: String, value: 'Карточка' },
    selectedId: { type: String },
    urlParams: { type: Array, value: () => ['selectedId'] }
  };

  static css = css`
    :host { display: block; width: 100%; height: 100%; }
  `;

  static template = html`<p>Идентификатор: [[selectedId]]</p>`;
}
```

Все входные параметры объявляй в `static properties`. Для формы, которую нужно открывать по ссылке, перечисли параметры адреса в `urlParams`. Параметры из URL приходят строками; роутер записывает в адрес только значения, для которых `Boolean(value)` равно `true`: `0`, `false` и пустая строка в адрес не попадут.

## Открытие и результат

В обработчике текущей формы:

```js
async editCard() {
  const result = await this.open('handbook.card', { selectedId: this.selectedId });
  if (result?.saved) this.card = result.card;
}
```

В открытой форме после успешного сохранения:

```js
await this.close({ saved: true, card: this.card });
```

`open(name, params, options)` возвращает Promise результата закрытия через контейнер форм. Он не возвращает загруженный DOM-элемент. Если форму вставить вне контейнера NFJS, у неё может не быть контекста навигации.

| Метод | Описание |
| --- | --- |
| `open(name, params, options)` | Открывает форму в текущем потоке. |
| `openModal(name, params, options)` | Открывает форму в модальном контейнере. |
| `open(name, params, { newThread: true })` | Открывает новый поток через оболочку приложения. |
| `close(result)` | Передаёт результат и закрывает текущую форму. |
| `showAlert(content, options)` | Показывает сообщение. |
| `showConfirm(content, options)` | Запрашивает подтверждение пользователя. |
| `showDialog(header, content, buttons)` | Показывает диалог с заданными действиями. |
| `notify(message, options)` | Отправляет уведомление в оболочку NFJS. |

`close()` возвращает успешность закрытия, а результат получает ожидающий `open()`. `onClose(result)` может вернуть `false`, чтобы отменить закрытие.

## Жизненный цикл формы

Конструктор создаёт `ready` — Promise загрузки элементов шаблона. Загрузчик NFJS ожидает его перед вставкой корневой формы. `onConnect()` вызывается после `super.connectedCallback()` и поиска контейнера форм. Это подходящее место для собственного подключения формы.

Скрытая предыдущая форма в потоке остаётся подключённой. Скрытие не означает `disconnectedCallback`; внешние подписки могут продолжать работать. При реальном удалении очищай ресурсы по правилам [жизненного цикла](/guide/lifecycle).

## Загрузка и организация файлов

**Правильно: открывать форму через её имя**

```js
this.open('handbook.card', { selectedId: this.selectedId });
```

**Неправильно: вручную импортировать маршрутизируемую форму**

```js
import Card from '/forms/handbook.card';
customElements.define('pl-form-handbook.card', Card);
```

Загрузчик уже управляет импортом и регистрацией. Повторная регистрация ломает открытие, а ручной импорт обходит принятую схему загрузки.

Каталог `forms/` содержит только формы. Вспомогательные функции, компоненты, данные и модели размещай в `lib/`, `components/`, `data/` и других каталогах корня модуля.

См. также: [субформы](/nfjs/subforms), [данные и действия](/nfjs/data).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/front-pl/components/pl-form.js" target="_blank" rel="noopener">pl-form.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/front-pl/lib/CustomElementsLoader.js" target="_blank" rel="noopener">CustomElementsLoader.js</a>
</footer>
