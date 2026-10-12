# About ModeKit

ModeKit is an accessible, feature-rich component library for Vue 3 applications. It provides typed,
composable components that cover the states and interactions needed in production interfaces.

## Why build this?

Application teams often choose between low-level primitives that require substantial product work
and visual libraries that are difficult to adapt. ModeKit aims for the useful middle: accessible
behavior, polished defaults, flexible composition, and straightforward class-based styling.

ModeKit uses:

- Vue 3 and TypeScript for its public component API;
- Reka UI for proven accessible behavior where native HTML is not enough;
- Tailwind CSS v4 for component styling;
- CVA for typed visual variants;
- Tailwind Merge for predictable consumer class overrides.

The package ships compiled CSS, so applications do not need to install or configure Tailwind to use
ModeKit.

## Who is it for?

- Vue application teams
- TypeScript-first projects
- Product teams building dashboards, administration tools, SaaS products, and application shells
- Teams that want accessible components without owning every interaction primitive themselves

## What we care about

- **Complete component behavior.** Loading, disabled, error, empty, overflow, and keyboard states
  are designed rather than left to each application.
- **Predictable APIs.** Components use semantic props, typed slots, native attributes, and consistent
  naming.
- **Accessibility by default.** Keyboard and screen-reader behavior belongs in the component.
- **Class-based styling.** Tailwind utilities and CVA variants remain readable, local, and easy to
  evolve.
- **Small, proven releases.** Each component is tested, documented, and reviewed before the catalogue
  grows.

ModeKit is successful when components are quick to adopt, difficult to misuse, visually coherent,
and flexible enough to support real products.
