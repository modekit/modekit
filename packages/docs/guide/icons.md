<script setup lang="ts">
import { Bell, Search, Settings } from '@lucide/vue'
</script>

# Icons

ModeKit components are icon-library agnostic: components expose slots and inherit icon color through
`currentColor` rather than bundling product-specific symbols. ModeKit's documentation and recommended
application default is [Lucide](https://lucide.dev/) through the supported `@lucide/vue` package.

<div style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem 0">
  <Search aria-hidden="true" :size="16" :stroke-width="1.75" />
  <Bell aria-hidden="true" :size="20" :stroke-width="1.75" />
  <Settings aria-hidden="true" :size="24" :stroke-width="1.75" />
</div>

## Install Lucide

```sh
pnpm add @lucide/vue
```

Import named icons so the application bundles only the symbols it uses:

```vue
<script setup lang="ts">
import { Search } from '@lucide/vue'
</script>

<template>
  <MkInput placeholder="Search projects">
    <template #leading>
      <Search aria-hidden="true" :size="16" :stroke-width="1.75" />
    </template>
  </MkInput>
</template>
```

Icons belong in a component's icon or content slot. Do not make a general component depend on Lucide
internally unless the symbol is part of that component's fixed semantics. Loading indicators remain
ModeKit `Spinner` instances rather than Lucide loader icons.

## Recommended sizing

Match the icon to the component's visual size rather than the surrounding font size:

| Context                         | Icon size | Recommended stroke |
| ------------------------------- | --------- | ------------------ |
| Small controls and input slots  | `14px`    | `1.75`             |
| Medium controls and input slots | `16px`    | `1.75`             |
| Large controls and input slots  | `20px`    | `1.75`             |
| Standalone compact actions      | `20px`    | `1.75–2`           |
| Feature or empty-state artwork  | `24–32px` | `1.5–1.75`         |

Treat these as optical defaults. An unusually dense or detailed icon may need one neighboring size,
but icons within one control group should share size and stroke width.

## Visual guidelines

- Use outline icons for actions, navigation, and input context to match ModeKit's restrained surfaces.
- Keep `stroke-width="1.75"` as the application default; use `2` only where a stronger compact symbol
  is necessary.
- Let icons inherit `currentColor`; color the component or slot instead of setting SVG stroke colors.
- Use one icon family within a product surface. Mixing stroke geometry and corner styles makes controls
  look inconsistent even when their dimensions match.
- Preserve square view boxes. Do not stretch icons or compensate with arbitrary horizontal margins.
- Prefer familiar symbols over decorative alternatives, especially for destructive or irreversible
  actions.
- Use ModeKit `Spinner` for progress. A static Lucide loader icon does not communicate loading, and a
  separately animated one would duplicate ModeKit behavior.

## Accessibility

Decorative icons next to visible text or inside a labeled input should use `aria-hidden="true"`.
Icon-only controls need an accessible name on the interactive element, not on the SVG:

```vue
<MkButton aria-label="Open settings" variant="ghost">
  <Settings aria-hidden="true" :size="16" :stroke-width="1.75" />
</MkButton>
```

Do not rely on an icon alone for unfamiliar actions. Add visible text or a tooltip while retaining the
accessible name.

## Other compatible libraries

Lucide is the ModeKit default, but these libraries can fit when used consistently:

| Library                                            | Fit                                                     | Guidance                                                    |
| -------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| [Tabler Icons](https://tabler.io/icons)            | Very close: 24px outline grid and restrained geometry   | Use one stroke width and do not mix with Lucide per screen. |
| [Heroicons](https://heroicons.com/)                | Good for Tailwind-oriented applications                 | Choose either outline or solid as the product default.      |
| [Phosphor Icons](https://phosphoricons.com/)       | Good when multiple weights are a deliberate design need | Standardize one weight for ordinary ModeKit controls.       |
| [Material Symbols](https://fonts.google.com/icons) | Suitable for Material-oriented products                 | Prefer SVG components and lock one optical style/weight.    |

Avoid icon fonts when an SVG component package is available. SVG components provide predictable
sizing, tree-shaking, `currentColor`, and accessible markup without font-loading shifts.
