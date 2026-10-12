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
- Keep shared mutable state inside a provider or another clearly owned service.
- Make components work under nested providers where applicable.

## CSS

- Make components consume semantic or component tokens.
- Do not add application-specific selectors.
- Avoid unnecessary specificity and `!important`.
- Treat internal class names as implementation details, not public API.
- Try tokens before adding platform-specific markup. Use structural branches only when behavior or
  semantics genuinely differ.

## Components

- Prefer native elements before recreating semantics with ARIA.
- Separate state logic from presentation when it improves understanding or testability; do not split
  files only to follow a pattern.
- Document every public prop, event, slot, and CSS customization point.
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
