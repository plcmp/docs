# Pl-Input
Текстовое поле предоставляет пользователю возможность ввода значений в форму.

<pl-input label="Подпись"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Текст"></pl-input>
</details>


## Examples

### Orientation
Используйте `orientation` для изменения расположения текста

<pl-input label="horizontal orientation" label-width="130" orientation="horizontal"></pl-input>
<br>
<pl-input label="vertical orientation" orientation="vertical"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="horizontal orientation" label-width="130" orientation="horizontal"></pl-input>

    <pl-input label="vertical orientation" orientation="vertical"></pl-input>
</details>


### Type
Используйте `type` для измененя способа ввода значений

<pl-input label="text" type="text"></pl-input>
<br>
<pl-input label="number" type="number"></pl-input>
<br>
<pl-input label="password" type="password"></pl-input>
<br>
<pl-input label="range" type="range"></pl-input>
<br>
<pl-input label="color" type="color"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="text" type="text"></pl-input>
    <pl-input label="number" type="number"></pl-input>
    <pl-input label="password" type="password"></pl-input>
    <pl-input label="range" type="range"></pl-input>
    <pl-input label="color" type="color"></pl-input>
</details>

### Value
Используйте `value` для того что бы установить значение по умолчанию

<pl-input label="Поле со значением по умолчанию" value="тест" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Поле со значением по умолчанию" value="тест" orientation="horizontal"></pl-input>
</details>

### ContentWidth
Используйте `сontentWidth` для установки ширины контейнера

<pl-input label="contentWidth=500" content-width="500" orientation="horizontal"></pl-input>
<br>
<pl-input label="contentWidth=130" content-width="130" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="content-width=500" content-width="500" orientation="horizontal"></pl-input>

    <pl-input label="content-width=130" content-width="130" orientation="horizontal"></pl-input>
</details>

### LabelWidth
Используйте `labelWidth` для установки ширины подписи

<pl-input label="labelWidth=110" label-width="110" orientation="horizontal"></pl-input>
<br>
<pl-input label="labelWidth=130" label-width="130" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="labelWidth=110" label-width="110" orientation="horizontal"></pl-input>

    <pl-input label="labelWidth=130" label-width="130" orientation="horizontal"></pl-input>
</details>

### Title
Используйте `title` что бы вывести подсказку при наведении на поле ввода

<pl-input label="Всплывающая подсказка" label-width="170" title="Текст подсказки" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Поле ввода с подсказкой" label-width="170" title="Текст подсказки" orientation="horizontal"></pl-input>
</details>

### Placeholder
Используйте `placeholder` для того что бы вывести подсказку в поле у которого еще не введено значение

<pl-input label="Подсказка в поле ввода" label-width="170" placeholder="Текст подсказки" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Подсказка в поле ввода" label-width="170" placeholder="Текст подсказки" orientation="horizontal"><pl-input>
</details>

### Pattern
Используйте `pattern` для того что бы установить регулярное выражение для валидации значения

<pl-input label="Поле ввода с валидацией" label-width="170" pattern="^\d+$" placeholder="Для ввода доступны только цифры" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Подсказка в поле ввода" label-width="170" placeholder="Текст подсказки" orientation="horizontal">
    <pl-input>
</details>

### Min max step
Для поля с `type = number` используйте `min` для установки минимального допустимого значения, `max` для установки макисмального допустимого значения, `step` для шага изменения значения.

<pl-input label="Числа от 100" type="number" label-width="100" min="100" orientation="horizontal"></pl-input>
<br>
<pl-input label="Числа до 5" type="number" label-width="100" max="5" orientation="horizontal"></pl-input>
<br>
<pl-input label="Изменение значения на 100" type="number" label-width="100" step="100" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Числа от 100" type="number" label-width="100" min="100" orientation="horizontal"></pl-input>
    <br>
    <pl-input label="Числа до 5" type="number" label-width="100" max="5" orientation="horizontal"></pl-input>
    <br>
    <pl-input label="Изменение значения на 100" type="number" label-width="100" step="100" orientation="horizontal"></pl-input>
</details>

### Readonly
Используйте `readonly` для запрета ввода значений

<pl-input label="Заблокированное поле" value="Тест" readonly="true" label-width="140" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Заблокированное поле" value="Тест" readonly="true" label-width="140" orientation="horizontal"></pl-input>
</details>


### Required
Используйте `required` если поле обязатльно для заполнения

<pl-input label="Не заполненное поле" required="true" label-width="140" orientation="horizontal"></pl-input>
<br>
<pl-input label="Заполненное поле" required="true" value="Тест" readonly="true" label-width="140" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Не заполненное поле" required="true" label-width="140" orientation="horizontal"></pl-input>

    <pl-input label="Заполненное поле" required="true" value="Тест" readonly="true" label-width="140" orientation="horizontal"></pl-input>
