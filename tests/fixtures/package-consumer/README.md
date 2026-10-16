# Packed package consumer fixtures

These fixtures validate the tarball produced by pnpm pack from the perspective of an isolated
consumer. They deliberately import @modekit/vue from the installed tarball rather than from the
workspace.

- consumer.ts is compiled with tsc to verify public exports and declarations.
- client.ts and index.html are built with Vite to verify browser bundling and packaged CSS imports.
- minimal.ts, minimal.html, and vite.minimal.config.mjs produce a one-button production build for
  repeatable raw/gzip output measurements.
- verify.mjs exercises runtime exports, server rendering, generated HTML, stylesheet exports, and
  optional Preflight behavior.
- hydrate.mjs hydrates server-rendered markup and verifies content teleported outside the application
  root without hydration warnings.
- matrix.mjs pins the exact Vue and TypeScript versions used for minimum/current compatibility
  evidence.

The validator creates a temporary project for each matrix entry, installs only its declared
dependencies, asserts the resolved versions, and removes the projects afterward.

## Tested compatibility

| Profile | Vue    | TypeScript | Purpose                                                                                     |
| ------- | ------ | ---------- | ------------------------------------------------------------------------------------------- |
| Minimum | 3.5.0  | 5.0.4      | Advertised Vue floor and the first stable TypeScript release with Bundler module resolution |
| Current | 3.5.44 | 6.0.3      | Current Vue release and the TypeScript version used by this repository                      |

This is a tested compatibility boundary, not a claim that every intermediate dependency
combination is exercised on every change. Public compatibility documentation should mirror these
versions until the matrix changes.

## Minimal production-build baseline

The minimal fixture imports `MkButton` from the package root, imports the full published
`styles.css`, and mounts the button with Vue. Vite 8.3.2 performs a production build; the validator
records raw bytes and gzip level-9 bytes.

| Profile | JavaScript raw | JavaScript gzip | CSS raw  | CSS gzip |
| ------- | -------------- | --------------- | -------- | -------- |
| Minimum | 104,981 B      | 37,573 B        | 98,389 B | 13,871 B |
| Current | 103,440 B      | 36,918 B        | 98,389 B | 13,871 B |

The JavaScript values include the Vue runtime and everything retained from the `MkButton` root
import. The CSS values represent the complete ModeKit stylesheet, not button-only CSS. These values
are an initial observation, not budgets and not proof that all package exports tree-shake optimally.
