# Pl-Button

Buttons represent actions that are available to the user.

<pl-flex-layout>
    <pl-button variant="primary" label="Button"></pl-button>
</pl-flex-layout>

```html
<pl-button variant="primary" label="Button"></pl-button>
```

## Variants

Use the `variant` attribute to set the button's variant.

<pl-flex-layout>
    <pl-button variant="primary" label="Primary"></pl-button>
    <pl-button variant="secondary" label="Secondary"></pl-button>
    <pl-button variant="ghost" label="Ghost"></pl-button>
    <pl-button variant="link" label="Link"></pl-button>
</pl-flex-layout>

```html
<pl-button variant="primary" label="Primary"></pl-button>
<pl-button variant="secondary" label="Secondary"></pl-button>
<pl-button variant="ghost" label="Ghost"></pl-button>
<pl-button variant="link" label="Link"></pl-button>
```

Use the `negative` attribute to set the button's negative variant.

<pl-flex-layout>
    <pl-button negative variant="primary" label="Primary"></pl-button>
    <pl-button negative variant="secondary" label="Secondary"></pl-button>
    <pl-button negative variant="ghost" label="Ghost"></pl-button>
    <pl-button negative variant="link" label="Link"></pl-button>
</pl-flex-layout>

```html
<pl-button negative variant="primary" label="Primary"></pl-button>
<pl-button negative variant="secondary" label="Secondary"></pl-button>
<pl-button negative variant="ghost" label="Ghost"></pl-button>
<pl-button negative variant="link" label="Link"></pl-button>
```

## Slots

Use the `prefix` and `suffix` slots to add icons.

<pl-flex-layout>
    <pl-button  variant="primary" label="Settings">
        <pl-icon slot="prefix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
    </pl-button>
    <pl-button variant="secondary" label="Print">
        <pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="print"></pl-icon>
    </pl-button>
    <pl-button variant="ghost" label="Download">
    <pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="download"></pl-icon>
    <pl-icon slot="prefix" variant="primary" iconset="pl-default" size="16" icon="report"></pl-icon>
    </pl-button>
    <pl-button variant="link" label="Send">
        <pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="send"></pl-icon>
    </pl-button>
</pl-flex-layout>

```html
<pl-button  variant="primary" label="Settings">
    <pl-icon slot="prefix" variant="primary" iconset="pl-default" size="16" icon="settings"></pl-icon>
</pl-button>
<pl-button variant="secondary" label="Print">
    <pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="print"></pl-icon>
</pl-button>
<pl-button variant="ghost" label="Download">
<pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="download"></pl-icon>
<pl-icon slot="prefix" variant="primary" iconset="pl-default" size="16" icon="report"></pl-icon>
</pl-button>
<pl-button variant="link" label="Send">
    <pl-icon slot="suffix" variant="primary" iconset="pl-default" size="16" icon="send"></pl-icon>
</pl-button>
```

## Loading

Use the `loading` attribute to make a button busy. Clicks will be suppressed until the loading state is removed.

```html
<pl-button loading variant="primary" label="Loading..."></pl-button>
<pl-button loading variant="secondary" label="Loading..."></pl-button>
<pl-button loading variant="ghost" label="Loading..."></pl-button>
<pl-button loading variant="link" label="Loading..."></pl-button>
```

<pl-flex-layout>
    <pl-button loading variant="primary" label="Loading..."></pl-button>
    <pl-button loading variant="secondary" label="Loading..."></pl-button>
    <pl-button loading variant="ghost" label="Loading..."></pl-button>
    <pl-button loading variant="link" label="Loading..."></pl-button>
</pl-flex-layout>

## Disabled

Use the `disabled` attribute to disable a button. Clicks will be suppressed until the disabled state is removed.

<pl-flex-layout>
    <pl-button disabled variant="primary" label="Primary"></pl-button>
    <pl-button disabled variant="secondary" label="Secondary"></pl-button>
    <pl-button disabled variant="ghost" label="Ghost"></pl-button>
    <pl-button disabled variant="link" label="Link" ></pl-button>
</pl-flex-layout>

```html 
<pl-button disabled variant="primary" label="primary"></pl-button>
<pl-button disabled variant="secondary" label="secondary"></pl-button>
<pl-button disabled variant="ghost" label="ghost"></pl-button>
<pl-button disabled variant="link" label="link" ></pl-button>
```

## CSS Variables

| variable  | description  |   
|---|---|
|  --pl-button-background | background color of button  |   
|  --pl-button-color | text color of button  |   
|  --pl-button-border | border of button  |   
