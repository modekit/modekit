# Flex

Flex arranges direct children along one main axis and distributes available space between them.
`MkFlex` follows native CSS flexbox behavior while providing typed container axes, spacing presets,
flex-item controls, global configuration, and a polymorphic root.

## Usage

<ComponentPreview name="flex/FlexPlayground" />

The defaults match the browser flexbox model: a block-level row, no wrapping, stretched items on the
cross axis, and items packed at the main-axis start.

### Main and cross axes

`direction` defines the main axis. `row` and `row-reverse` follow the document's inline direction;
`column` and `column-reverse` follow its block direction. `justify` distributes items on that main
axis, while `align` positions items on the perpendicular cross axis.

```vue
<MkFlex direction="column" align="center" justify="space-between">
  ...
</MkFlex>
```

Available directions are `row`, `row-reverse`, `column`, and `column-reverse`. Main-axis alignment
supports `start`, `center`, `end`, `space-between`, `space-around`, and `space-evenly`. Cross-axis
alignment supports `start`, `center`, `baseline`, `end`, and `stretch`.

### Wrapping and line alignment

Set `wrap="wrap"` when items may continue onto additional lines. `wrap-reverse` reverses the cross-
axis line direction; it does not reverse the items within each line.

```vue
<MkFlex wrap="wrap" align-content="space-between" gap="m">
  ...
</MkFlex>
```

`alignContent` distributes multiple lines within available cross-axis space. It has no visible
effect on a single-line container or when the container has no extra cross-axis space.

### Row and column gaps

A single `gap` applies to both CSS gap axes. Pass `[row, column]` when they differ. Presets use the
shared ModeKit spacing scale; numbers are interpreted as pixels.

```vue
<MkFlex :gap="['s', 20]">
  <!-- row gap: 0.5rem; column gap: 20px -->
</MkFlex>
```

Available presets are `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, and `4xl`. Row and column gap
mean the CSS row and column axes regardless of `direction`.

### Flexible items and ratios

A Flex can itself participate as an item inside another flex container. A non-negative numeric
`flex` value expands to `<ratio> 1 0%`, distributing available main-axis space proportionally.

<ComponentPreview name="flex/FlexRatios" />

Use `initial`, `auto`, or `none` for the standard shorthand behaviors:

- `initial` — `0 1 auto`; do not grow, but allow shrinking.
- `auto` — `1 1 auto`; grow and shrink from the automatic basis.
- `none` — `0 0 auto`; neither grow nor shrink.

Pass `[grow, shrink, basis]` for an explicit shorthand. Numeric basis values become pixels and
spacing presets resolve through the ModeKit scale.

```vue
<MkFlex :flex="[2, 1, 240]">...</MkFlex>
<MkFlex :flex="[1, 0, 'min-content']">...</MkFlex>
```

The `flexGrow`, `flexShrink`, and `flexBasis` longhands are applied after `flex`, so an explicitly
provided longhand overrides that part of the shorthand. `order` and `alignSelf` configure the Flex
when it is an item. Prefer source order over `order` for meaningful reading and keyboard order.

### Display and root element

Use `display="inline-flex"` for an inline-level flex container or `display="none"` to remove it from
layout. Flex renders a `<div>` by default; `as` selects another semantic root.

```vue
<MkFlex as="nav" display="inline-flex" gap="s" aria-label="Primary actions">
  ...
</MkFlex>
```

Native attributes, listeners, `class`, and `style` are forwarded. Native styles are applied after
styles generated from Flex props.

## API

### Container props

| Prop           | Type                                                                                 | Default     | Description                                                |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------- |
| `as`           | `AsTag \| Component`                                                                 | `'div'`     | Changes the rendered root element or component.            |
| `display`      | `'none' \| 'flex' \| 'inline-flex'`                                                  | `'flex'`    | Controls the container's outer display behavior.           |
| `direction`    | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'`                             | `'row'`     | Defines the main axis and its direction.                   |
| `wrap`         | `'nowrap' \| 'wrap' \| 'wrap-reverse'`                                               | `'nowrap'`  | Controls whether items continue onto additional lines.     |
| `justify`      | `start \| center \| end \| space-between \| space-around \| space-evenly`            | `'start'`   | Distributes items along the main axis.                     |
| `align`        | `start \| center \| baseline \| end \| stretch`                                      | `'stretch'` | Aligns items along the cross axis.                         |
| `alignContent` | `start \| center \| end \| space-between \| space-around \| space-evenly \| stretch` | `'stretch'` | Distributes wrapped lines along the cross axis.            |
| `gap`          | `FlexGapValue \| [FlexGapValue, FlexGapValue]`                                       | `0`         | Sets equal or `[row, column]` gaps; numbers become pixels. |
| `ui`           | `{ base?: ModeKitClassValue }`                                                       | —           | Adds or overrides classes for the Flex root.               |

### Flex-item props

| Prop         | Type                                                                     | Description                                                   |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `flex`       | `'initial' \| 'auto' \| 'none' \| number \| [number, number, FlexBasis]` | Sets the flex shorthand when this Flex is itself a flex item. |
| `flexGrow`   | `number`                                                                 | Overrides the shorthand's non-negative growth factor.         |
| `flexShrink` | `number`                                                                 | Overrides the shorthand's non-negative shrink factor.         |
| `flexBasis`  | `FlexBasis`                                                              | Overrides the shorthand basis; numeric values become pixels.  |
| `alignSelf`  | `'auto' \| start \| center \| baseline \| end \| stretch`                | Overrides cross-axis alignment for this Flex item.            |
| `order`      | `number`                                                                 | Sets the integer visual order of this Flex item.              |

Native attributes, listeners, `class`, and `style` are forwarded to the root.

### Slots

| Slot      | Props | Description                                     |
| --------- | ----- | ----------------------------------------------- |
| `default` | —     | Direct children that participate as flex items. |

## Styling

### Local overrides

```vue
<MkFlex gap="m" :ui="{ base: 'rounded-xl bg-neutral-50 p-4' }">
  ...
</MkFlex>
```

### Global component configuration

```ts
createModeKit({
  ui: {
    flex: {
      base: 'min-w-0',
      variants: {
        justify: {
          'space-between': 'w-full',
        },
      },
      defaultVariants: {
        align: 'center',
        direction: 'row',
        display: 'flex',
        justify: 'start',
        wrap: 'nowrap',
      },
    },
  },
})
```

Resolution order is: built-in recipe → global base/variant config → local `ui.base` → native root
`class`. Native root `style` is applied after styles generated from Flex props.

## Accessibility

Flex changes visual layout only. It does not add a role or alter source order, focus order, or child
semantics. Choose a semantic root with `as`. Reverse directions and `order` change visual placement
without changing the document or keyboard sequence, so preserve a meaningful source order.

## References

- [MDN: Basic concepts of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts)
- [MDN: `flex`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex)
