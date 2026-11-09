# Серверные операции через serverEndpoints

`serverEndpoints` описывает серверные операции прямо в классе формы. NFJS извлекает этот блок из файла, сохраняет на сервере и удаляет из JavaScript, отправляемого браузеру. Маршрут FSE (Form Server Endpoints) связывает описание с `pl-action`, `pl-dataset` или `pl-access` по имени формы и `id` компонента.

## Маршрут и объявление

Маршрут имеет форму `POST /@nfjs/front-pl/fse/:form/:type/:id`. В `:form` передаётся имя формы с точками, например `level3.employee.main`; `:type` — `action`, `dataset` или `access`; `:id` совпадает с `id` компонента. Middleware проверяет сессию и авторизацию, загружает описание серверной операции, затем разбирает JSON.

Для действия без `endpoint` компонент отправляет `POST /@nfjs/front-pl/fse/${formName}/action/${id}` с телом `{ args }`. Внутри класса `PlForm` объяви обычное поле экземпляра:

```js
serverEndpoints = {
  action: {
    aSaveEmployee: {
      '@main': {
        action: 'company.employee.mod',
        type: 'broker',
        out: 'id'
      }
    }
  }
}//serverEndpoints
```

Сохраняй завершающий комментарий `//serverEndpoints`: по нему загрузчик находит конец блока. В текущем загрузчике перед ним нужна закрывающая `}`, без точки с запятой. Несколько примеров ниже показывают отдельные фрагменты конфигурации; в одном классе объедини их в одно поле `serverEndpoints`.

`@main` описывает основное действие. `type: 'query'` выполняет текст запроса, `type: 'broker'` вызывает бизнес-операцию, `type: 'func'` — функцию провайдера. Запись данных выполняй через broker. Без явного `provider` используется `default`.

Для `pl-dataset` конфигурация содержит `text` с запросом, необязательные `provider` и `serverArgs`. Для доступа — запрашиваемые `roles`, `privs` или `options`. Обработчик типа `access` регистрирует пакет `@nfjs/back-dbfw-ui-pl`.

Для чтения одной записи используй `type: 'query'`. Исполнитель действия берёт первую строку результата и помещает её в `data`. Для коллекции нужен `pl-dataset`:

```html
<pl-action id="aGetEmployee"
  args="[[_compose('employeeId', employeeId)]]"></pl-action>
```

```js
serverEndpoints = {
  action: {
    aGetEmployee: {
      '@main': {
        type: 'query',
        action: `select id, firstname, lastname, patronymic, gender, birthdate
          from company.v4employee where id = :employeeId`
      }
    }
  }
}//serverEndpoints
```

```html
<pl-dataset id="dsContacts" data="{{contacts}}"
  args="[[_compose('employeeId', employeeId)]]"></pl-dataset>
<pl-access id="acPrivs" data="{{access}}"></pl-access>
```

```js
serverEndpoints = {
  dataset: {
    dsContacts: {
      text: `select id, employee_id, contact_type, contact
        from company.v4employee_contact
        where employee_id = :employeeId`
    }
  },
  access: {
    acPrivs: {
      privs: ['company.employee.upd', 'company.employee_contact.add']
    }
  }
}//serverEndpoints
```

`pl-dataset` передаёт аргументы и `control`; сервер выполняет SQL из `text` с этими параметрами. `serverArgs` добавляет серверные значения из сессии через `_compose`. `pl-access` получает группы доступа, перечисленные в конфигурации. Представления `company.v4employee` и `company.v4employee_contact` проверяют права чтения.

## Вложенные коллекции и `paths`

Вложенные ключи объекта задают путь в корневом `args`. Для коллекции перечисляются обработчики изменений: `@add`, `@upd`, `@del`. В `pl-action paths` указываются массивы, из которых нужно отправить изменённые строки. Несколько путей записываются через запятую, вложенность — через точку.

Ниже — альтернативная FSE-конфигурация для сотрудника и контактов. Существующий Demo-company сохраняет их через REST `/employee/save`. В этом варианте поля сотрудника располагаются на верхнем уровне аргументов, коллекция контактов — в `contacts`:

```html
<pl-action id="aSaveEmployee" paths="contacts"
  args="[[_compose('...;contacts', employee, contacts)]]"></pl-action>
```

