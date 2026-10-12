# Label

Label gives a form control a visible, accessible name. `MkLabel` is built on Reka UI's Label
primitive and provides the typography and states shared by ModeKit form components.

## Usage

<ComponentPreview name="label/LabelBasic" />

```vue
<MkLabel for="email">Email address</MkLabel>
<input id="email" type="email" />
```

## Features

- Reka UI label behavior
- Native `for` association
- Shared `sm`, `md`, and `lg` typography
- Visual required indicator
- Consistent disabled presentation
- Global and local class configuration

## API

### Props

| Prop       | Type                   | Default | Description                                       |
| ---------- | ---------------------- | ------- | ------------------------------------------------- |
| `for`      | `string`               | —       | Identifies the control associated with the label. |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`  | Sets typography and line height.                  |
| `required` | `boolean`              | `false` | Displays a semantic destructive required marker.  |
| `disabled` | `boolean`              | `false` | Applies the shared disabled cursor presentation.  |
| `ui`       | `LabelUI`              | —       | Adds classes to the label and required indicator. |

All other native label attributes and classes are forwarded to the underlying `<label>`.

### Slots

| Slot      | Description            |
| --------- | ---------------------- |
| `default` | Visible label content. |

## Styling

Label uses the semantic `foreground` role for text and `destructive` for the required marker. Its
sizes share the same typography scale used by ModeKit fields and controls.

```vue
<MkLabel
  for="company"
  required
  :ui="{
    base: 'tracking-wide',
    requiredIndicator: 'font-bold',
  }"
>
  Company
</MkLabel>
```

Global configuration can set label classes, required-indicator classes, size variants, and the
default size:

```ts
app.use(
  createModeKit({
    ui: {
      label: {
        base: 'tracking-wide',
        slots: {
          requiredIndicator: 'font-bold',
        },
        defaultVariants: {
          size: 'md',
        },
      },
    },
  }),
)
```

## Accessibility

Keep the visible label meaningful and connect it to a control with matching `for` and `id` values.
The required marker is hidden from assistive technology because the control itself must communicate
its required state with the native `required` attribute or `aria-required`.

`disabled` is a visual coordination prop; labels do not support a native disabled attribute. The
associated control remains responsible for its disabled semantics.
