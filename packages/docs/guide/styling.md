# Styling

ModeKit styles components with Tailwind CSS v4 utilities composed through CVA. Component files focus
on rendering and behavior; each component keeps its class recipe and override resolution in a
separate style module.

```ts
const componentStyles = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
    },
  },
})
```

ModeKit ships generated CSS with the Vue package. Applications can use built-in components without a
Tailwind installation or content-scanning configuration.

## Semantic colors

ModeKit follows shadcn's background/foreground pair convention. The Tailwind entry maps each
unprefixed pair into the color namespace:

```css
@theme static inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* secondary, neutral, success, info, warning, error */
}

:root {
  --primary: oklch(0.66 0.148 263);
  --primary-foreground: oklch(0.145 0 0);
}

.dark {
  --primary: oklch(0.7 0.128 263);
  --primary-foreground: oklch(0.145 0 0);
}
```

The built-in palette is generated in OKLCH rather than tuned color by color. Comparable chromatic
roles use perceptual lightness targets of `0.66` in light mode and `0.70` in dark mode with a
contrast-safe dark foreground. Saturation is normalized as relative chroma:

```text
relative chroma = C / Cmax(L, hue)
C = 0.82 × Cmax(L, hue)
```

`Cmax` is found with a binary search against the sRGB gamut. This preserves each semantic hue while
avoiding the uneven saturation and browser gamut mapping produced by one raw chroma value for every
hue. Neutral uses `0.12` relative chroma. Warning stays at `L = 0.80` with a dark foreground because
yellow needs a higher lightness to remain recognizable and accessible. The generator rejects any
surface/foreground pair below `4.5:1` contrast.

Run `pnpm theme:generate` after changing the model in `scripts/generate-semantic-colors.mjs`.
`pnpm theme:check` verifies that the CSS is current, every color is inside sRGB, and every foreground
meets the contrast floor.

Components use the generated utilities directly, such as `bg-primary`, `text-primary-foreground`,
`text-primary`, and `border-primary`. Surface variants combine those utilities with opacity and border
treatments while values remain centralized in CSS. Override the semantic variables after importing
ModeKit styles to theme every matching component.

## Override levels

Component classes resolve in a predictable order:

1. the built-in CVA recipe;
2. global component configuration from `createModeKit()`;
3. the component's local `ui` prop;
4. the native `class` attribute.

Tailwind Merge removes conflicting utilities at each resolution, with the later source winning.

## Global configuration

`createModeKit()` is an optional Vue plugin. It provides class overrides and default variants to all
ModeKit components in the application without requiring a wrapper component.

```ts
import { createApp } from 'vue'
import { createModeKit } from '@modekit/vue'
import App from './App.vue'

createApp(App)
  .use(
    createModeKit({
      ui: {
        button: {
          variants: {
            variant: {
              outline: 'border-2',
            },
          },
          compoundVariants: [
            {
              color: 'primary',
              variant: 'outline',
              class: 'uppercase tracking-wide',
            },
          ],
        },
      },
    }),
  )
  .mount('#app')
```

The configuration shape follows the component's recipe: `base`, named `variants`,
`compoundVariants`, and `defaultVariants`. It is intentionally smaller than Nuxt UI's build-generated
theme runtime and works in any Vue 3 application.

## Local configuration

Use a component's `ui` prop for a local styling override and `class` for layout or the final one-off
adjustment.

```vue
<MkButton :ui="{ base: 'rounded-full' }" class="w-full">
  Save changes
</MkButton>
```

## Consumer Tailwind classes

ModeKit's own compiled CSS contains only utilities used by its built-in recipes. Arbitrary Tailwind
utilities supplied through global config, `ui`, or `class` require the consuming application to run
Tailwind and scan the files containing those class strings.

Applications that do not use Tailwind can still pass ordinary class names and define them in their
own CSS.

## Color schemes

Light defaults live on `:root` and shadow hosts. A `.dark` ancestor overrides the same semantic
variables for dark mode. ModeKit does not require a theme wrapper.

## Styling rules

- Keep component rendering and behavior separate from its CVA recipe.
- Keep finite component choices in CVA variants.
- Keep state styling in explicit Tailwind modifiers such as `disabled:` and `focus-visible:`.
- Keep global overrides aligned with the component's named variants.
- Merge local `ui` and native `class` after global configuration.
- Do not add a token resolver or custom cascade-layer abstraction over Tailwind.
