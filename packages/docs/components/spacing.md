# Spacing

Spacing creates explicit whitespace between interface elements without adding visible content. Use
`MkSpacing` when the space belongs to the composition rather than either neighboring component.

## Usage

<ComponentPreview name="spacing/SpacingPlayground" />

`orientation` defaults to `vertical`; use `horizontal` for space between elements in a row. The
component uses logical `block-size` and `inline-size`, so the generated dimension follows the
selected orientation without relying on physical width or height properties.

`size` defaults to `m` (`0.75rem`). Presets follow the shared ModeKit spacing scale:

| Size  | Resolved value |
| ----- | -------------- |
| `2xs` | `0.125rem`     |
| `xs`  | `0.25rem`      |
| `s`   | `0.5rem`       |
| `m`   | `0.75rem`      |
| `l`   | `1rem`         |
| `xl`  | `1.5rem`       |
| `2xl` | `2rem`         |
| `3xl` | `2.5rem`       |
| `4xl` | `3rem`         |

### Horizontal spacing

Horizontal spacing reserves inline space. Place neighboring elements in a row layout so they can
appear on either side of the spacer.

```vue
<div style="display: flex; align-items: center">
  <MkButton>Previous</MkButton>
  <MkSpacing orientation="horizontal" size="l" />
  <MkButton>Next</MkButton>
</div>
```

### Flexible spacing

Set `grow` to consume the remaining main-axis space in a flex container. This applies
`flex: 1 1 0%` and zero logical minimum sizes, which provides the familiar flexible-spacer
behavior without conflating it with `100%` sizing.

<ComponentPreview name="spacing/SpacingGrow" />

`grow` is mutually exclusive with `orientation` and `size`. The flex container decides whether the
remaining space is horizontal or vertical through its own `flex-direction`.

### Full-axis spacing

Set `size="full"` to reserve `100%` of the selected axis.

```vue
<MkSpacing size="full" />
<MkSpacing orientation="horizontal" size="full" />
```

`full` is intentionally different from `grow`: it occupies the entire axis rather than only the
remaining flex space. Account for neighboring content to avoid overflow.

### Pixel values

Pass a non-negative number for an exact pixel gap.

```vue
<MkSpacing :size="32" />
```

### CSS custom properties

Pass either a custom-property name or its `var()` expression. This keeps the gap responsive to
consumer-owned design tokens.

```vue
<section style="--section-gap: clamp(1rem, 4vw, 3rem)">
  <MkCard>Content above</MkCard>
  <MkSpacing size="--section-gap" />
  <MkCard>Content below</MkCard>
</section>
```

Both `--section-gap` and `var(--section-gap)` resolve to the same CSS value.

### Composition boundary

Spacing is intentionally empty and does not render slot content. Use borders or a separator
component when the gap must also communicate a visual division.

## API

### Props

| Prop          | Type                                                      | Default      | Description                                                     |
| ------------- | --------------------------------------------------------- | ------------ | --------------------------------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'`                              | `'vertical'` | Selects the logical axis for fixed and full spacing.            |
| `size`        | `SpacingPreset \| SpacingCSSVariable \| number \| 'full'` | `'m'`        | Sets the selected axis size; numbers are interpreted as pixels. |
| `grow`        | `boolean`                                                 | `false`      | Consumes remaining main-axis space in a flex container.         |
| `ui`          | `{ base?: ModeKitClassValue }`                            | —            | Adds or overrides classes for the transparent root.             |

The exported `SpacingProps` type prevents combining `grow` with `orientation` or `size`.

Native attributes and listeners are forwarded to the root `<div>`. Native `class` resolves after
built-in, global, and local classes. Native `style` resolves after the generated dimension or flex
styles.

## Styling

### Local overrides

```vue
<MkSpacing size="xl" :ui="{ base: 'opacity-50' }" />
```

### Global component configuration

```ts
createModeKit({
  ui: {
    spacing: {
      base: 'pointer-events-none',
    },
  },
})
```

Resolution order is: built-in recipe → global `base` → local `ui.base` → native root `class`.

## Accessibility

Spacing is decorative, has no content or semantic role, and is hidden from accessibility APIs. It
never changes source order or focus order. Do not use repeated Spacing instances to imitate semantic
structure; headings, sections, lists, and separators should retain their native meaning.
