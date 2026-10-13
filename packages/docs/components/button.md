# Button

Buttons let users trigger an action or make a choice. `MkButton` combines native button semantics,
independent color and surface variants, Tailwind state classes, and native attribute forwarding.

## Usage

### Color

Use the `color` prop to select a semantic alias or palette family. It defaults to `primary`.

<ComponentPreview name="button/ButtonColor" />

It accepts any shared `ModeKitColor`, including palette names such as `red`, `emerald`, and `violet`.
Every color works independently with every variant.

### Variant

Use the `variant` prop to change the surface treatment without changing semantic intent. It defaults to
`default`.

<ComponentPreview name="button/ButtonVariant" />

Available variants are `default`, `outline`, `soft`, `subtle`, `ghost`, and `link`. `outline` renders
a transparent surface with a semantic border. `subtle` combines the soft tinted surface with that
outline border. Every variant can be combined with every color.

### Size

Use the `size` prop to change the control dimensions. It defaults to `md`.

<ComponentPreview name="button/ButtonSize" />

### Icons

Use the `leading` and `trailing` slots for content placed around the label. The slots render directly
without wrappers or accessibility assumptions. Direct SVG children scale with the selected button
size.

For an icon-only button, render the icon in the default slot, set `square`, and provide an
`aria-label` that describes the action.

<ComponentPreview name="button/ButtonIcon" />

### Loading

Use the `loading` prop to mark the button busy and prevent additional activation. Button renders a
size-matched [Spinner](/components/spinner) by default. Provide a `loader` slot only when the action
needs a custom progress indicator.

<ComponentPreview name="button/ButtonLoading" />

### Disabled

Use the native `disabled` prop to prevent interaction.

<ComponentPreview name="button/ButtonDisabled" />

## API

### Props

| Prop       | Type                                                                | Default     | Description                                                   |
| ---------- | ------------------------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `color`    | `ModeKitColor`                                                      | `'primary'` | Sets the action color.                                        |
| `variant`  | `'default' \| 'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'link'` | `'default'` | Sets the surface treatment independently of color.            |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg'`                                      | `'md'`      | Sets control and icon geometry.                               |
| `loading`  | `boolean`                                                           | `false`     | Marks the button busy and prevents additional activation.     |
| `disabled` | `boolean`                                                           | `false`     | Disables the native button.                                   |
| `square`   | `boolean`                                                           | `false`     | Uses equal width and height for icon-only or custom controls. |
| `type`     | `'button' \| 'submit' \| 'reset'`                                   | `'button'`  | Sets the native button type.                                  |
| `ui`       | `{ base?: ModeKitClassValue }`                                      | —           | Adds or overrides classes for this Button instance.           |

All other native button attributes, listeners, and classes are forwarded to the underlying
`<button>`.

### Slots

| Slot       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `leading`  | Content rendered before the loader and label.           |
| `loader`   | Replaces the default Spinner when `loading` is enabled. |
| `default`  | Button label, icon, or custom content.                  |
| `trailing` | Content rendered after the label.                       |

## Styling

### Theme colors

ModeKit exposes a primary theme pair, a configurable neutral scale, palette colors, and semantic
aliases. Button keeps color independent from surface treatment.

| Role      | Default light palette | Default dark palette |
| --------- | --------------------- | -------------------- |
| `primary` | `neutral-900`         | `neutral-50`         |
| `neutral` | `zinc-700`            | `zinc-300`           |
| `green`   | `green-700`           | `green-400`          |
| `amber`   | `amber-400`           | `amber-300`          |
| `sky`     | `sky-700`             | `sky-400`            |
| `red`     | `red-700`             | `red-400`            |

Override `--mk-primary`, `--mk-primary-foreground`, or the `--mk-neutral-*` aliases after importing
ModeKit styles. Direct palette colors use ModeKit's packaged Tailwind palette.

### Corner scale

Button corners come from ModeKit's shared radius scale. With the default `--mk-radius`, the `xs`,
`sm`, `md`, and `lg` sizes resolve to 4, 6, 8, and 12 pixels. Cards and other containing surfaces use
the same scale at larger steps, keeping nested controls and containers visually related.

### Local overrides

Use `ui.base` when an override belongs to the Button's styling contract. Native `class` is applied
last and remains useful for layout or a one-off adjustment.

```vue
<MkButton color="primary" variant="default" :ui="{ base: 'rounded-full' }" class="w-full sm:w-auto">
  Continue
</MkButton>
```

ModeKit resolves conflicts independently among its namespaced utilities and among application
utilities. It does not remove a ModeKit class because an application class belongs to the same CSS
property. Load application CSS after ModeKit CSS when it should override a built-in declaration.

### Global component configuration

Install the optional ModeKit Vue plugin to override Button axes, specific combinations, or default
values for an entire application:

```ts
import { createApp } from 'vue'
import { createModeKit } from '@modekit/vue'
import App from './App.vue'

const app = createApp(App)

app.use(
  createModeKit({
    ui: {
      button: {
        base: 'font-semibold',
        variants: {
          variant: {
            outline: 'border-2',
          },
          size: {
            lg: 'h-14 px-6',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            variant: 'outline',
            class: 'uppercase tracking-wide',
          },
        ],
        defaultVariants: {
          color: 'primary',
          variant: 'default',
          size: 'lg',
        },
      },
    },
  }),
)

app.mount('#app')
```

`compoundVariants` can target one value or an array of values for `color`, `variant`, and `size`.
Resolution order is: built-in CVA recipe → global base/axis/compound config → local `ui.base` →
native `class`. Conflicts are merged independently within the ModeKit and application namespaces.

ModeKit ships the utilities used by its built-in recipe. If an application supplies additional
Tailwind utility names, its own Tailwind build must scan that application code. Applications without
Tailwind can use ordinary class names backed by their own CSS.

## Accessibility

`MkButton` renders a native `<button>`, preserves keyboard behavior, and exposes `aria-busy="true"`
while loading. Loading also disables activation. `leading`, `default`, and `trailing` content keeps
its own accessibility semantics. Mark decorative icons with `aria-hidden="true"`, and add an
`aria-label` to icon-only buttons. Mark custom loader content as decorative when the button's
accessible name already describes the action.
