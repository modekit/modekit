# Button Group

Button Groups visually connect related Buttons while preserving each Button's own color, variant,
size, state, slots, and events. `MkButtonGroup` owns only layout, connected edges, border overlap, and
focus stacking.

## Usage

### Orientation

Place direct `MkButton` children in the default slot. Horizontal groups are the default; use
`orientation="vertical"` to stack the same actions.

<ComponentPreview name="button-group/ButtonGroupBasic" />

The group does not propagate Button props. Set shared values explicitly on each Button so exceptions
remain ordinary Button configuration rather than hidden group behavior.

### Mixed-width and icon buttons

Text, icon, and square Buttons can share one group. Connected styling follows direct Button children
without wrapping or rewriting their content.

<ComponentPreview name="button-group/ButtonGroupMixed" />

### Root element

Button Group renders a `<div role="group">` by default. Use `as` to select another root element or
component. Native attributes and an explicit `role` are forwarded.

```vue
<MkButtonGroup as="section" aria-label="Editor actions">
  <MkButton variant="outline">Undo</MkButton>
  <MkButton variant="outline">Redo</MkButton>
</MkButtonGroup>
```

Use a dedicated toolbar or selection primitive when the interaction needs arrow-key navigation,
single selection, or multiple selection. Button Group does not add roving focus or toggle state;
setting `role="toolbar"` alone does not provide those behaviors.

## API

### Props

| Prop          | Type                           | Default        | Description                                          |
| ------------- | ------------------------------ | -------------- | ---------------------------------------------------- |
| `as`          | `AsTag \| Component`           | `'div'`        | Changes the rendered root element or component.      |
| `orientation` | `'horizontal' \| 'vertical'`   | `'horizontal'` | Controls connected layout and edge treatment.        |
| `ui`          | `{ base?: ModeKitClassValue }` | —              | Adds or overrides classes for the Button Group root. |

Native attributes, listeners, `class`, and `style` are forwarded to the root.

### Slots

| Slot      | Props | Description                                                       |
| --------- | ----- | ----------------------------------------------------------------- |
| `default` | —     | Direct Buttons or custom content rendered without extra wrappers. |

## Styling

Horizontal groups collapse adjacent one-pixel borders and remove inner left/right corners. Vertical
groups apply the same treatment to top/bottom edges. Hovered and keyboard-focused Buttons rise above
their neighbors so borders and focus outlines remain visible. The connected-edge recipe targets only
direct `.mk-button` children.

### Local overrides

```vue
<MkButtonGroup
  orientation="vertical"
  :ui="{
    base: 'w-full',
  }"
  aria-label="Document actions"
>
  <MkButton class="w-full" variant="outline">Duplicate</MkButton>
  <MkButton class="w-full" variant="outline">Archive</MkButton>
</MkButtonGroup>
```

### Global component configuration

```ts
import { createApp } from 'vue'
import { createModeKit } from '@modekit/vue'
import App from './App.vue'

const app = createApp(App)

app.use(
  createModeKit({
    ui: {
      buttonGroup: {
        base: 'shadow-sm',
        variants: {
          orientation: {
            vertical: 'items-stretch',
          },
        },
        defaultVariants: {
          orientation: 'horizontal',
        },
      },
    },
  }),
)

app.mount('#app')
```

Resolution order is: built-in recipe → global base/orientation config → local `ui.base` → native
root `class`.

ModeKit ships the utilities used by its built-in recipe. Additional Tailwind utilities supplied by
an application require that application's own Tailwind build; ordinary CSS classes remain supported.

## Accessibility

Button Group defaults to `role="group"`. Give it an `aria-label` or `aria-labelledby` when nearby
content does not already identify the action set. Each child remains a native Button with its own
accessible name, disabled state, loading state, and keyboard behavior. The group deliberately does
not alter tab order or arrow-key behavior.
