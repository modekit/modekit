# Button

Buttons let users trigger an action or make a choice. ModeKit keeps one native button API while
adapting its presentation to the active platform mode.

## Preview

Use the platform switcher to compare the same example on Web, iOS, and Android. The preview and the
source panel both come from the same Vue single-file component.

<ComponentPreview name="button/ButtonOverview" />

## Usage

```vue
<script setup lang="ts">
import { MkButton } from '@modekit/vue'
</script>

<template>
  <MkButton variant="primary">Continue</MkButton>
</template>
```

## Props

| Prop       | Type                                                      | Default     | Description                                               |
| ---------- | --------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive'` | `'primary'` | Sets the semantic visual emphasis.                        |
| `size`     | `'sm' \| 'md' \| 'lg'`                                    | `'md'`      | Sets the control size.                                    |
| `loading`  | `boolean`                                                 | `false`     | Marks the button busy and prevents additional activation. |
| `disabled` | `boolean`                                                 | `false`     | Disables the native button.                               |
| `type`     | `'button' \| 'submit' \| 'reset'`                         | `'button'`  | Sets the native button type.                              |

All other native button attributes and listeners are forwarded to the underlying `<button>`.

## Slots

| Slot      | Description                                           |
| --------- | ----------------------------------------------------- |
| `default` | Button label or content.                              |
| `loader`  | Loading indicator rendered when `loading` is enabled. |

## Accessibility

`MkButton` renders a native `<button>`, preserves keyboard behavior, and exposes `aria-busy="true"`
while loading. Loading also disables activation. Keep the visible label descriptive, and mark purely
decorative loader content with `aria-hidden="true"`.
