# Changesets

Changesets are the source of truth for ModeKit package versions and generated changelog entries.
The root workspace and documentation site are private and excluded; `@modekit/vue` is versioned
independently.

## When to add one

Add a changeset for every consumer-visible change, including changes to public APIs, defaults,
behavior, accessibility, styles, package imports, supported dependencies, or documented theme
variables:

```sh
pnpm changeset
```

Documentation-only work and internal refactors may omit a changeset, but the pull request must say
why they have no consumer-visible release impact. Review the selected bump directly; do not infer
the correct bump from labels alone.

During `0.x`, use:

- `patch` for backward-compatible fixes;
- `minor` for compatible feature batches and breaking changes, with migration notes; and
- no `major` bump until the project adopts its stable `1.x` contract.

After `1.0.0`, follow ordinary semantic versioning.

## Writing the summary

Write for package users, not repository maintainers. State changed behavior, important fixes,
migration steps, and known limitations when applicable. The summary becomes part of the generated
`packages/vue/CHANGELOG.md`; do not use an internal task title as release notes.

Changesets may include a pull request or commit reference on its own line when that information is
known:

```md
---
'@modekit/vue': minor
---

Add the new component API and describe how existing consumers should migrate.

PR: #123
```

See [RELEASING.md](../RELEASING.md) for the maintainer-owned version and publication process.
