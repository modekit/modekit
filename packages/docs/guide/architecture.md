# Architecture

ModeKit is a Vue 3 component library written in TypeScript. Its architecture has three parts:

1. **Components** expose typed props, events, slots, native attributes, and behavior.
2. **Accessible primitives** use native HTML first and Reka UI when more complex interaction logic is
   required.
3. **Class-based styling** uses Tailwind CSS v4 utilities composed into typed variants with CVA.

ModeKit does not generate design tokens or palette values at runtime. Color, shape, and elevation
roles live as static CSS variables in the Tailwind entry, and components consume them through
generated Tailwind utilities. ModeKit prefixes its internal utility selectors and theme variables
with `mk` so they do not claim generic Tailwind names in the consuming application. Each component
keeps rendering and behavior in its component module and its CVA recipe in a separate style module.
The package ships the compiled CSS required by built-in classes, limits its default base rules to
ModeKit-owned selectors, and exposes Tailwind Preflight through a separate opt-in stylesheet.

An optional `createModeKit()` Vue plugin selects the primary and neutral palette families and
provides application-wide class overrides and default variants. Components use the default black
primary and zinc neutral theme with their built-in recipes when the plugin is not installed.

## Repository structure

```text
packages/
  docs/             VitePress documentation
  vue/              @modekit/vue source, tests, and package build
```

Keeping documentation in the same workspace allows package behavior and its explanation to change
together and be verified by the same repository build.

## Technology

- Vue 3 with the Composition API
- TypeScript with strict type checking
- Reka UI for accessible primitives
- Tailwind CSS v4 for styling
- CVA for component variants
- Tailwind Merge for ModeKit's namespaced utility conflicts
- Vite for package builds
- VitePress for documentation
- pnpm workspaces for dependency management

## Public API guidelines

- Keep semantic intent in props such as `color="primary"` and surface treatment in props such as
  `variant="soft"`.
- Use CVA for finite visual choices, expose typed class overrides through global config and local
  `ui`, and merge a consumer-provided `class` last.
- Keep internal classes and DOM structure out of the compatibility contract.
- Use consistent event names and typed payloads.
- Be clear about which state is controlled by the application.
