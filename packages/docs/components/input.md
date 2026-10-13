# Input

Input is a compound native-input primitive with typed values, five surface treatments, leading and
trailing content, a built-in loading indicator, and an optional floating label. It forwards native
form and accessibility behavior to the actual `<input>` while keeping the complete visual surface
customizable.

## Usage

<ComponentPreview name="input/InputBasic" />

`MkInput` does not render descriptions or error messages. The `invalid` prop only exposes and styles
the control's invalid state, so applications can compose their own field messaging without the
Input component implying content it does not own.

## Variants

<ComponentPreview name="input/InputVariants" />

| Variant   | Treatment                                                          |
| --------- | ------------------------------------------------------------------ |
| `outline` | Input-colored border and background surface.                       |
| `soft`    | Muted filled surface without a border.                             |
| `subtle`  | Muted translucent surface with a quiet border.                     |
| `ghost`   | Transparent at rest with hover and focus feedback.                 |
| `plain`   | No border, background, or focus ring; only text and layout remain. |

All variants except `plain` expose a keyboard-focus ring. The complete perimeter uses a short,
simple opacity and color transition, then becomes immediate when reduced motion is requested.
Floating labels remain above the ring. Invalid inputs use the same treatment with the red palette.
Outline and subtle
also change their existing border color; soft and ghost retain their filled or transparent treatment.
Plain intentionally adds no visual chrome.

## Leading, trailing, and loading content

<ComponentPreview name="input/InputAffixes" />

Use `leading` and `trailing` for icons, units, shortcuts, or compact context. Input reserves the
correct amount of space at every size. Slot wrappers are presentation-only and ignore pointer events,
so interactive controls should not be placed inside them.

When `loading` is true, Input sets `aria-busy="true"` on the native control and replaces leading
content with a decorative `MkSpinner`. Trailing context remains visible. Override only the indicator
with the `loader` slot.

## Floating labels

<ComponentPreview name="input/InputFloatingLabel" />

Set `floating="inside"` or `floating="border"` together with `label` to render a native `<label>`
associated with the input's supplied or generated ID. Without `floating`, `label` supplies the
native input's accessible name through `aria-label` without rendering visible label content. The
floating label stays in the content position until the control receives focus or has a controlled
or uncontrolled value.

`border` moves the active label onto the existing border without changing the selected height or
native input padding. `inside` keeps the active label within the existing control height and shifts
the value down to reserve room. In both positions, the label aligns with the value text: leading
content intentionally shifts both to the same horizontal inset.

Use the `label` slot when the floating label needs custom content. A normal external label remains
available through [Label](/components/label) when floating behavior is not wanted.

## Features

- Controlled values with `v-model` and uncontrolled initial values with `default-value`
- Native input attributes, accessibility attributes, and listeners
- Outline, soft, subtle, ghost, and plain surface variants
- Subtle keyboard-focus ring animation with reduced-motion support
- Leading, trailing, loader, and floating-label slots
- Built-in ModeKit spinner and native busy semantics while loading
- Disabled, readonly, required, and invalid states
- Three sizes aligned with Button and ModeKit's shared radius scale
- Global, local, slot-level, and native class overrides

## API

### Props

| Prop           | Type                                                    | Default     | Description                                                    |
| -------------- | ------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `modelValue`   | `string \| number`                                      | —           | Controls the rendered value with `v-model`.                    |
| `defaultValue` | `string \| number`                                      | —           | Sets the initial value when the input is uncontrolled.         |
| `floating`     | `'inside' \| 'border'`                                  | —           | Enables the label and selects its active position.             |
| `label`        | `string`                                                | —           | Names the input and supplies optional floating-label content.  |
| `size`         | `'sm' \| 'md' \| 'lg'`                                  | `'md'`      | Sets the control, content, affix, spinner, and label sizing.   |
| `variant`      | `'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'plain'` | `'outline'` | Sets the complete input-surface treatment.                     |
| `disabled`     | `boolean`                                               | `false`     | Prevents interaction and dims the complete surface.            |
| `readonly`     | `boolean`                                               | `false`     | Prevents editing while keeping the value focusable.            |
| `required`     | `boolean`                                               | `false`     | Marks the native input as required.                            |
| `invalid`      | `boolean`                                               | `false`     | Applies `aria-invalid="true"` and variant-aware state styling. |
| `loading`      | `boolean`                                               | `false`     | Marks the input busy and shows a leading loading indicator.    |
| `ui`           | `InputUI`                                               | —           | Adds classes to the root and named parts.                      |

Native input attributes and listeners are forwarded to the `<input>`. Native `class` and `style`
apply to the complete visual wrapper; use `ui.input` for the native control itself.

### Events

| Event               | Payload  | Description                                  |
| ------------------- | -------- | -------------------------------------------- |
| `update:modelValue` | `string` | Emitted with the native value on user input. |

Native input values are strings, including for `type="number"`. Convert the emitted value at the
application boundary when the domain requires a number.

### Slots

| Slot       | Props                                                             | Description                                         |
| ---------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `leading`  | `{ size, variant, disabled, readonly, loading }`                  | Adds content before the input value.                |
| `trailing` | `{ size, variant, disabled, readonly, loading }`                  | Adds content after the input value.                 |
| `loader`   | `{ size, variant, disabled, readonly, loading }`                  | Replaces the default leading spinner while loading. |
| `label`    | `{ label, floating, size, variant, disabled, readonly, loading }` | Replaces the floating-label content.                |

## Controlled and uncontrolled values

Use `v-model` when application state owns the current value:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
</script>

<template>
  <MkInput v-model="query" type="search" placeholder="Search projects" />
</template>
```

Use `default-value` when the browser should own subsequent edits after the initial render:

```vue
<MkInput default-value="Draft title" name="title" />
```

## Validation and accessibility

Pair a regular Input with Label by using matching `for` and `id` values. Set `invalid` after
validation fails. Input exposes the state through `aria-invalid` and variant-aware visual treatment;
validation text remains the application's responsibility.

Floating labels generate an ID when none is supplied and always use a native label association.
Without `floating`, `label` becomes the native input's `aria-label`; an explicit `aria-label` or
`aria-labelledby` takes precedence. Leading, trailing, and default spinner content are decorative.

## Styling

Input uses explicit neutral and white utilities for its surfaces, text, and borders, the primary
color for focus, and the red palette for invalid states. Placeholder text uses reduced neutral
opacity to remain visibly distinct from entered values and nearby body text.

`InputUI` exposes `base`, `input`, `leading`, `trailing`, `label`, and `spinner`. Use local slot classes
for a targeted adjustment:

```vue
<MkInput
  :ui="{
    base: 'max-w-sm',
    input: 'font-mono',
    trailing: 'text-neutral-950 dark:text-neutral-50',
  }"
>
  <template #trailing>.com</template>
</MkInput>
```

Global configuration supports root and slot classes, per-size and per-variant classes, and defaults:

```ts
app.use(
  createModeKit({
    ui: {
      input: {
        slots: {
          input: 'font-medium',
          leading: 'text-foreground',
        },
        variants: {
          size: {
            lg: 'tracking-wide',
          },
          variant: {
            soft: 'shadow-sm',
          },
        },
        defaultVariants: {
          size: 'lg',
          variant: 'outline',
        },
      },
    },
  }),
)
```

Built-in ModeKit classes are compiled into the package stylesheet. Arbitrary classes supplied
through global configuration, `ui`, or `class` must be generated by the consuming application or
provided as ordinary CSS.
