# Architecture

ModeKit is a Vue 3 component library written in TypeScript. Its architecture is split into four
parts:

1. **Provider and context** manage the active platform, color scheme, density, and contrast.
2. **Components** expose the Vue props, events, slots, and behavior used by an application.
3. **Composables** contain Vue logic that is useful across more than one component.
4. **Design tokens and styles** translate active settings into colors, spacing, typography, sizing,
   motion, and component appearance.

Components read their settings from the nearest ModeKit provider. This allows a whole application
to share one mode while supporting a differently configured section when needed.

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
- Vite for package builds
- VitePress for documentation
- CSS custom properties for design tokens
- pnpm workspaces for dependency management

## Public API guidelines

- Prefer a semantic prop such as `variant="primary"` over a prop describing a CSS class or color.
- Avoid platform-specific props when one semantic behavior works in every mode.
- Use consistent event names and typed payloads.
- Be clear about which state is controlled by the application.
- Do not encourage consumers to depend on internal DOM structure.
