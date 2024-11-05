# Pl-Button 
Icon buttons represent actions that are available to the user.

<pl-icon-button variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>

```html
<pl-icon-button variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>

```

## Examples

### Variants

Use the `variant` property to set the button's variant.

<pl-flex-layout>
    <pl-icon-button variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button variant="secondary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button variant="ghost" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button variant="link" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
</pl-flex-layout>

```html
    <pl-icon-button variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button variant="secondary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button variant="ghost" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button variant="link" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
```

Use the `negative` attribute to set the button's negative variant.

<pl-flex-layout>
    <pl-icon-button negative variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button negative variant="secondary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button negative variant="ghost" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button negative variant="link" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
</pl-flex-layout>

```html
    <pl-icon-button negative variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button negative variant="secondary" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button negative variant="ghost" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
    <pl-icon-button negative variant="link" iconset="pl-default" size="16" icon="settings"></pl-icon-button>
```

### Iconset and icon

Use the `icon` and `iconset` properties to specify icon for button. Different `icon` with the same name can be across different `iconset`'s;

<pl-flex-layout>
    <pl-icon-button  icon="close-circle-filled" iconset="pl-default"></pl-icon-button>
    <pl-icon-button  icon="reload" iconset="pl-default"></pl-icon-button>
    <pl-icon-button  icon="download" iconset="pl-default"></pl-icon-button>
    <pl-icon-button  icon="upload" iconset="pl-default"></pl-icon-button>
</pl-flex-layout>

```html
    <pl-icon-button  icon="close-circle-filled" iconset="pl-default"></pl-icon-button>
    <pl-icon-button  icon="reload" iconset="pl-default"></pl-icon-button>
    <pl-icon-button  icon="download" iconset="pl-default"></pl-icon-button>
    <pl-icon-button  icon="upload" iconset="pl-default"></pl-icon-button>
```


### Loading and animated

Use the `loading` attribute to make a button busy. Clicks will be suppressed until the loading state is removed.
Use the `animated` attribute to run icon animation.

<pl-flex-layout>
    <pl-icon-button loading variant="primary" animated icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button loading variant="secondary"  animated icon="reload" iconset="pl-default"></pl-icon-button>
    <pl-icon-button loading variant="ghost"  animated icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button loading variant="link"  animated icon="reload" iconset="pl-default"></pl-icon-button>
</pl-flex-layout>

```html
    <pl-icon-button loading variant="primary" animated icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button loading variant="secondary"  animated icon="reload" iconset="pl-default"></pl-icon-button>
    <pl-icon-button loading variant="ghost"  animated icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button loading variant="link"  animated icon="reload" iconset="pl-default"></pl-icon-button>
```


### Disabled

Use the `disabled` attribute to disable a button. Clicks will be suppressed until the disabled state is removed.

<pl-flex-layout>
    <pl-icon-button disabled variant="primary"  icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button disabled variant="secondary"   icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button disabled variant="ghost"   icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button disabled variant="link"   icon="search" iconset="pl-default"></pl-icon-button>
</pl-flex-layout>

```html 
    <pl-icon-button disabled variant="primary"  icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button disabled variant="secondary"   icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button disabled variant="ghost"   icon="search" iconset="pl-default"></pl-icon-button>
    <pl-icon-button disabled variant="link"   icon="search" iconset="pl-default"></pl-icon-button>
```

## Properties

| Name       | Description                 | ReflectsToAttribute | Type                                    | Default      |
| ---------- | --------------------------- | :-----------------: | --------------------------------------- | ------------ |
| `variant`  | The button's variant        |          +          | `primary \| secondary \| ghost \| link` | `secondary`  |
| `iconset`  | The iconset                 |          +          | `string`                                | `pl-default` |
| `icon`     | The iconset icon name       |          +          | `string`                                | `undefined`  |
| `disabled` | The button's disabled state |          +          | `boolean`                               | `false`      |
| `hidden`   | The button's hidden state   |          +          | `boolean`                               | `false`      |
| `negative` | The button's negative state |          +          | `boolean`                               | `false`      |
| `loading`  | The button's loading state  |          +          | `boolean`                               | `false`      |
| `animated` | The icon animation start    |          -          | `boolean`                               | `false`      |