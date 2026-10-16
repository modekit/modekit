# Contributing

ModeKit favors small, reviewable changes that update implementation, tests, and documentation
together.

## Setup

Requirements are Node.js `>=22.22.2` and pnpm `11.14.0`.

```sh
git clone git@github.com:modekit/modekit.git
cd modekit
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Use `pnpm docs:dev` for documentation work. UI and interaction changes should also run:

```sh
pnpm --filter @modekit/vue test:browser
```

## Pull requests

- Keep each pull request focused on one coherent change.
- Link the relevant issue when one exists and explain the user-visible outcome.
- Add or update tests for behavior, types, accessibility, SSR, hydration, and package consumption as
  applicable.
- Update component and guide documentation in the same pull request as public API changes.
- Include screenshots for visible UI changes in light and dark modes when relevant.
- Describe compatibility impact across props, events, slots, exported types, defaults, CSS
  variables, configuration keys, package imports, accessibility, and visible behavior.
- Avoid drive-by refactors that make the requested change harder to review.

Changesets are not configured yet. Until they are, state the intended release impact in the pull
request. After Changesets is configured, every consumer-visible change must include a changeset or
an explanation of why none is required.

## Review criteria

Reviewers evaluate correctness, maintainability, public compatibility, accessibility, visible
behavior, documentation, test evidence, and packed-package behavior. Generated classes and internal
DOM are not stable APIs, but changes to accessibility or rendered behavior still require review.

Before requesting review, run:

```sh
pnpm check
pnpm build
```

## Merge and branch cleanup

Pull requests are squash-merged after required review and CI approval. Do not merge, force-push,
delete remote branches, or publish packages without explicit maintainer authorization. After an
authorized merge is verified on the target branch, delete the merged topic branch locally and
remotely when it is no longer needed.
