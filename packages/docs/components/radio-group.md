# Radio Group

Radio Group lets users select one value from a visible set of mutually exclusive options. `MkRadioGroup` combines Reka UI's keyboard, ARIA, and form behavior with ModeKit's labels, descriptions, sizing, and card presentation.

## Usage

<ComponentPreview name="radio-group/RadioGroupBasic" />

```vue
<script setup lang="ts">
import { ref } from 'vue'

const plan = ref('team')
const plans = [
  { label: 'Starter', value: 'starter', description: 'For personal projects.' },
  { label: 'Team', value: 'team', description: 'For growing teams.' },
  { label: 'Enterprise', value: 'enterprise', disabled: true },
]
</script>

<template>
  <MkRadioGroup
    v-model="plan"
    :items="plans"
    label="Workspace plan"
    description="Choose the plan that fits your team."
    name="plan"
  />
</template>
```

## Features

- Controlled and uncontrolled string or numeric values
- Declarative labels, values, descriptions, and per-option disabled states
- Integrated group label and description
- Vertical and horizontal keyboard navigation
- Optional looping keyboard navigation
- Native form participation through Reka UI
- Disabled, required, and invalid states
- Default, card, connected table, segmented, and pills presentations
- Per-item component icons or a custom icon slot in place of radio circles
- Three coordinated control, indicator, text, and spacing sizes
- Global and local slot-class configuration

## Card options

Use `variant="card"` when every option should be a selectable framed surface. Horizontal card groups wrap when space is constrained.

```vue
<MkRadioGroup
  v-model="billing"
  :items="billingOptions"
  variant="card"
  orientation="horizontal"
  label="Billing interval"
/>
```

## Table options

Use `variant="table"` for a connected set of rows or columns. The selected option receives a full-surface tint and inset outline while the group keeps one shared outer border.

<ComponentPreview name="radio-group/RadioGroupTable" />

## Segmented options

`variant="segmented"` uses the same compact selected-surface language as segmented tabs while preserving radio-group semantics. Set an `icon` component on each item or use the `icon` slot to replace the radio circle.

<ComponentPreview name="radio-group/RadioGroupSegmented" />

The sliding selection surface follows both axes, so vertical segmented groups retain the same motion and sizing behavior.

<ComponentPreview name="radio-group/RadioGroupSegmentedVertical" />

## Pills

`variant="pills"` presents compact, independently rounded options for filters and lightweight categorical choices.

<ComponentPreview name="radio-group/RadioGroupPills" />

## Orientation

`orientation="vertical"` is the default. It lays options out in a column and gives Reka UI the correct axis for arrow-key navigation. Use `horizontal` for compact choices that fit naturally in a row.

```vue
<MkRadioGroup :items="alignments" orientation="horizontal" aria-label="Alignment" />
```

## Forms

Set `name` to participate in native form submission. `required` marks the group as required, while `disabled` prevents interaction with every option. Individual items can also be disabled.

```vue
<form>
  <MkRadioGroup
    v-model="plan"
    :items="plans"
    label="Workspace plan"
    name="plan"
    required
  />
</form>
```

## API

### Props

| Prop           | Type                                                       | Default      | Description                                             |
| -------------- | ---------------------------------------------------------- | ------------ | ------------------------------------------------------- |
| `modelValue`   | `string \| number`                                         | —            | Controls the selected value with `v-model`.             |
| `defaultValue` | `string \| number`                                         | —            | Sets the initial uncontrolled value.                    |
| `items`        | `readonly RadioGroupItem[]`                                | required     | Defines option labels, values, descriptions, and state. |
| `label`        | `string`                                                   | —            | Sets the accessible visible group label.                |
| `description`  | `string`                                                   | —            | Adds supporting text linked to the group.               |
| `size`         | `'sm' \| 'md' \| 'lg'`                                     | `'md'`       | Sets control, indicator, text, and spacing dimensions.  |
| `variant`      | `'default' \| 'card' \| 'table' \| 'segmented' \| 'pills'` | `'default'`  | Sets the option presentation.                           |
| `orientation`  | `'vertical' \| 'horizontal'`                               | `'vertical'` | Sets layout and keyboard navigation orientation.        |
| `disabled`     | `boolean`                                                  | `false`      | Prevents interaction with every option.                 |
| `required`     | `boolean`                                                  | `false`      | Marks the group as required.                            |
| `name`         | `string`                                                   | —            | Sets the native form field name.                        |
| `loop`         | `boolean`                                                  | `true`       | Allows arrow navigation to wrap between edge options.   |
| `ui`           | `RadioGroupUI`                                             | —            | Adds classes to the root and named parts.               |

`RadioGroupItem` has `label`, `value`, and optional `description`, `icon`, and `disabled` fields. `icon` accepts a Vue component and replaces that item's radio circle. The `icon` slot can override icon rendering for the complete group. Native accessibility attributes and event listeners are forwarded to the `radiogroup`; native `class` and `style` apply to the complete field wrapper.

### Events

| Event               | Payload            | Description                         |
| ------------------- | ------------------ | ----------------------------------- |
| `update:modelValue` | `string \| number` | Emitted when the selection changes. |

### Slots

| Slot               | Props                                      | Description                                    |
| ------------------ | ------------------------------------------ | ---------------------------------------------- |
| `label`            | `{ label }`                                | Replaces the group label content.              |
| `description`      | `{ description }`                          | Replaces the group supporting text.            |
| `indicator`        | `{ item, index, checked, disabled, size }` | Adds content inside the checked indicator.     |
| `icon`             | `{ item, index, checked, disabled, size }` | Replaces radio circles with custom item icons. |
| `item-label`       | `{ item, index, checked, disabled, size }` | Replaces each option label.                    |
| `item-description` | `{ item, index, checked, disabled, size }` | Replaces each option description.              |

The indicator is decorative because each option already exposes its label and checked state to assistive technology.

## Styling

The named `RadioGroupUI` parts are `base`, `header`, `label`, `description`, `options`, `item`, `control`, `indicator`, `icon`, `content`, `itemLabel`, and `itemDescription`.

```vue
<MkRadioGroup
  :items="plans"
  :ui="{
    base: 'w-full',
    options: 'max-w-xl',
    control: 'ring-2',
    itemLabel: 'font-semibold',
  }"
/>
```

Global configuration supports `base`, named slots, the `size`, `variant`, and `orientation` axes, and their defaults:

```ts
app.use(
  createModeKit({
    ui: {
      radioGroup: {
        slots: {
          itemLabel: 'font-semibold',
          itemDescription: 'max-w-sm',
        },
        defaultVariants: {
          size: 'md',
          variant: 'default',
          orientation: 'vertical',
        },
      },
    },
  }),
)
```

Class resolution is built-in recipe, global Radio Group configuration, local `ui`, then native `class` for the root. Named parts resolve built-in classes, global `slots`, then local `ui`.

## Accessibility

`MkRadioGroup` renders a Reka UI radio group with one radio item per definition. The visible group label is connected through `aria-labelledby`, and the group description uses `aria-describedby`. Each option label and description receives its own corresponding relationship.

Keyboard users move selection with the arrow keys appropriate to the configured orientation. Reka UI manages roving focus, checked state, disabled options, looping, and form behavior. When no visible group label is present, supply `aria-label` or `aria-labelledby`.
