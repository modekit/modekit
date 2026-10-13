# Callout

Callouts communicate important contextual information without interrupting the current task. `MkCallout`
combines independent colors and surface treatments with optional icon, title, actions, and
dismissal regions.

## Usage

### Color

Use `color` to communicate meaning. Callout defaults to `sky`; use `neutral` for neutral emphasis.
Always reinforce color with clear text.

<ComponentPreview name="callout/CalloutColor" />

Callout accepts any shared `ModeKitColor`, including palette names such as `red`, `emerald`, and
`violet`.

### Variant

Use `variant` to change presentation without changing meaning. Callout defaults to `soft`.

<ComponentPreview name="callout/CalloutVariant" />

Available variants are `solid`, `soft`, and `outline`. `solid` uses a fully semantic surface, `soft`
uses a restrained tint, and `outline` uses the standard surface with a semantic border. Every variant
can be combined with every color.

### Size

Use `size` to coordinate the Callout's padding, gaps, typography, icon geometry, actions, and dismiss
button. It defaults to `md`.

<ComponentPreview name="callout/CalloutSize" />

### Icon and content

Callout is icon-library agnostic. Use the `icon` slot for a decorative symbol; ModeKit sizes it and
marks its wrapper hidden from assistive technology because the visible text must carry the meaning.
Use the `title` prop for simple headings or the `title` slot for rich title content. The default slot
contains the supporting message.

```vue
<script setup lang="ts">
import { CircleCheck } from '@lucide/vue'
import { MkCallout } from '@modekit/vue'
</script>

<template>
  <MkCallout color="green" title="Payment received">
    <template #icon>
      <CircleCheck aria-hidden="true" :stroke-width="1.75" />
    </template>

    Your account balance is now up to date.
  </MkCallout>
</template>
```

### Actions and dismissal

The `actions` slot places contextual actions after the message. Set `dismissible` to render a native
button that emits `close`; Callout deliberately remains visible until the consumer updates its state.
This keeps visibility controlled by the application and works with transitions or persisted notices.

<ComponentPreview name="callout/CalloutDismissible" />

Use `dismissLabel` to give the close button a message-specific accessible name. The default is
`Dismiss callout`. The `close` slot can replace the fixed close icon and receives the resolved label.

### Root element

Callout renders a `<div>` by default. Use `as` to select another root element or component. Native
attributes, including `role`, are forwarded to that root.

```vue
<MkCallout as="section" role="status" title="Sync complete">
  All records are up to date.
</MkCallout>
```

## API

### Props

| Prop           | Type                                                                 | Default             | Description                                                     |
| -------------- | -------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------- |
| `as`           | `AsTag \| Component`                                                 | `'div'`             | Changes the rendered root element or component.                 |
| `color`        | `ModeKitColor`                                                       | `'sky'`             | Sets the Callout color.                                         |
| `variant`      | `'solid' \| 'soft' \| 'outline'`                                     | `'soft'`            | Sets the surface treatment independently of color.              |
| `size`         | `'sm' \| 'md' \| 'lg'`                                               | `'md'`              | Sets spacing, typography, icon, action, and close geometry.     |
| `title`        | `string`                                                             | —                   | Renders a concise title before the supporting message.          |
| `dismissible`  | `boolean`                                                            | `false`             | Renders the close button without owning visibility state.       |
| `dismissLabel` | `string`                                                             | `'Dismiss callout'` | Sets the close button's accessible name.                        |
| `ui`           | `{ base?, icon?, content?, title?, description?, actions?, close? }` | —                   | Adds or overrides classes for the root and named Callout slots. |

All other attributes and classes are forwarded to the rendered root. Because `title` is a supported
content prop, it does not become the root element's native `title` attribute.

### Events

| Event   | Payload      | Description                                            |
| ------- | ------------ | ------------------------------------------------------ |
| `close` | `MouseEvent` | Emitted when the built-in dismiss button is activated. |

### Slots

| Slot      | Props                | Description                                                                        |
| --------- | -------------------- | ---------------------------------------------------------------------------------- |
| `icon`    | —                    | Decorative leading icon, automatically sized and hidden from assistive technology. |
| `title`   | `{ title: string? }` | Replaces the `title` prop rendering.                                               |
| `default` | —                    | Supporting Callout content.                                                        |
| `actions` | —                    | Contextual actions rendered after the message.                                     |
| `close`   | `{ label: string }`  | Replaces the default close icon inside the dismiss button.                         |

## Styling

### Colors

Callout consumes ModeKit's shared color variables. Each supported color works with every surface
variant and adapts automatically in dark mode.

### Local overrides

Use `ui` to customize the supported regions. Native `class` applies last to the root.

```vue
<MkCallout
  color="sky"
  title="Import running"
  :ui="{
    base: 'shadow-sm',
    icon: 'mt-1',
    title: 'tracking-tight',
    actions: 'justify-end',
  }"
  class="my-callout"
>
  You can continue working while the import completes.
</MkCallout>
```

ModeKit resolves conflicts independently among its namespaced utilities and among application
utilities. Load application CSS after ModeKit CSS when it should override a built-in declaration.

### Global component configuration

Install the optional ModeKit Vue plugin to override Callout axes, combinations, slots, or defaults:

```ts
import { createApp } from 'vue'
import { createModeKit } from '@modekit/vue'
import App from './App.vue'

const app = createApp(App)

app.use(
  createModeKit({
    ui: {
      callout: {
        base: 'shadow-sm',
        slots: {
          title: 'tracking-tight',
          actions: 'justify-end',
        },
        variants: {
          variant: {
            outline: 'border-2',
          },
          size: {
            lg: 'max-w-3xl',
          },
        },
        compoundVariants: [
          {
            color: ['amber', 'red'],
            variant: ['soft', 'outline'],
            size: 'lg',
            class: 'shadow-md',
          },
        ],
        defaultVariants: {
          color: 'sky',
          variant: 'soft',
          size: 'md',
        },
      },
    },
  }),
)

app.mount('#app')
```

`compoundVariants` can target one value or an array of values for `color`, `variant`, and `size`.
Resolution order is: built-in CVA recipe → global base/axis/compound config → local `ui.base` →
native root `class`. Named slots resolve as built-in slot recipe → global slot config → local slot
config.

ModeKit ships the utilities used by its built-in recipe. Additional Tailwind utilities supplied by
an application require that application's own Tailwind build; ordinary CSS classes remain supported.

## Accessibility

Callout does not add a live-region role by default. Static notices that are already present when a page
loads generally should not be announced. Add `role="status"` for dynamically inserted, non-urgent
updates and reserve `role="alert"` for urgent messages that require immediate attention.

The icon region is decorative and hidden from assistive technology, so never rely on the icon or
color alone. Keep the title and message explicit. A dismissible Callout uses a native `type="button"`
control with an accessible label and emits `close`; update consumer-owned state to remove the Callout.
Actions should use native controls or components with appropriate names and keyboard behavior.
