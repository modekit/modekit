# ModeKit

ModeKit is an experimental Vue 3 component library focused on accessible behavior, typed APIs, and
adaptable class-based styling. It is under active development and is not yet a stable public
release.

## Requirements

- Vue `^3.5.0` for applications consuming `@modekit/vue`
- Node.js `>=22.22.2` and pnpm `11.14.0` for repository development
- TypeScript `>=5.0.4` when consuming the published declarations

See [Getting started](packages/docs/guide/getting-started.md) for installation and a runnable Vue
example. The [compatibility contract](packages/docs/guide/compatibility.md) records the tested
tooling, browser, SSR, hydration, and theming boundaries.

## Workspace

```text
packages/
  vue/   @modekit/vue components, styles, tests, and package build
  docs/  VitePress documentation and component examples
tests/
  fixtures/package-consumer/  isolated packed-package validation
```

## Development

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm docs:dev
```

`pnpm check` runs formatting, linting, typechecks, component tests, packed-tarball consumer builds,
SSR rendering, and hydration checks. Browser interaction and snapshot tests run with:

```sh
pnpm --filter @modekit/vue test:browser
```

## Project documentation

- [Contributing](CONTRIBUTING.md)
- [Release process](RELEASING.md)
- [Security policy](SECURITY.md)
- [Architecture](packages/docs/guide/architecture.md)
- [Accessibility evidence](packages/docs/guide/accessibility.md)
- [Public compatibility contract](packages/docs/guide/compatibility.md)

ModeKit is available under the [MIT License](LICENSE).
