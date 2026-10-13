# Badge

Badges label compact metadata, categories, and statuses. `MkBadge` combines independent
colors and surface variants with consistent sizing, optional affixes, and a configurable root
element.

## Usage

### Color

Use `color` to select a semantic alias or palette family. It defaults to `primary`.

<ComponentPreview name="badge/BadgeColor" />

It accepts any shared `ModeKitColor`, including palette names such as `red`, `emerald`, and `violet`.
`secondary` remains available as a neutral treatment.

### Variant

Use `variant` to change the surface treatment without changing the badge's meaning. It defaults to
`default`.

<ComponentPreview name="badge/BadgeVariant" />

Available variants are `default`, `soft`, `outline`, and `subtle`. `default` is solid, `soft` uses a
tinted surface, `outline` is transparent with a semantic border, and `subtle` combines the tint and
border. Every variant can be combined with every color.

### Size

Use `size` to fit the badge to nearby text and controls. It defaults to `md`.

<ComponentPreview name="badge/BadgeSize" />

### Rounded

Use `rounded` for a fully rounded pill treatment. Without it, Badge keeps the corner radius defined
by the selected size.

<ComponentPreview name="badge/BadgeRounded" />

### Root element

Badge renders a `<span>` by default. Use `as` when the label needs different native semantics or
when composing it with another Vue component.

```vue
<MkBadge as="a" href="/releases" color="info" variant="soft">
  Release notes
</MkBadge>
```

### Affixes

Use `leading` and `trailing` for small decorative icons. Badge sets direct SVG children to the size
that matches the selected badge size.

<ComponentPreview name="badge/BadgeAffixes" />

## API

### Props

| Prop      | Type                                           | Default     | Description                                          |
| --------- | ---------------------------------------------- | ----------- | ---------------------------------------------------- |
| `as`      | `AsTag \| Component`                           | `'span'`    | Changes the rendered root element or component.      |
| `color`   | `ModeKitColor`                                 | `'primary'` | Sets the badge color.                                |
| `variant` | `'default' \| 'soft' \| 'outline' \| 'subtle'` | `'default'` | Sets the surface treatment independently of color.   |
| `size`    | `'sm' \| 'md' \| 'lg'`                         | `'md'`      | Sets badge spacing, text, radius, and icon size.     |
| `rounded` | `boolean`                                      | `false`     | Replaces the size radius with fully rounded corners. |
| `ui`      | `{ base?: ModeKitClassValue }`                 | —           | Adds or overrides classes for this Badge instance.   |

All other attributes and classes are forwarded to the rendered root.

### Slots

| Slot       | Description                              |
| ---------- | ---------------------------------------- |
| `leading`  | Content rendered before the badge label. |
| `default`  | Badge label or content.                  |
| `trailing` | Content rendered after the badge label.  |

## Styling

### Colors

Badge consumes ModeKit's shared color variables. Each supported color works with every surface
variant and adapts automatically in dark mode.

### Local overrides

Use `ui.base` when an override belongs to Badge's styling contract. Native `class` is applied last
and remains useful for layout or a one-off adjustment.

```vue
<MkBadge color="success" variant="soft" :ui="{ base: 'font-semibold' }" class="uppercase">
  Active
</MkBadge>
```

ModeKit resolves conflicts independently among its namespaced utilities and among application
utilities. It does not remove a ModeKit class because an application class belongs to the same CSS
property. Load application CSS after ModeKit CSS when it should override a built-in declaration.

### Global component configuration

Install the optional ModeKit Vue plugin to override Badge axes, combinations, or defaults for an
entire application:

```ts
import { createApp } from 'vue'
import { createModeKit } from '@modekit/vue'
import App from './App.vue'

const app = createApp(App)

app.use(
  createModeKit({
    ui: {
      badge: {
        base: 'font-semibold',
        variants: {
          variant: {
            outline: 'border-2',
          },
          rounded: {
            true: 'font-bold',
          },
        },
        compoundVariants: [
          {
            color: ['success', 'info'],
            variant: ['outline', 'subtle'],
            rounded: true,
            class: 'uppercase tracking-wide',
          },
        ],
        defaultVariants: {
          color: 'secondary',
          variant: 'soft',
          size: 'md',
          rounded: false,
        },
      },
    },
  }),
)

app.mount('#app')
```

`compoundVariants` can target one value or an array of values for `color`, `variant`, and `size`,
and can also require `rounded`. Resolution order is: built-in CVA recipe → global
base/axis/compound config → local `ui.base` → native `class`.

ModeKit ships the utilities used by its built-in recipe. Additional Tailwind utilities supplied by
an application require that application's own Tailwind build; ordinary CSS classes remain supported.

## Accessibility

Badge is descriptive content and renders a neutral `<span>` without adding a role. When changing
`as`, choose an element whose semantics match the content and provide any required native
attributes. Use visible text that explains the status instead of relying on color alone. Add
`role="status"` only when a badge is a live status message that assistive technology should announce.
Mark decorative affix icons with `aria-hidden="true"`.
