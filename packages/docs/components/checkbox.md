# Checkbox

Checkbox lets users select one or more independent options. `MkCheckbox` combines Reka UI's
keyboard, ARIA, indeterminate, and form behavior with ModeKit's reusable [Label](/components/label)
and a complete field presentation.

## Usage

<ComponentPreview name="checkbox/CheckboxBasic" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MkCheckbox } from '@modekit/vue'

const accepted = ref(false)
</script>

<template>
  <MkCheckbox
    v-model="accepted"
    label="Accept terms and conditions"
    description="You can review the terms before continuing."
  />
</template>
```

## Features

- Controlled and uncontrolled values
- Checked, unchecked, and indeterminate states
- Integrated label and description
- Native form participation through Reka UI
- Disabled, required, and invalid states
- Default and full-surface card presentations
- Three sizes derived from ModeKit's shared radius scale
- Global and local slot-class configuration

## API

### Props

| Prop           | Type                         | Default     | Description                                       |
| -------------- | ---------------------------- | ----------- | ------------------------------------------------- |
| `modelValue`   | `boolean \| 'indeterminate'` | —           | Controls the current state with `v-model`.        |
| `defaultValue` | `boolean \| 'indeterminate'` | `false`     | Sets the initial uncontrolled state.              |
| `label`        | `string`                     | —           | Sets the visible label.                           |
| `description`  | `string`                     | —           | Adds supporting text linked to the control.       |
| `size`         | `'sm' \| 'md' \| 'lg'`       | `'md'`      | Sets control, icon, text, and spacing dimensions. |
| `variant`      | `'default' \| 'card'`        | `'default'` | Sets the field presentation.                      |
| `disabled`     | `boolean`                    | `false`     | Prevents interaction and dims the complete field. |
| `required`     | `boolean`                    | `false`     | Marks the checkbox as required.                   |
| `name`         | `string`                     | —           | Sets the form field name.                         |
| `value`        | `string \| number`           | `'on'`      | Sets the submitted value when checked.            |
| `ui`           | `CheckboxUI`                 | —           | Adds classes to the root and named parts.         |

Native button accessibility attributes and event listeners are forwarded to the interactive
checkbox control. Native `class` and `style` apply to the complete field wrapper.

### Events

| Event               | Payload                      | Description                     |
| ------------------- | ---------------------------- | ------------------------------- |
| `update:modelValue` | `boolean \| 'indeterminate'` | Emitted when the state changes. |

### Slots

| Slot          | Props             | Description                            |
| ------------- | ----------------- | -------------------------------------- |
| `indicator`   | `{ state }`       | Replaces the check or minus indicator. |
| `label`       | `{ label }`       | Replaces the label content.            |
| `description` | `{ description }` | Replaces the supporting text.          |

## States

Use `model-value="indeterminate"` when a parent option represents a partially selected group. The
next user activation changes it to `true`. Pass `aria-invalid="true"` when validation fails; the
control then uses ModeKit's semantic destructive role.

```vue
<MkCheckbox model-value="indeterminate" aria-label="Select all rows" />

<MkCheckbox aria-invalid="true" label="Accept the agreement" />
```

## Card variant

Use `variant="card"` when the complete framed surface should be selectable. The Card variant keeps
the same checkbox behavior and API while adding container padding, hover feedback, checked-state
emphasis, and a surface-level focus outline.

```vue
<MkCheckbox
  v-model="selected"
  variant="card"
  label="Create a workspace"
  description="Invite collaborators and organize projects."
/>
```

The complete surface is rendered through `MkLabel`, so clicking whitespace or supporting text
activates the checkbox without duplicating its state logic.

## Forms

Set `name` to make the checkbox participate in a native form. Reka UI supplies the hidden form
control and preserves required and disabled behavior.

```vue
<form>
  <MkCheckbox
    required
    label="I agree to the terms"
    name="terms"
    value="accepted"
  />
</form>
```

## Styling

Checkbox uses only semantic theme roles:

- `background` and `input` while unchecked;
- `primary` and `primary-foreground` while checked or indeterminate;
- `ring` for keyboard focus;
- `foreground` and `muted-foreground` for field text;
- `destructive` when `aria-invalid="true"`.

The `sm`, `md`, and `lg` controls use 4, 6, and 8-pixel corners with ModeKit's default radius base.
Override `--mk-radius` to adjust the complete library coherently.

Use `ui` for a local adjustment:

```vue
<MkCheckbox
  label="Remember this device"
  :ui="{
    base: 'w-full',
    control: 'border-2',
    label: 'font-semibold',
  }"
/>
```

Global configuration supports `base`, named slots, the `size` and `variant` axes, and their defaults:

```ts
app.use(
  createModeKit({
    ui: {
      checkbox: {
        slots: {
          label: 'font-semibold',
          description: 'max-w-sm',
        },
        defaultVariants: {
          size: 'lg',
          variant: 'default',
        },
      },
    },
  }),
)
```

## Accessibility

`MkCheckbox` renders a Reka UI checkbox control and indicator. Its visible label is associated with
the generated or supplied control ID, and its description is connected with `aria-describedby`.
Keyboard users toggle the control with Space. The indeterminate state is exposed as
`aria-checked="mixed"`.

When no visible label slot or `label` prop is present, supply `aria-label` or `aria-labelledby`.
