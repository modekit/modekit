# Card

Cards group related information and actions into one visual surface. `MkCard` renders through Reka
UI's `Primitive` as a neutral div through `MkGrid` and provides surface variants, a compact spacing
scale, named composition slots, edge-reaching content, native div attributes, and class-based
customization.

## Usage

### Variant and size

Use `variant` to choose the surface treatment and `size` to control padding, corners, and the
`MkGrid` gap between the header, body, and footer.

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

### Body treatments

`seamless` remains the default and preserves one shared surface across every Card region. Inset and
flush bodies use a raised panel on `muted` Cards and a recessed neutral well on white Card variants.
Header and footer content remain on the outer surface.

#### Inset

Use `body="inset"` to place the default slot in its own bordered panel with a small offset from the
nearest Card edges, including the top or bottom when the body is the first or last region.

<ComponentPreview name="card/CardBodyInset" />

#### Flush

Use `body="flush"` for the same panel treatment while extending the body all the way to the Card's
sides.

<ComponentPreview name="card/CardBodyFlush" />

ModeKit currently exposes `seamless`, `inset`, and `flush`. Additional body treatments will continue
to be introduced individually.

### Edge content

Use `MkCardEdge` for media or any other content that should escape the current Card region's padding.
It always reaches the horizontal edges. When it is the first or last child, it also reaches that
vertical edge and rounds only the corners it touches. The nearest region can be the Card surface or
an `inset` or `flush` body panel.

<ComponentPreview name="card/CardEdge" />

`MkCardEdge` is intentionally content-agnostic. Images should still provide meaningful alternative
text and define their own dimensions or aspect ratio.

## API

### Props

| Prop          | Type                                          | Default      | Description                                                   |
| ------------- | --------------------------------------------- | ------------ | ------------------------------------------------------------- |
| `body`        | `'seamless' \| 'inset' \| 'flush'`            | `'seamless'` | Sets how the body is distinguished from the outer Card.       |
| `variant`     | `'shadow' \| 'muted' \| 'outline' \| 'plain'` | `'shadow'`   | Sets the neutral surface treatment.                           |
| `size`        | `'sm' \| 'md' \| 'lg'`                        | `'md'`       | Sets the Grid gap, padding, and corner scale.                 |
| `title`       | `string`                                      | —            | Renders an `MkHeadline` in the header when no slot is given.  |
| `description` | `string`                                      | —            | Renders an `MkText` description when no header slot is given. |
| `ui`          | `CardUI`                                      | —            | Adds or overrides root and slot wrapper classes.              |

All other native div attributes, listeners, and classes are forwarded to the root `<div>`.

### Slots

| Slot             | Description                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `header`         | Optional content rendered before the body; replaces generated title and description content. |
| `header-actions` | Optional actions aligned beside either generated or custom header content.                   |
| `default`        | Main Card content.                                                                           |
| `footer`         | Optional content rendered after the body.                                                    |

When no `header` slot is supplied, `title` renders as an `MkHeadline` with an `h3` root and
`description` renders as an `MkText` paragraph. Supplying the `header` slot keeps its content
untouched and takes precedence over both convenience props. The independent `header-actions` slot
does not replace either form of header content. Omitted regions do not render empty wrappers.

### `MkCardEdge`

| Prop | Type         | Default | Description                                      |
| ---- | ------------ | ------- | ------------------------------------------------ |
| `as` | `CardEdgeAs` | `'div'` | Changes the rendered root element or component.  |
| `ui` | `CardEdgeUI` | —       | Adds or overrides classes on the edge container. |

All other native attributes and classes are forwarded to the root. The default slot accepts the
content that should reach the nearest Card-region edges.

## Styling

Use `ui` for local root or slot wrapper customization. Native `class` applies last on the root.

```vue
<MkCard
  description="Updated from the latest settlement."
  title="Account summary"
  variant="muted"
  :ui="{
    base: 'rounded-3xl',
    header: 'gap-2',
    headerActions: 'self-center',
    body: 'text-sm',
    footer: 'justify-end',
  }"
>
  <template #header-actions>
    <MkButton size="sm" variant="ghost">Details</MkButton>
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
          headerActions: 'self-center',
          body: 'text-sm',
          footer: 'justify-between',
        },
        variants: {
          body: {
            inset: 'ring-1',
            flush: 'ring-1',
          },
          variant: {
            outline: 'border-2',
          },
          size: {
            lg: 'p-10',
          },
        },
        defaultVariants: {
          body: 'seamless',
          variant: 'shadow',
          size: 'md',
        },
      },
      cardEdge: {
        base: 'bg-neutral-100',
      },
    },
  }),
)
```

Resolution order for the root is: built-in CVA recipe → global base/axis config → local `ui.base` →
native `class`. Slot wrapper classes resolve as: built-in slot classes → global slot config → local
slot config. `MkCardEdge` resolves as: built-in edge recipe → global `cardEdge.base` → local
`ui.base` → native `class`. Conflicts are merged independently within the ModeKit and application
namespaces.

## Accessibility

Card uses a Reka UI `Primitive` rendered as a neutral `<div>` and adds no landmark semantics
automatically. Its internal `MkGrid` renders as that same root `<div>` without adding another
wrapper. Supply native `role` and an accessible name only when the Card represents a
meaningful region. The `title` convenience prop renders an `h3`; use the `header` slot with
`MkHeadline` when the surrounding document requires a different heading level. `MkCardEdge` is a
neutral layout wrapper and adds no semantics. Give contained images appropriate `alt` text, using an
empty value only when the image is decorative.