</details>


### Invalid (под вопросом)
Используйте `invalid` что бы пометь поле как не корректно заполненное

<pl-input label="Не валдное поле" invalid="false" label-width="140" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Не заполненное поле" required="true" label-width="140" orientation="horizontal"></pl-input>

    <pl-input label="Заполненное поле" required="true" value="Тест" readonly="true" label-width="140" orientation="horizontal"></pl-input>
</details>

### Disabled
Используйте `disabled` что бы сделать поле не активным
<pl-input label="Активное поле" disabled="false" label-width="140" orientation="horizontal"></pl-input>
<br>
<pl-input label="Не активное поле" disabled="true" label-width="140" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Активное поле" disabled="false" label-width="140" orientation="horizontal"></pl-input>

    <pl-input label="Не активное поле" disabled="true" label-width="140" orientation="horizontal"></pl-input>
</details>

### Stretch
Используйте `stretch` что бы растянуть компонент по ширине внешнего контейнера
<pl-input label="Не растянуто" stretch="false" label-width="140" orientation="horizontal"></pl-input>
<br>
<pl-input label="Растянуто" stretch="true" label-width="140" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Не растянуто" stretch="false" label-width="140" orientation="horizontal"></pl-input>

    <pl-input label="Растянуто" stretch="true" label-width="140" orientation="horizontal"></pl-input>
</details>

### Slots
Используйте `label-prefix` или `label-suffix` для того что бы добавить иконку к подписи
<pl-input label="Текст" label-width="60" orientation="horizontal">
    <pl-icon slot="label-prefix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
</pl-input>
<br>
<pl-input label="Текст" label-width="60" orientation="horizontal">
    <pl-icon slot="label-suffix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
</pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Текст" label-width="60" orientation="horizontal">
        <pl-icon slot="label-prefix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
    </pl-input>
    <br>
    <pl-input label="Текст" label-width="60" orientation="horizontal">
        <pl-icon slot="label-suffix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
    </pl-input>
</details>

Используйте `prefix` или `suffix` для того что бы добавить иконку к полю ввода
<pl-input label="Текст" label-width="60" orientation="horizontal">
    <pl-icon slot="prefix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
</pl-input>
<br>
<pl-input label="Текст" label-width="60" orientation="horizontal">
    <pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
</pl-input>

<details>
    <summary>html</summary>

    
    ```html
    <pl-input label="Текст" label-width="60" orientation="horizontal">
        <pl-icon slot="prefix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
    </pl-input>
    <br>
    <pl-input label="Текст" label-width="60" orientation="horizontal">
        <pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
    </pl-input>
    ```
</details>


## Properties

| Name  | Description  | ReflectsToAttribute | Type | Default
|---|---|:----:|---|:---:|
| `label` | Текст подписи поля| - | string | (empty) 
| `orientation` | Расположение подписи относительно текстового поля | - | `horizontal \| vertical` | `vertical`
| `type` | Тип ввода | -| `text \| number \| password \| range \| color` | `text`
| `value` | Значение введеное в поле |- | `string` | (empty)
| `contentWidth` | Значение ширины поля ввода<br> *По умолчанию задается ширина в 240px* |  - | `number` | (empty)
| `labelWidth` | Значение ширны подписи поля<br> *По умолчанию задается ширина в 240px*  |  - | `number` | (empty)
| `title` | Текст подсказки  |  - | `string` | (empty)
| `placeholder` | Выводит текст внутри поля формы, который исчезает при получении фокуса |  - | `string` | (empty)
| `pattern` | Регулярное выражение для валидации значения | - | `string` | (empty)
| `min` | Минимальное число которое можно ввести в поле<br> *Только для `type = number`* | - | `number` | (empty)
| `max` | Максимальное число которое можно ввести в поле<br> *Только для `type = number`* | - | `number` | (empty)
| `step` | Максимальное число которое можно ввести в поле<br> *Только для `type = number`* | - | `boolean` | (empty)
| `readonly` | Значение доступно только для чтения  | - | `boolean` | `false`
| `required` | Значение обязательно для заполнения  | - | `boolean` | `false`
| `invalid` | Значение не прошло валидацию  | - | `boolean` | `false`
| `disabled` | Отвечает за отключение этой компоненты | + | `boolean` | `false`
| `stretch` | Растянуть этот компонент  | + | `boolean` | `false`
| `hidden` | Отвечает за отображение этой компоненты  | + | `boolean` | `false`

## Slots

| Name  | Description  
|---|---
| `label-prefix` | Слот для префикса подписи поля ввода, значки располагаются перед подписью
| `label-suffix` | Слот для суфикса подписи поля ввода, значки располагаются после подписи
| `prefix` | Слот для префикса поля ввода, значки располагаются в начале поля ввода
| `suffix` | Слот для суфикса поля ввода, значки располагаются в конце поля ввода