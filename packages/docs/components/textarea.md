# Textarea

Textarea is a focused wrapper around one native `<textarea>`. It shares Input's surface variants,
sizes, state styling, model contract, and override order while preserving browser-owned multiline
editing, selection, form submission, rows, wrapping, character limits, and resizing.

## Usage

<ComponentPreview name="textarea/TextareaBasic" />

Use [Label](/components/label) and matching `for`/`id` values for a visible accessible name. Textarea
does not render labels, descriptions, counters, or validation messages; those remain ordinary field
composition so their content and lifecycle stay application-owned.

## Variants

<ComponentPreview name="textarea/TextareaVariants" />

| Variant   | Treatment                                                          |
| --------- | ------------------------------------------------------------------ |
| `outline` | Input-colored border and background surface.                       |
| `soft`    | Muted filled surface without a border.                             |
| `subtle`  | Muted translucent surface with a quiet border.                     |
| `ghost`   | Transparent at rest with hover and focus feedback.                 |
| `plain`   | No border, background, or focus ring; only text and native layout. |

All variants except `plain` use the same complete keyboard-focus ring as Input. The ring transitions
only opacity and border color, respects reduced-motion preferences, and changes to the red palette
when invalid.

## Native rows, limits, and resizing

<ComponentPreview name="textarea/TextareaNative" />

Set `rows`, `cols`, `minlength`, `maxlength`, and `wrap` exactly as on a native textarea. ModeKit does
not replace native constraint validation or infer a character counter. The example deliberately
composes a counter outside Textarea and connects it with `aria-describedby`.

`resize` controls only the browser resize handle:

| Value        | Behavior                                      |
| ------------ | --------------------------------------------- |
| `none`       | Disables manual resizing.                     |
| `vertical`   | Allows block-axis resizing. Default.          |
| `horizontal` | Allows inline-axis resizing.                  |
| `both`       | Allows both axes, matching native CSS resize. |

Textarea does not implement autosizing. Use native rows for a predictable initial height and choose
a resize mode that fits the surrounding layout.

## States

<ComponentPreview name="textarea/TextareaStates" />

`disabled`, `readonly`, and `required` are forwarded to the native control. `invalid` adds
`aria-invalid="true"` and variant-aware visual treatment, but it does not invent validation text.
Explicit native values such as `aria-invalid="spelling"` are preserved and also activate the visual
invalid state.

## Features

- Controlled values with `v-model` and browser-owned initial values with `default-value`
- Native textarea attributes, form behavior, accessibility attributes, and listeners
- Native IME composition before model updates
- Native `rows`, `cols`, `minlength`, `maxlength`, `wrap`, and external-form support
- Vertical, horizontal, both-axis, or disabled manual resizing
- Outline, soft, subtle, ghost, and plain surface variants
- Disabled, readonly, required, and invalid states
- Three sizes aligned with Input's typography, padding, and radius scale
- Global, local, control-level, and native wrapper class overrides

## API

### Props

| Prop           | Type                                                    | Default      | Description                                               |
| -------------- | ------------------------------------------------------- | ------------ | --------------------------------------------------------- |
| `modelValue`   | `string \| number`                                      | —            | Controls the rendered value with `v-model`.               |
| `defaultValue` | `string \| number`                                      | —            | Sets the initial value when the textarea is uncontrolled. |
| `size`         | `'sm' \| 'md' \| 'lg'`                                  | `'md'`       | Sets text size, padding, and surface radius.              |
| `variant`      | `'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'plain'` | `'outline'`  | Sets the complete textarea-surface treatment.             |
| `resize`       | `'none' \| 'vertical' \| 'horizontal' \| 'both'`        | `'vertical'` | Controls allowed manual resize axes.                      |
| `disabled`     | `boolean`                                               | `false`      | Prevents interaction and dims the complete surface.       |
| `readonly`     | `boolean`                                               | `false`      | Prevents editing while keeping the value focusable.       |
| `required`     | `boolean`                                               | `false`      | Marks the native textarea as required.                    |
| `invalid`      | `boolean`                                               | `false`      | Applies `aria-invalid="true"` and state styling.          |
| `ui`           | `TextareaUI`                                            | —            | Adds classes to the visual root and native textarea.      |

Native textarea attributes and listeners are forwarded to the `<textarea>`, including `rows`,
`cols`, `minlength`, `maxlength`, `wrap`, `name`, `form`, `autocomplete`, `aria-*`, and `data-*`.
Native `class` and `style` apply to the complete visual wrapper; use `ui.textarea` for the native
control itself.

### Events

| Event               | Payload  | Description                                  |
| ------------------- | -------- | -------------------------------------------- |
| `update:modelValue` | `string` | Emitted with the native value on user input. |

Even when a numeric initial value is supplied, native textarea edits emit strings. Convert the value
at the application boundary if the domain requires another type. Native `input`, `change`, `focus`,
`blur`, composition, keyboard, and pointer listeners continue to run.

Textarea has no component-owned slots. Labels, supporting text, counters, and errors are intentionally
composed as sibling elements so the native control remains the only internal semantic element.

## Controlled and uncontrolled values

Use `v-model` when application state owns the current value:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const notes = ref('')
</script>

<template>
  <MkTextarea v-model="notes" name="notes" :rows="6" />
</template>
```

Use `default-value` when the browser should own subsequent edits after the initial render:

```vue
<MkTextarea default-value="Draft notes" name="notes" :rows="6" />
```

Uncontrolled values return to their initial value when their owning form resets, including when the
textarea targets an external form with the native `form` attribute.

## Validation and accessibility

Provide an accessible name through a native label, `aria-label`, or `aria-labelledby`. Connect help,
character counts, and validation messages with `aria-describedby`. Textarea preserves those native
relationships and does not couple validation state to any particular message markup.

`maxlength` constrains input through browser behavior; it is not a replacement for server-side
validation. `required`, `minlength`, and `maxlength` retain native constraint-validation semantics.

## Styling

Textarea uses Input's neutral and white surfaces, primary focus color, red invalid color, and
lower-emphasis placeholder treatment. `TextareaUI` exposes `base` for the visual surface and
`textarea` for the native control:

```vue
<MkTextarea
  class="max-w-xl"
  :ui="{
    textarea: 'font-mono',
  }"
/>
```

Global configuration supports root and native-control classes, per-size, per-variant, and per-resize
classes, plus defaults:

```ts
app.use(
  createModeKit({
    ui: {
      textarea: {
        slots: {
          textarea: 'font-medium',
        },
        variants: {
          size: {
            lg: 'tracking-wide',
          },
          resize: {
            none: 'cursor-default',
          },
        },
        defaultVariants: {
          size: 'lg',
          variant: 'outline',
          resize: 'vertical',
        },
      },
    },
  }),
)
```

Root classes resolve in this order: built-in recipe, global base and active-axis classes, local
`ui.base`, then native `class`. Native-control classes resolve from the built-in recipe, global
`slots.textarea`, then local `ui.textarea`.

Built-in ModeKit classes are compiled into the package stylesheet. Arbitrary classes supplied
through global configuration, `ui`, or `class` must be generated by the consuming application or
provided as ordinary CSS.
