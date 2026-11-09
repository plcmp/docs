# Субформы

Субформа — обычная `PlForm`, встроенная в шаблон другой формы. Родитель передаёт ей состояние через биндинги, загрузчик NFJS находит класс по имени тега. Субформа помогает разделить экран на части: список, детали, редактирование, история.

Это механизм `@nfjs/front-pl`. Примеры ниже предназначены для запущенного NFJS-приложения.

## Родительская форма

Файл `forms/handbook/editor.js`:

```js
import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl';

export default class HandbookEditor extends PlForm {
  static properties = {
    draft: { type: Object, value: () => ({ title: '' }) }
  };

  static css = css`
    :host { display: grid; width: 100%; height: 100%; gap: var(--pl-space-lg); }
  `;

  static template = html`
    <pl-form-handbook.details draft="{{draft}}"></pl-form-handbook.details>
    <p>Заголовок: [[draft.title]]</p>
  `;
}
```

## Вложенная форма

Файл `forms/handbook/details.js`:

```js
import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl';

export default class HandbookDetails extends PlForm {
  static properties = {
    draft: { type: Object }
  };

  static css = css`
    :host { display: block; width: 100%; height: 100%; }
  `;

  static template = html`
    <pl-input label="Заголовок" value="{{draft.title}}" required></pl-input>
  `;
}
```

Открой `handbook.editor` через оболочку NFJS. Ввод во вложенной форме должен обновить `draft.title` родителя и текст под субформой. Ручной импорт `handbook.details` и `customElements.define` не нужны.

## Кто владеет состоянием

Объект `draft` создаёт родитель. Субформа объявляет входное свойство без подмены начального значения. `{{draft}}` допускает возврат изменений; для просмотра передавай `draft="[[draft]]"` и не меняй полученную модель.

Односторонний биндинг не замораживает объект. Если дочерний код напрямую мутирует общий объект, он нарушает договорённость о владении данными, даже при `[[...]]`.

**Правильно: менять вложенное поле с уведомлением**

```js
this.set('draft.title', 'Новый заголовок');
```

**Неправильно: менять объект без уведомления**

```js
this.draft.title = 'Новый заголовок';
```

Прямое изменение поля обычного объекта не уведомляет реактивные связи. Подробности — [реактивность](/guide/reactivity).

## Условная субформа

```html
<template d:if="[[editing]]">
  <pl-form-handbook.details draft="{{draft}}"></pl-form-handbook.details>
</template>
```

После первого показа `d:if` сохраняет экземпляр и его внутреннее состояние. Добавь `d:restamp`, если требуется удалять субформу при скрытии и создавать заново при показе. Данные, которые должны пережить пересоздание, храни у родителя.

Скрытая субформа остаётся подключённой: запросы и внешние подписки не останавливаются автоматически. Если активность зависит от выбранной вкладки, передавай отдельное свойство активности и управляй работой через него.

## Границы ответственности

Родитель отвечает за выбор записи, общий результат команд и навигацию. Субформа отвечает за свой участок интерфейса и объявленные входные/выходные свойства. Переиспользуемый элемент, которому не нужны возможности формы, лучше оформить как `PlElement` в `components/`.

Не вызывай `close()` у встроенной субформы для обычного переключения раздела: видимостью и наличием вложенной формы управляет шаблон родителя. `close()` относится к жизненному циклу открытой формы и контейнера навигации.

Валидацию внутри каждой субформы агрегируй явно и передавай `invalid` родителю. Наблюдатель родителя не обходит произвольные вложенные Shadow DOM автоматически.

## Композиция в Demo-company

В `modules/demo-company/forms/level3/employee/main.js` родитель хранит `employee`, `contacts` и `cards`. Редакторы получают соответствующие части:

```html
<pl-form-level3.employee.general employee="{{employee}}"
  invalid="{{employeeInvalid}}"></pl-form-level3.employee.general>
<pl-form-level3.employee.contacts contacts="{{contacts}}"
  invalid="{{contactsInvalid}}"></pl-form-level3.employee.contacts>
<pl-form-level3.employee.cards cards="{{cards}}"
  invalid="{{cardsInvalid}}"></pl-form-level3.employee.cards>
```

В существующей форме команда родителя сохраняет сотрудника и журнал контактов через `/employee/save`. Для независимого сохранения части можно перенести её действие и наблюдатель внутрь редактора, а родителю вернуть `changed` и `invalid`. Не ставь при этом второй наблюдатель над теми же данными в родителе: их снимки будут пересекаться.

Сравни [сохранение персональных данных и контактов](/nfjs/partial-save) и [отдельные редакторы личных карточек](/nfjs/nested-changes). Серверную операцию редактора можно описать через [REST](/nfjs/rest) или [serverEndpoints](/nfjs/server-endpoints).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/front-pl/components/pl-form.js" target="_blank" rel="noopener">pl-form.js</a>
  <a href="https://github.com/nf-framework/demo/blob/master/modules/demo-company/forms/level3/employee/main.js" target="_blank" rel="noopener">Demo-company: форма сотрудника</a>
</footer>