<details class="docs-code">
<summary>Код JavaScript</summary>

```js
serverEndpoints = {
  action: {
    aSaveEmployee: {
      '@main': {
        action: 'company.employee.mod',
        type: 'broker',
        out: 'id'
      },
      contacts: {
        '@add': [{
          action: 'company.employee_contact.add',
          type: 'broker',
          args: {
            '...': '*',
            employee_id: '/id'
          }
        }],
        '@upd': [{
          action: 'company.employee_contact.upd',
          type: 'broker',
          args: {
            '...': '*',
            employee_id: '/id'
          }
        }],
        '@del': [{
          action: 'company.employee_contact.del',
          type: 'broker',
          args: { '...': '*' }
        }]
      }
    }
  }
}//serverEndpoints
```

</details>

`@main` получает весь корневой объект. Карта `args` применяется к вложенным обработчикам; для основной записи нужную форму аргументов собирай на клиенте. `company.employee.mod` в Demo-company выбирает существующую операцию `add` или `upd` по наличию `id`. Новая операция с кодом `mod` для этого не регистрируется.

Стандартный табличный broker Demo-company оставляет только ключи, совпавшие с колонками раздела. Поэтому вложенное поле `contacts` не попадёт в запись сотрудника. `out: 'id'` переносит полученный `data.id` в корневые аргументы; `employee_id: '/id'` передаёт его каждому контакту.

`args` во вложенном обработчике — объект соответствий. Ключи становятся именами аргументов, строки-значения вычисляются на сервере:

| Запись | Значение |
| --- | --- |
| `'...': '*'` | Перенести поля текущей строки |
| `id: '*.id'` | Взять только `id` текущей строки |
| `employee_id: '/id'` | Взять `id` из корневых аргументов |
| `card_id: '/cards.id'` | Взять `id` текущей карточки на родительском уровне |

Во время обхода `/cards` обозначает текущую строку карточки. Сокращения `..` и `**` для перехода к родителю не поддерживаются.

Порядок ключей имеет значение. Сначала используй `'...': '*'`, затем задай связь с родителем: `employee_id: '/id'` или `card_id: '/cards.id'`. Последнее значение перекроет устаревший идентификатор, который мог прийти в самой дочерней строке. Стандартный табличный broker также отбрасывает служебный `$action`.

## Три уровня: сотрудник, карточка, нетрудоспособность

Исполнитель рекурсивно обходит вложенные пути. В Demo-company связи устроены так: `employee_card.employee_id → employee.id`, `employee_card_inoperability.card_id → employee_card.id`. После создания сотрудника карточка получает его `/id`. После создания карточки её обработчик записывает `out: 'id'`, и вложенный период получает `/cards.id`.

Фрагмент конфигурации для этих трёх уровней:

<details class="docs-code">
<summary>Код JavaScript</summary>

```js
serverEndpoints = {
  action: {
    aSaveEmployee: {
      '@main': {
        action: 'company.employee.mod',
        type: 'broker',
        out: 'id'
      },
      cards: {
        '@add': [{
          action: 'company.employee_card.add',
          type: 'broker',
          out: 'id',
          args: {
            '...': '*',
            employee_id: '/id'
          }
        }],
        '@upd': [{
          action: 'company.employee_card.upd',
          type: 'broker',
          out: 'id',
          args: {
            '...': '*',
            employee_id: '/id'
          }
        }],
        '@del': [{
          action: 'company.employee_card.del',
          type: 'broker',
          args: { '...': '*' }
        }],
        inoperabilities: {
          '@add': [{
            action: 'company.employee_card_inoperability.add',
            type: 'broker',
            args: {
              '...': '*',
              card_id: '/cards.id'
            }
          }],
          '@upd': [{
            action: 'company.employee_card_inoperability.upd',
            type: 'broker',
            args: {
              '...': '*',
              card_id: '/cards.id'
            }
          }],
          '@del': [{
            action: 'company.employee_card_inoperability.del',
            type: 'broker',
            args: { '...': '*' }
          }]
        }
      }
    }
  }
}//serverEndpoints
```

</details>

