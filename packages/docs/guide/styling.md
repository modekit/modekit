# Styling

ModeKit styles its components with Tailwind CSS v4 and CVA. The Vue components own their markup and
behavior, while a nearby style module defines the component recipe.

```ts
const componentStyles = cva('mk:inline-flex mk:items-center', {
  variants: {
    size: {
      sm: 'mk:h-8 mk:px-3 mk:text-sm',
      md: 'mk:h-10 mk:px-4 mk:text-sm',
    },
  },
})
```

ModeKit ships the compiled stylesheet with `@modekit/vue`. An application does not need Tailwind to
render the built-in components.

```ts
import '@modekit/vue/styles.css'
```

## CSS namespace

ModeKit prefixes its generated Tailwind utilities and theme variables with `mk`:

```text
mk:bg-primary
mk:rounded-lg
--mk-color-neutral-900
```

This keeps ModeKit's generated utility selectors and theme variables separate from similarly named
application styles. ModeKit does not include Tailwind Preflight, so importing the package does not
reset the application's elements.

## Semantic theme

Components use semantic roles rather than a specific palette color. Each surface role has a matching
foreground where needed:

| Role                                     | Purpose                                |
| ---------------------------------------- | -------------------------------------- |
| `background` / `foreground`              | Application canvas and default text    |
| `surface` / `surface-foreground`         | Raised component surfaces              |
| `primary` / `primary-foreground`         | Primary actions and emphasized content |
| `secondary` / `secondary-foreground`     | Lower-emphasis controls and surfaces   |
| `muted` / `muted-foreground`             | Subdued surfaces and supporting text   |
| `accent` / `accent-foreground`           | Selected or highlighted content        |
| `border`                                 | General component boundaries           |
| `input`                                  | Form-control boundaries                |
| `ring`                                   | Focus rings                            |
| `success` / `success-foreground`         | Successful outcomes                    |
| `warning` / `warning-foreground`         | Cautionary states                      |
| `info` / `info-foreground`               | Informational states                   |
| `destructive` / `destructive-foreground` | Harmful or irreversible actions        |

The defaults are ordinary CSS custom properties. There is no color generator or JavaScript theme
resolver.

```css
:root {
  --mk-background: var(--mk-color-white);
  --mk-foreground: var(--mk-color-neutral-950);
  --mk-primary: var(--mk-color-neutral-900);
  --mk-primary-foreground: var(--mk-color-white);
  --mk-destructive: var(--mk-color-red-700);
  --mk-destructive-foreground: var(--mk-color-white);
}

.dark {
  --mk-background: var(--mk-color-neutral-950);
  --mk-foreground: var(--mk-color-neutral-50);
  --mk-primary: var(--mk-color-neutral-50);
  --mk-primary-foreground: var(--mk-color-neutral-950);
}
```

Override the public `--mk-*` semantic variables after importing ModeKit to adapt the theme without
rewriting component recipes:

```css
:root {
  --mk-primary: #4338ca;
  --mk-primary-foreground: #ffffff;
  --mk-ring: #6366f1;
}
```

Add `dark` to an ancestor to activate ModeKit's dark defaults. The application remains responsible
for deciding when that class is present; ModeKit does not require a theme provider.

## Shape and elevation

ModeKit uses `--mk-radius` as the base for its corner scale. Controls and containers derive their
corners from that value instead of declaring unrelated pixel values:

```css
:root {
  --mk-radius: 0.5rem;
}
```

With the default base, the scale resolves to 4, 6, 8, 12, and 16 pixels. Small controls use the
smaller steps, while larger controls and containing surfaces use the larger steps. This preserves a
visible hierarchy when a Button or another control is placed inside a Card.

Override the base once to make the whole library sharper or rounder:

```css
:root {
  --mk-radius: 0.375rem;
}
```

Raised surfaces use the semantic `--mk-elevation-raised` shadow. The light and dark defaults differ
because the same shadow opacity does not read equally against both schemes:

```css
:root {
  --mk-elevation-raised: 0 1px 3px rgb(0 0 0 / 0.1);
}
```

The elevation role is mapped into Tailwind’s `--shadow-raised` theme namespace and consumed with
the namespaced `mk:shadow-raised` utility. Components consume the radius scale and semantic
elevation role through namespaced Tailwind utilities; component recipes must not introduce raw
palette colors or one-off shadows.

## Component configuration

Component classes are collected in this order:

1. the built-in CVA recipe;
2. global component configuration from `createModeKit()`;
3. the component's local `ui` prop;
4. the native `class` attribute.

ModeKit resolves conflicts independently in two namespaces. ModeKit's `mk:` utilities merge with
other `mk:` utilities, while application utilities merge with other application utilities. A class
from one namespace never removes a class from the other. Load application CSS after ModeKit CSS when
an application class should override a built-in declaration.

### Global configuration

`createModeKit()` is an optional Vue plugin. It changes component defaults and adds application
classes without requiring a wrapper component.

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

The configuration follows the component recipe: `base`, named `variants`, `compoundVariants`, and
`defaultVariants`.

### Local configuration

Use `ui` when a class belongs to a component's styling contract. Use the native `class` attribute
for layout or a one-off application class.

```vue
<MkButton :ui="{ base: 'rounded-full' }" class="w-full">
  Save changes
</MkButton>
```

## Consumer Tailwind classes

ModeKit's stylesheet contains the utilities used by its built-in recipes. Tailwind utilities added
through global configuration, `ui`, or `class` must be generated by the consuming application's
Tailwind build.

Applications that do not use Tailwind can pass ordinary class names and define them in application
CSS.

## Styling rules

- Keep rendering and behavior separate from the CVA recipe.
- Use semantic theme roles instead of palette colors in component recipes.
- Use the shared radius scale and semantic elevation roles instead of one-off geometry or shadows.
- Keep finite visual choices in CVA variants.
- Keep state styling in explicit modifiers such as `disabled:` and `focus-visible:`.
- Keep global overrides aligned with the component's named variants.
- Merge local `ui` and native `class` after global configuration.
- Do not add a token generator or JavaScript theme resolver.
