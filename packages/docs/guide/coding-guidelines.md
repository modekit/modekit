# Coding guidelines

## TypeScript

- Require strict type checking.
- Avoid `any`. If an external boundary forces its use, keep it local and explain why.
- Export only types that belong to the supported API.
- Add explicit return types to public functions so internal types do not leak accidentally.
- Prefer discriminated unions for meaningful component states.

## Vue

- Use the Composition API and `<script setup lang="ts">` for single-file components.
- Keep props, events, slots, and exposed methods explicitly typed.
- Do not mutate consumer-owned objects.
- Forward appropriate native attributes and listeners to the semantic root element.

## Styling

- Keep each component's CVA recipe and class-resolution function outside its render component.
- Compose base, variant, size, and state utilities with CVA.
- Resolve classes in this order: built-in recipe, global component config, local `ui`, native `class`.
- Merge conflicts with Tailwind Merge so the later source wins.
- Keep internal class names and DOM structure out of the public API.
- Prefer Tailwind modifiers for hover, focus, disabled, dark, and reduced-motion states.
- Do not introduce a custom token resolver, theme provider, or cascade-layer architecture.
- Keep the package stylesheet limited to Tailwind build directives.

## Components

- Prefer native elements before recreating semantics with ARIA.
- Use Reka UI when it removes meaningful accessibility and interaction maintenance.
- Separate state logic from presentation when it improves understanding or testability; do not split
  files only to follow a pattern.
- Document every public prop, event, slot, and supported customization point.
- Include loading, disabled, error, empty, and overflow states where relevant.
- Add a dependency only when it saves enough maintenance to justify its cost.

## Before merging a component

A component is expected to pass:

- formatting and linting;
- strict TypeScript checks;
- unit and component tests;
- accessibility tests;
- production package and documentation builds;
- bundle-size reporting;
- public API and package-export validation.
