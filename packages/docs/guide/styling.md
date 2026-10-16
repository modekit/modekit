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
--mk-neutral-900
```

This keeps ModeKit's generated utility selectors and theme variables separate from similarly named
application styles. The standard stylesheet does not include Tailwind Preflight, so importing it
does not reset the application's elements. ModeKit applies narrowly scoped normalization only to
its own component roots, such as removing browser-default margins from its typography components.

## Optional Preflight

Applications that use ModeKit as their CSS foundation can opt into Tailwind Preflight separately:

```ts
import '@modekit/vue/preflight.css'
import '@modekit/vue/styles.css'
```

Import Preflight before the component stylesheet. It globally normalizes native elements, including
margins, borders, headings, lists, form controls, and replaced media. Do not import it when another
framework or application reset already owns those global defaults.

## Theme colors

ModeKit's configurable color theme contains only `primary`, `primary-foreground`, and a neutral
scale. Components use explicit neutral, white, and primary utilities for their surfaces, text,
borders, and focus states instead of adding more semantic color variables.

Color-capable components accept `primary`, `neutral`, and Tailwind palette families. Palette values
include `slate`, `gray`, `zinc`, `stone`, `red`, `orange`, `amber`,
`yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`,
`fuchsia`, `pink`, and `rose`.

The defaults are ordinary CSS custom properties backed by ModeKit's packaged Tailwind palette.
Configure their palette families when installing the optional plugin:

```ts
createModeKit({
  theme: {
    primary: 'green',
    neutral: 'slate',
  },
})
```

`primary` accepts `black`, the gray families, and the chromatic palette families. `neutral` accepts
`slate`, `gray`, `zinc`, and `stone`. The selected families set `data-mk-primary` and
`data-mk-neutral` on the document root, where the static stylesheet maps them to the public theme
variables.

### Document ownership

Theme palette selection is document-global, not isolated per Vue application. Installing
`createModeKit()` writes the configured values to `document.documentElement`. Every ModeKit
component in that document therefore consumes the same primary and neutral variables.

When multiple Vue applications install ModeKit in one document, the last installation that
specifies a palette family writes that attribute for all applications. An omitted `primary` or
`neutral` option leaves the corresponding existing document attribute unchanged, so partial
configurations can combine with values written by another application. Coordinate one document
theme between application entry points rather than expecting per-application palettes.

ModeKit intentionally does not add a theme-provider hierarchy or runtime theme engine. Applications
that require independently themed regions can scope explicit CSS variable overrides to those
regions. Content portalled outside such a region will not inherit its scoped overrides.

### Server-rendered pages

The plugin does not access or mutate a document during server rendering. An SSR host must put the
same allowlisted palette attributes on the initial `<html>` element that the client plugin will use:

```html
<html lang="en" data-mk-primary="green" data-mk-neutral="slate">
  <!-- server-rendered application -->
</html>
```

Render these attributes in the initial response, before `@modekit/vue/styles.css` is evaluated. This
lets the first paint use the intended palette instead of painting the black/zinc defaults and then
changing colors when the client application installs ModeKit.

Use one shared theme value for both server markup and client setup:

```ts
const modeKitTheme = {
  primary: 'green',
  neutral: 'slate',
} as const

// Server layout/template:
// <html data-mk-primary="green" data-mk-neutral="slate">

// Client entry:
app.use(createModeKit({ theme: modeKitTheme }))
```

If a preference is read from a cookie or request, validate it against ModeKit's supported primary
and neutral families before serializing it into HTML, then pass the same validated values to the
client. The client installation preserves matching server-rendered attributes.

### Portals and theme inheritance

Default portals render into `document.body`. Because the palette attributes and public theme
variables live on the document root, body-portalled Dialog, Select, Dropdown, Tooltip, and other
overlay content inherits the same document theme.

Scoped application CSS selectors and region-level variable overrides are different: content moved
to `document.body` leaves that local subtree. Use a portal target inside the styled region, apply the
variables to the portal container, or keep the relevant styles in document scope. For Shadow DOM,
load ModeKit CSS in the portal's scope and target an element within that styled shadow root when the
overlay must remain there.

```css
:root {
  --mk-neutral-50: var(--mk-color-zinc-50);
  --mk-neutral-500: var(--mk-color-zinc-500);
  --mk-neutral-950: var(--mk-color-zinc-950);
  --mk-primary: var(--mk-neutral-900);
  --mk-primary-foreground: var(--mk-color-white);
}

.dark {
  --mk-primary: var(--mk-neutral-50);
  --mk-primary-foreground: var(--mk-neutral-950);
}
```

Override the primary pair after importing ModeKit to adapt branded controls without rewriting
component recipes:

```css
:root {
  --mk-primary: #4338ca;
  --mk-primary-foreground: #ffffff;
}
```

To select a different neutral family, override the `--mk-neutral-50` through `--mk-neutral-950`
aliases. They use the zinc scale by default.

Add `dark` to an ancestor to activate ModeKit's explicit dark utilities. The application remains responsible
for deciding when that class is present and for setting the document's `color-scheme`; ModeKit does
not change native controls or scrollbars outside its components and does not require a theme provider.

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
      theme: {
        primary: 'green',
        neutral: 'slate',
      },
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
- Use the primary pair and neutral scale for component recipes; use direct palette colors for explicit states.
- Use the shared radius scale and semantic elevation roles instead of one-off geometry or shadows.
- Keep finite visual choices in CVA variants.
- Keep state styling in explicit modifiers such as `disabled:` and `focus-visible:`.
- Keep global overrides aligned with the component's named variants.
- Merge local `ui` and native `class` after global configuration.
- Do not add a token generator or JavaScript theme resolver.
