# Architecture

ModeKit is a Vue 3 component library written in TypeScript. Its architecture has three parts:

1. **Components** expose typed props, events, slots, native attributes, and behavior.
2. **Accessible primitives** use native HTML first and Reka UI when more complex interaction logic is
   required.
3. **Class-based styling** uses Tailwind CSS v4 utilities composed into typed variants with CVA.

ModeKit does not maintain a JavaScript design-token resolver, platform mode, theme wrapper, or custom
cascade-layer system. Semantic color pairs live as shadcn-style CSS variables in the Tailwind entry
and components consume them through generated Tailwind utilities. Each component keeps rendering and
behavior in its component module and its CVA recipe in a separate
style module. The package ships the compiled Tailwind CSS required by built-in classes.

An optional `createModeKit()` Vue plugin provides application-wide class overrides and default
variants. Components work with their built-in recipe when the plugin is not installed.

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
- Tailwind Merge for consumer class overrides
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
