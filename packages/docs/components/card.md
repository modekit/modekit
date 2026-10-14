# Card

Cards group related information and actions into one visual surface. `MkCard` renders through Reka
UI's `Primitive` as a neutral div and provides surface variants, a compact spacing scale, named
composition slots, native div attributes, and class-based customization.

## Usage

### Variant and size

Use `variant` to choose the surface treatment and `size` to control internal spacing.

<ComponentPreview name="card/CardVariants" />

Available variants are `shadow`, `muted`, `outline`, and `plain`. Available sizes are `sm`, `md`,
and `lg`.

The `shadow` variant uses the same raised shadow at every Card size. ModeKit keeps the full raised
shadow token scale available for other components and application overrides.

- `shadow` uses white, `white/10` in dark mode, and a clear raised shadow without a border.
- `muted` uses the neutral scale without a border.
- `outline` uses the white surface with an explicit neutral border and no shadow.
- `plain` uses the white surface without a border or shadow.

Card corners use the container steps of ModeKit's shared radius scale. With the default
`--mk-radius`, `sm`, `md`, and `lg` resolve to 8, 12, and 16 pixels. Controls use lower steps at the
same size, so a Button placed inside a Card remains visually subordinate to its container.

## API

### Props

| Prop          | Type                                          | Default    | Description                                                   |
| ------------- | --------------------------------------------- | ---------- | ------------------------------------------------------------- |
| `variant`     | `'shadow' \| 'muted' \| 'outline' \| 'plain'` | `'shadow'` | Sets the neutral surface treatment.                           |
| `size`        | `'sm' \| 'md' \| 'lg'`                        | `'md'`     | Sets the gap and padding scale.                               |
| `title`       | `string`                                      | —          | Renders an `MkHeadline` in the header when no slot is given.  |
| `description` | `string`                                      | —          | Renders an `MkText` description when no header slot is given. |
| `ui`          | `CardUI`                                      | —          | Adds or overrides root and slot wrapper classes.              |

All other native div attributes, listeners, and classes are forwarded to the root `<div>`.

### Slots

| Slot      | Description                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- |
| `header`  | Optional content rendered before the body; replaces generated title and description content. |
| `default` | Main Card content.                                                                           |
| `footer`  | Optional content rendered after the body.                                                    |

When no `header` slot is supplied, `title` renders as an `MkHeadline` with an `h3` root and `description` renders as an `MkText` paragraph. Supplying the slot keeps its content untouched and takes precedence over both convenience props. Omitted regions do not render empty wrappers.

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
  <template #header>
    <MkHeadline as="h2" size="xs">Account summary</MkHeadline>
  </template>
  Current balance
  <template #footer>
    <MkCaption>Updated now</MkCaption>
  </template>
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
          body: 'text-sm',
          footer: 'justify-between',
        },
        variants: {
          variant: {
            outline: 'border-2',
          },
          size: {
            lg: 'p-10',
          },
        },
        defaultVariants: {
          variant: 'shadow',
          size: 'md',
        },
      },
    },
  }),
)
```

Resolution order for the root is: built-in CVA recipe → global base/axis config → local `ui.base` →
native `class`. Slot wrapper classes resolve as: built-in slot classes → global slot config → local
slot config. Conflicts are merged independently within the ModeKit and application namespaces.

## Accessibility

Card uses a Reka UI `Primitive` rendered as a neutral `<div>` and adds no landmark semantics
automatically. Supply native `role` and an accessible name only when the Card represents a
meaningful region. The `title` convenience prop renders an `h3`; use the `header` slot with
`MkHeadline` when the surrounding document requires a different heading level.
