# Card

Cards group related information and actions into one visual surface. `MkCard` renders through Reka
UI's `Primitive` as a neutral div and provides surface variants, a compact spacing scale, named
composition slots, native div attributes, and class-based customization without introducing another
semantic color role.

## Usage

### Variant and size

Use `variant` to choose the surface treatment and `size` to control internal spacing.

<ComponentPreview name="card/CardVariants" />

Available variants are `default`, `muted`, and `outline`. Available sizes are `sm`, `md`, and `lg`.

- `default` uses a low-contrast border and subtle shadow.
- `muted` uses the existing semantic muted surface.
- `outline` uses a stronger transparent outline without a shadow.

### Body treatment

`body="seamless"` keeps every slot on one surface and is the default. Use `body="inset"` to
place the default slot in a wide inner panel while the header and footer retain the Card's normal
padding. The treatment is independent from `variant` and scales its offset, padding, and radius with
`size`. On a muted Card the panel is raised; on default and outline Cards it becomes a recessed muted
surface.

<ComponentPreview name="card/CardInset" />

## API

### Props

| Prop      | Type                                | Default      | Description                                      |
| --------- | ----------------------------------- | ------------ | ------------------------------------------------ |
| `variant` | `'default' \| 'muted' \| 'outline'` | `'default'`  | Sets the neutral surface treatment.              |
| `body`    | `'seamless' \| 'inset'`             | `'seamless'` | Sets the default-slot body treatment.            |
| `size`    | `'sm' \| 'md' \| 'lg'`              | `'md'`       | Sets the gap and padding scale.                  |
| `ui`      | `CardUI`                            | —            | Adds or overrides root and slot wrapper classes. |

All other native div attributes, listeners, and classes are forwarded to the root `<div>`.

### Slots

| Slot      | Description                                |
| --------- | ------------------------------------------ |
| `header`  | Optional content rendered before the body. |
| `default` | Main Card content.                         |
| `footer`  | Optional content rendered after the body.  |

Omitted slots do not render empty wrappers.

## Styling

Use `ui` for local root or slot wrapper customization. Native `class` applies last on the root.

```vue
<MkCard
  variant="muted"
  :ui="{
    base: 'rounded-3xl',
    header: 'gap-2',
    body: 'text-sm',
    footer: 'justify-end',
  }"
>
  <template #header>Account summary</template>
  Current balance
  <template #footer>Updated now</template>
</MkCard>
```

Global configuration can override the root, slot wrappers, axes, and defaults:

```ts
app.use(
  createModeKit({
    ui: {
      card: {
        base: 'rounded-2xl',
        slots: {
          header: 'gap-2',
          footer: 'justify-between',
        },
        variants: {
          variant: {
            outline: 'border-2',
          },
          size: {
            lg: 'p-10',
          },
          body: {
            inset: 'border-2',
          },
        },
        defaultVariants: {
          variant: 'default',
          body: 'seamless',
          size: 'md',
        },
      },
    },
  }),
)
```

Resolution order for the root is: built-in CVA recipe → global base/axis config → local `ui.base` →
native `class`. Slot wrapper classes resolve as: built-in slot classes → global body treatment when
applicable → global slot config → local slot config. Later classes win conflicts.

## Accessibility

Card uses a Reka UI `Primitive` rendered as a neutral `<div>` and adds no landmark semantics
automatically. Supply native `role` and an
accessible name only when the Card represents a meaningful region. Keep heading hierarchy in the
slotted content rather than encoding it in the container.
