# Switch

Switch lets users turn a setting on or off. `MkSwitch` combines Reka UI's keyboard, ARIA, and form behavior with ModeKit's reusable [Label](/components/label), [Spinner](/components/spinner), and field presentation.

## Usage

<ComponentPreview name="switch/SwitchBasic" />

The preview exposes the main presentation axes and states. `align` names the side occupied by the control: `align="left"` puts the switch before the label and description, while `align="right"` puts it after them.

## Features

- Controlled and uncontrolled boolean values
- Configurable left or right control alignment
- Persistent or state-specific thumb icons
- Built-in ModeKit Spinner and busy semantics while loading
- Integrated label and description
- Native form participation through Reka UI
- Disabled, required, and invalid states
- Default and full-surface card presentations
- Three coordinated track, thumb, icon, text, and spacing sizes
- Global and local slot-class configuration

## Control alignment

Use `align` to choose which side contains the switch control. It defaults to `right`, preserving the common settings-row layout where text leads and the control follows. Alignment works for both the default and card variants.

<ComponentPreview name="switch/SwitchAlignment" />

```vue
<MkSwitch
  v-model="compactMode"
  align="left"
  label="Compact mode"
  description="Reduce spacing throughout the application."
/>

<MkSwitch
  v-model="weeklyDigest"
  align="right"
  variant="card"
  label="Weekly digest"
  description="Receive one summary every Monday."
/>
```

## Thumb icons and loading

Use `checked-icon` and `unchecked-icon` when the thumb should communicate its boolean state. Use the generic `thumb` slot when the same custom content should remain in both states. ModeKit sizes direct SVG content with the selected Switch size.

When `loading` is true, Switch becomes busy and non-interactive and replaces normal thumb content with a decorative, size-matched `MkSpinner`. Loading preserves the current boolean value, so the thumb and Spinner remain on the checked or unchecked side instead of forcing an off state. The `loader` slot can replace only that loading indicator.

<ComponentPreview name="switch/SwitchThumbContent" />

```vue
<MkSwitch v-model="enabled" label="Automation enabled">
  <template #checked-icon>
    <CheckIcon />
  </template>
  <template #unchecked-icon>
    <XIcon />
  </template>
</MkSwitch>

<MkSwitch v-model="savingValue" loading label="Saving preference" />
```

Thumb content resolves in this order:

1. `loader` or the built-in Spinner while `loading` is true
2. `thumb` for a complete normal-state override
3. `checked-icon` or `unchecked-icon` for the current boolean state

## Card variant

Use `variant="card"` when the complete framed surface should toggle the setting. The card keeps the same state, alignment, icon, and loading APIs while adding container padding, hover feedback, checked-state emphasis, and a surface-level focus outline.

```vue
<MkSwitch
  v-model="publicWorkspace"
  variant="card"
  align="right"
  label="Public workspace"
  description="Let anyone with the link view this workspace."
/>
```

## Sizes

`size="sm|md|lg"` coordinates the track, thumb travel, icon or Spinner, text, and spacing. It applies identically to either alignment and both variants.

```vue
<MkSwitch size="sm" label="Small" />
<MkSwitch size="md" label="Medium" />
<MkSwitch size="lg" label="Large" />
```

## Forms

Set `name` to make the switch participate in a native form. Reka UI supplies the hidden form control and preserves required and disabled behavior.

```vue
<form>
  <MkSwitch
    required
    label="Enable security alerts"
    name="security_alerts"
    value="enabled"
  />
</form>
```

## API

### Props

