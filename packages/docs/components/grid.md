# Grid

Grid arranges direct children in equal CSS Grid tracks. `MkGrid` supports a fixed column count or a
responsive minimum column width, preset or pixel gaps, cross-axis alignment, logical layout props,
and a polymorphic root.

## Usage

### Fixed columns

Use `columns` to split the available inline size into equal `minmax(0, 1fr)` tracks. Additional items
flow into implicit rows.

<ComponentPreview name="grid/GridPlayground" />

The zero minimum keeps long grid items from forcing a track wider than its share. Content that must
wrap may still need `min-inline-size: 0` on the grid item itself.

### Responsive columns

Use `minColWidth` instead of `columns` when the number of tracks should follow the available space.
The Grid uses `repeat(auto-fit, minmax(..., 1fr))`, so empty tracks collapse and occupied tracks share
the remaining width.

<ComponentPreview name="grid/GridResponsive" />

`minColWidth` is measured in pixels and takes precedence when both track props are supplied. Prefer
one track strategy per Grid.

### Row and column gaps

A single `gap` value applies to both axes. Pass `[row, column]` when they differ. Presets follow the
ModeKit spacing scale; numbers are interpreted as pixels.

```vue
<MkGrid :columns="3" :gap="['s', 20]">
  <!-- row gap: 0.5rem; column gap: 20px -->
</MkGrid>
```

Available presets are `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, and `4xl`.

### Alignment and display

`align` maps to `align-items`. `display` switches between `grid`, `inline-grid`, and `none` without
changing the track definition.

```vue
<MkGrid align="center" display="inline-grid" :columns="2" gap="m">
  ...
</MkGrid>
```

### Logical layout props

Grid exposes logical sizing, spacing, inset, overflow, positioning, self-alignment, and flex-item
props. Numeric lengths become pixels; strings are passed through as CSS values; spacing presets
resolve through the ModeKit scale.

```vue
<MkGrid
  :min-col-width="220"
  gap="l"
  inline-size="100%"
  max-inline-size="72rem"
  margin="auto-inline"
  padding-block="m"
  overflow="hidden"
>
  ...
</MkGrid>
```

The special `margin` values apply ModeKit's base container spacing (`1rem`): `auto` on both axes,
`auto-inline` on the inline axis, and `auto-block` on the block axis. `none` removes root margin.
Use ordinary presets, pixel numbers, or CSS strings for explicit margins.

### Root element

Grid renders a `<div>` by default. Use `as` for another semantic root. Native attributes, listeners,
`class`, and `style` are forwarded; an explicit native style is applied after Grid's generated style.

```vue
<MkGrid as="section" :columns="2" gap="m" aria-labelledby="team-heading">
  ...
</MkGrid>
```

## API

### Grid props

| Prop          | Type                                                      | Default     | Description                                                    |
| ------------- | --------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `as`          | `AsTag \| Component`                                      | `'div'`     | Changes the rendered root element or component.                |
| `align`       | `'start' \| 'center' \| 'baseline' \| 'end' \| 'stretch'` | `'stretch'` | Sets `align-items`.                                            |
| `columns`     | `number`                                                  | `1`         | Creates this many equal columns.                               |
| `display`     | `'none' \| 'grid' \| 'inline-grid'`                       | `'grid'`    | Controls the Grid display mode.                                |
| `gap`         | `GridGapValue \| [GridGapValue, GridGapValue]`            | `0`         | Sets equal or `[row, column]` gaps; numbers are pixels.        |
| `margin`      | `GridSpecialMargin \| GridLength`                         | `'none'`    | Sets root margin, including ModeKit container-spacing aliases. |
| `minColWidth` | `number`                                                  | —           | Creates responsive auto-fit columns with this pixel minimum.   |
| `ui`          | `{ base?: ModeKitClassValue }`                            | —           | Adds or overrides classes for the Grid root.                   |

`GridGapValue` is a spacing preset or a non-negative pixel number. `columns` must be a positive
integer and `minColWidth` must be greater than zero.

### Logical spacing props

| Prop                                                                                                                         | Type          | Description                                              |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------- |
| `marginBlock`, `marginBlockStart`, `marginBlockEnd`, `marginInline`, `marginInlineStart`, `marginInlineEnd`                  | `GridLength`  | Sets logical outer spacing.                              |
| `padding`, `paddingBlock`, `paddingBlockStart`, `paddingBlockEnd`, `paddingInline`, `paddingInlineStart`, `paddingInlineEnd` | `GridPadding` | Sets root or logical inner spacing; supports `'system'`. |

### Logical size and position props

| Prop                                                                                                           | Type                | Description                                      |
| -------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------ |
| `inlineSize`, `minInlineSize`, `maxInlineSize`                                                                 | `GridSize`          | Controls logical inline sizing.                  |
| `blockSize`, `minBlockSize`, `maxBlockSize`                                                                    | `GridSize`          | Controls logical block sizing.                   |
| `inset`, `insetBlock`, `insetBlockStart`, `insetBlockEnd`, `insetInline`, `insetInlineStart`, `insetInlineEnd` | `GridInset`         | Controls physical or logical offsets.            |
| `position`                                                                                                     | `GridPosition`      | Sets CSS positioning.                            |
| `overflow`, `overflowBlock`, `overflowInline`                                                                  | `GridOverflow`      | Controls overall or logical-axis overflow.       |
| `alignSelf`, `justifySelf`                                                                                     | `GridSelfAlignment` | Aligns the Grid when it is itself a layout item. |
| `flexBasis`, `flexGrow`, `flexShrink`                                                                          | CSS value or number | Configures Grid when it is a flex item.          |

Native attributes, listeners, `class`, and `style` are forwarded to the root.

### Slots

| Slot      | Props | Description                                     |
| --------- | ----- | ----------------------------------------------- |
| `default` | —     | Direct children that participate as grid items. |

## Styling

### Local overrides

```vue
<MkGrid :columns="3" gap="m" :ui="{ base: 'rounded-xl bg-neutral-50 p-4' }">
  ...
</MkGrid>
```

### Global component configuration

```ts
createModeKit({
  ui: {
    grid: {
      base: 'min-w-0',
      variants: {
        align: {
          center: 'place-items-center',
        },
      },
      defaultVariants: {
        align: 'stretch',
        display: 'grid',
      },
    },
  },
})
```

Resolution order is: built-in recipe → global base/variant config → local `ui.base` → native root
`class`. Native root `style` is applied after styles generated from Grid props.

## Accessibility

Grid changes visual layout only. It does not add a role or alter source order, focus order, or child
semantics. Choose a semantic root with `as`, preserve a meaningful DOM order, and label regions when
the content requires it. CSS Grid placement should not be used to make the visual reading order
differ from the document order.

## References

- [MDN: Basic concepts of grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts)
