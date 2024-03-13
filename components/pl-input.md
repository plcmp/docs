# Pl-Input
Текстовое поле предоставляет пользователю возможность ввода значений в форму.

<pl-input label="Текст"></pl-input>

```html
<pl-input label="Текст"></pl-input>
```


## Примеры


### Ориентация
Используйте `orientation` для изменения расположения текста
<pl-input label="Текст" orientation="vertical"></pl-input>
<br>
<pl-input label="Текст" orientation="horizontal"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Текст" orientation="vertical"></pl-input>
    <pl-input label="Текст" orientation="horizontal"></pl-input>
</details>


### Тип
Используйте `type` для измененя способа ввода значений
<pl-input label="Текст" type="text"></pl-input>
<br>
<pl-input label="Число" type="number"></pl-input>
<br>
<pl-input label="Пароль" type="password"></pl-input>
<br>
<pl-input label="Ползунок" type="range"></pl-input>
<br>
<pl-input label="Цвет" type="color"></pl-input>

<details>
    <summary>html</summary>

    <pl-input label="Текст" type="text"></pl-input>
    <pl-input label="Число" type="number"></pl-input>
    <pl-input label="Пароль" type="password"></pl-input>
    <pl-input label="Ползунок" type="range"></pl-input>
    <pl-input label="Цвет" type="color"></pl-input>
</details>


### Слоты
Используйте `label-prefix` или `label-suffix` для того что бы добавить иконку к метке
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
| `label` | Текст метки поля| - | string | (empty) 
| `orientation` | Расположение метки относительно текстового поля | - | `horizontal \| vertical` | `vertical`
| `type` | Тип ввода | -| `text \| number \| password \| range \| color` | `text`
| `value` | Значение введеное в поле |- | `string` | (empty)
| `contentWidth` | Значение ширины поля ввода<br> *По умолчанию растягивается* |  - | `number` | (empty)
| `labelWidth` | Значение ширны метки поля<br> *По умолчанию задается ширина в 240px*  |  - | `number` | (empty)
| `title` | Текст подсказки  |  - | `string` | (empty)
| `placeholder` | Выводит текст внутри поля формы, который исчезает при получении фокуса |  - | `boolean` | `false`
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
| `label-prefix` | Слот для префикса метки поля ввода, значки располагаются перед меткой
| `label-suffix` | Слот для суфикс метки поля ввода, значки располагаются после меткой
| `prefix` | Слот для префикса поля ввода, значки располагаются внутри в начале поля ввода
| `suffix` | Слот для суфикса поля ввода, значки располагаются внутри в конце поля ввода