| Prop           | Type                   | Default     | Description                                                      |
| -------------- | ---------------------- | ----------- | ---------------------------------------------------------------- |
| `modelValue`   | `boolean`              | —           | Controls the current state with `v-model`.                       |
| `defaultValue` | `boolean`              | `false`     | Sets the initial uncontrolled state.                             |
| `label`        | `string`               | —           | Sets the visible label.                                          |
| `description`  | `string`               | —           | Adds supporting text linked to the control.                      |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`      | Sets track, thumb, icon, text, and spacing dimensions.           |
| `variant`      | `'default' \| 'card'`  | `'default'` | Sets the field presentation.                                     |
| `align`        | `'left' \| 'right'`    | `'right'`   | Places the switch control on the named side of its text content. |
| `loading`      | `boolean`              | `false`     | Preserves the value, prevents toggling, and shows a Spinner.     |
| `disabled`     | `boolean`              | `false`     | Prevents interaction and dims the complete field.                |
| `required`     | `boolean`              | `false`     | Marks the switch as required.                                    |
| `name`         | `string`               | —           | Sets the form field name.                                        |
| `value`        | `string`               | `'on'`      | Sets the submitted value when enabled.                           |
| `ui`           | `SwitchUI`             | —           | Adds classes to the root and named parts.                        |

Native button accessibility attributes and event listeners are forwarded to the interactive switch control. Native `class` and `style` apply to the complete field wrapper.

### Events

| Event               | Payload   | Description                     |
| ------------------- | --------- | ------------------------------- |
| `update:modelValue` | `boolean` | Emitted when the state changes. |

### Slots

| Slot             | Props                                              | Description                                                   |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| `thumb`          | `{ checked, modelValue, loading, disabled, size }` | Replaces normal thumb content in both boolean states.         |
| `checked-icon`   | `{ checked, modelValue, loading, disabled, size }` | Adds checked-state thumb content when `thumb` is not present. |
| `unchecked-icon` | `{ checked, modelValue, loading, disabled, size }` | Adds off-state thumb content when `thumb` is not present.     |
| `loader`         | `{ checked, modelValue, loading, disabled, size }` | Replaces the built-in Spinner while loading.                  |
| `label`          | `{ label }`                                        | Replaces the label content.                                   |
| `description`    | `{ description }`                                  | Replaces the supporting text.                                 |

State icons and the default loader are decorative because the switch's label and `aria-checked` value already expose the meaning to assistive technology. Custom `thumb` content remains consumer-owned; do not rely on it as the control's only accessible name.

## Styling

Switch uses the neutral scale for its off state and the primary pair for its enabled and focus states. The named `SwitchUI` parts are `base`, `control`, `thumb`, `icon`, `loader`, `content`, `label`, and `description`.

Use `ui` for a local adjustment:

```vue
<MkSwitch
  label="Remember this device"
  :ui="{
    base: 'w-full',
    control: 'ring-2',
    thumb: 'shadow-md',
    icon: 'text-primary',
    loader: 'text-primary',
    label: 'font-semibold',
  }"
/>
```

Global configuration supports `base`, named slots, the `size`, `variant`, and `align` axes, and their defaults:

```ts
app.use(
  createModeKit({
    ui: {
      switch: {
        slots: {
          label: 'font-semibold',
          description: 'max-w-sm',
          icon: 'opacity-90',
        },
        variants: {
          align: {
            left: 'justify-end',
          },
        },
        defaultVariants: {
          size: 'lg',
          variant: 'default',
          align: 'right',
        },
      },
    },
  }),
)
```

Class resolution is built-in recipe, global Switch configuration, local `ui`, then native `class` for the root. Named parts resolve built-in classes, global `slots`, then local `ui`.

## Accessibility

`MkSwitch` renders a Reka UI switch root and thumb. Its visible label is associated with the generated or supplied control ID, and its description is connected with `aria-describedby`. Keyboard users toggle the control with Space, and assistive technology receives `role="switch"` with the current `aria-checked` value.

Loading preserves `aria-checked`, sets `aria-busy="true"`, disables activation, and makes the nested Spinner decorative. Disabled and loading states do not emit model updates. The control aligns with the start of the label and description block, while `align` changes its horizontal placement without changing the label relationship.

When no visible label slot or `label` prop is present, supply `aria-label` or `aria-labelledby`.
