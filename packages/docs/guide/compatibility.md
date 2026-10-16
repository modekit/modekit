# Compatibility contract

ModeKit treats its documented Vue APIs, package entry points, and customization boundaries as its
public compatibility contract. Reviews must assess changes against this contract even when an
implementation refactor produces no TypeScript error.

## Tested environments

| Area               | Current evidence                                                                  |
| ------------------ | --------------------------------------------------------------------------------- |
| Vue                | `3.5.0` minimum and the repository's current Vue 3.5 release                      |
| TypeScript         | `5.0.4` minimum for declarations/templates and the repository's current version   |
| Node/build tooling | Node `22.22.2` and Node 24 CI; package engine floor is `>=22.22.2`                |
| Module format      | ESM package imports through the declared `exports` map                            |
| Browser automation | Current Playwright Chromium interaction, accessibility, and visual checks         |
| SSR and hydration  | Vue server rendering plus client hydration smoke tests, including portalled UI    |
| Styling            | Compiled CSS; consuming applications do not need Tailwind for built-in components |

Firefox, WebKit, screen readers, forced contrast, zoom, and touch combinations are not yet
release-tested. Passing automated Chromium checks is not a blanket browser or accessibility
certification. See [Accessibility](./accessibility) for the current evidence and manual test gaps.

The package avoids browser globals during server rendering. Palette selection cannot run without a
document, so SSR hosts must render matching theme attributes into the initial HTML. See
[Styling](./styling#server-rendered-pages) for the document-global theme, first-paint, portal, and
Shadow DOM boundaries.

## Supported public surface

The compatibility-sensitive surface includes:

- documented component props, their accepted values, and defaults;
- documented emitted events, event names, payloads, and cancellation behavior;
- documented slots, slot props, and required composition rules;
- exported components, functions, constants, and TypeScript types;
- documented native-attribute forwarding and controlled or uncontrolled state behavior;
- documented accessibility behavior, keyboard interaction, focus movement, and portal behavior;
- documented global configuration keys, component `ui` keys, named variants, and default variants;
- documented CSS variables, including `--mk-primary`, `--mk-primary-foreground`,
  `--mk-neutral-50` through `--mk-neutral-950`, `--mk-radius`, and
  `--mk-elevation-raised`;
- the documented root theme attributes `data-mk-primary` and `data-mk-neutral`; and
- published package import paths.

The supported package imports are:

```ts
import { MkButton, createModeKit } from '@modekit/vue'
import type { ButtonProps, ModeKitOptions } from '@modekit/vue'
import '@modekit/vue/styles.css'
import '@modekit/vue/preflight.css' // optional global reset
```

Only paths declared in the package `exports` map are public. Deep imports into `dist`, `src`, or a
component directory are implementation details even if a tool can currently resolve them.

Documentation defines which CSS variables and customization keys are supported. The presence of an
additional variable, class, data attribute, or element in generated output does not make it public.

## Internal implementation details

ModeKit may change undocumented internal DOM wrappers, element nesting, generated Tailwind
utilities, `mk-*` structural classes, Reka UI implementation details, and undocumented component
data attributes. Consumers must not use those details as selectors or application state hooks.

Internal does not mean visually irrelevant. Reviews must still assess changes to:

- accessible names, roles, relationships, and keyboard behavior;
- focus order, focus restoration, dismissal, and portalled interaction;
- visible layout, spacing, typography, color, motion, and responsive behavior; and
- native attribute and event forwarding.

An internal refactor that changes accessibility or documented visible behavior requires the same
care as an explicit API change.

## Customization boundaries

Prefer public props for semantic and finite visual choices. Use global `createModeKit({ ui })`
configuration or a component's local `ui` prop for documented recipe parts, and use the native
`class` attribute for application layout or one-off classes.

Application classes passed through these public boundaries are consumer-owned. ModeKit's built-in
generated class list is not stable, and copying it from rendered markup is unsupported.

Theme palette selection is document-global. See [Styling](./styling#document-ownership) for
multi-application behavior, SSR setup, and portal inheritance.