На форме для этой конфигурации нужны `paths="cards,cards.inoperabilities"` и аргументы с полями сотрудника и массивом `cards`. По `$action` строки выбирается обработчик `@add`, `@upd` или `@del`. Фильтр `@each` запускает обработчик для каждой строки. Вложенный обход продолжается и для родителя с `$action: 'touch'`; отдельный `@touch` не нужен.

При смешанных правках в `pl-data-observer` карточка может одновременно оказаться в `upd` и `touch`, что приведёт к повторному обходу её периодов. Для такого редактора выделяй отдельные наблюдатели и команды по карточкам. Подробный [разбор этого случая](/nfjs/nested-changes).

```html
<pl-action id="aSaveEmployee" paths="cards,cards.inoperabilities"
  args="[[_compose('...;cards', employee, cards)]]"></pl-action>
```

## `out` и частичный вызов

`out: 'id'` переносит `result.data.id` в `id` текущего контекста. Во вложенном обработчике это текущая строка, поэтому следующий уровень может прочитать `/cards.id`. Для переименования поддерживается `out: 'cardId:id'`: слева — целевой путь в аргументах, справа — поле ответа.

Отдельное действие позволяет сохранить периоды существующей карточки без изменения её остальных полей и сотрудника. Объяви на форме `cardId`, коллекцию `inoperabilities` без начального `[]` и флаг `periodsChanged`. У этой коллекции свои `pl-dataset` и `pl-data-observer`:

```html
<pl-action id="aSavePeriods" paths="inoperabilities"></pl-action>
<pl-dataset id="dsPeriods" data="{{inoperabilities}}"
  args="[[_compose('cardId', cardId)]]" required-args="cardId"></pl-dataset>
<pl-data-observer id="obPeriods" data="{{inoperabilities}}"
  is-changed="{{periodsChanged}}"></pl-data-observer>
```

<details class="docs-code">
<summary>Код JavaScript</summary>

```js
serverEndpoints = {
  action: {
    aSavePeriods: {
      '@main': {},
      inoperabilities: {
        '@add': [{
          action: 'company.employee_card_inoperability.add',
          type: 'broker',
          args: {
            '...': '*',
            card_id: '/cardId'
          }
        }],
        '@upd': [{
          action: 'company.employee_card_inoperability.upd',
          type: 'broker',
          args: {
            '...': '*',
            card_id: '/cardId'
          }
        }],
        '@del': [{
          action: 'company.employee_card_inoperability.del',
          type: 'broker',
          args: { '...': '*' }
        }]
      }
    }
  },
  dataset: {
    dsPeriods: {
      text: `select id, card_id, date_begin, date_end, type, other_type_description, file
        from company.v4employee_card_inoperability where card_id = :cardId`
    }
  }
}//serverEndpoints
```

</details>

```js
await this.$.aSavePeriods.execute({
  cardId: this.cardId,
  inoperabilities: this.inoperabilities
});
await this.$.dsPeriods.execute();
this.$.obPeriods.snapshot();
```

При пустом `@main` корневой `data` будет `{}`. `out` обновляет аргументы на сервере; результаты дочерних операций находятся в `_childs` ответа, а `pl-action.execute()` возвращает только корневой `data`. Идентификаторы новых периодов не появятся в клиентской модели автоматически.

Поэтому после успеха перечитай только `dsPeriods`, затем создай снимок этой независимой коллекции. Первоначальное чтение перед редактированием тоже завершается снимком. На время сохранения и повторного чтения запрети ввод в этой части. Данные и наблюдатели остальных частей остаются нетронутыми. См. [сохранение части формы](/nfjs/partial-save).

Для одного провайдера все операции действия выполняются в одной транзакции: сначала `@main`, затем обработчики строк и их дочерних уровней. При ошибке выполняется откат. В REST-примере те же границы задаются явно в обработчике через `begin`, `commit`, `rollback`.

См. также: [REST-маршруты Demo-company](/nfjs/rest), [действия](/nfjs/actions), [коллекции](/nfjs/datasets), [доступ](/nfjs/access).

<footer class="docs-sources">
  <span>Исходники:</span>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/front-pl/lib/FormServerEndpoints.js" target="_blank" rel="noopener">FormServerEndpoints.js</a>
  <a href="https://cdn.jsdelivr.net/npm/@nfjs/front-pl/lib/CustomElementsLoader.js" target="_blank" rel="noopener">CustomElementsLoader.js</a>
</footer>
