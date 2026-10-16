# Releasing ModeKit

ModeKit is currently experimental and unpublished. Releases are maintainer-owned operations; a
passing build alone is not publication approval.

## Version policy

ModeKit follows semantic versioning. During `0.x`, breaking public API changes require a minor
version and must be documented; patch releases remain backward-compatible bug fixes. After `1.0`,
breaking changes require a major version.

Prerelease maturity is:

1. `alpha` for incomplete APIs and early integration feedback;
2. `beta` for feature-complete releases still receiving compatibility feedback;
3. `rc` for release candidates with no planned API changes; and
4. the default `latest` npm channel only after explicit stable-release approval.

Each release line selects one prerelease identifier when entering Changesets prerelease mode and
keeps it for that line. The initial line uses `alpha`; a later line may begin as `beta` or `rc` when
its maturity warrants it. Do not try to rename an active prerelease line from `alpha` to `beta` or
`rc`. Exit that line to its ordinary release first. `next` is reserved for a deliberately chosen
general preview channel, not mixed with the maturity-specific channels.

The version suffix and npm distribution tag are separate registry controls. Always publish a
prerelease with an explicit matching `--tag`, even though Changesets also records the prerelease tag.
Do not publish an experimental prerelease under `latest`.

## Changesets commands

The root scripts have deliberately separate responsibilities:

| Command                | Effect                                                               |
| ---------------------- | -------------------------------------------------------------------- |
| `pnpm changeset`       | Create a release intent and user-facing changelog entry              |
| `pnpm release:status`  | Preview pending package bumps                                        |
| `pnpm release:version` | Consume changesets and update package versions and generated logs    |
| `pnpm release:publish` | Publish unpublished versions to npm and create tags; approval needed |

The presence of `release:publish` is not authorization to run it. Publication changes npm and local
Git tag state and requires explicit maintainer approval for the exact reviewed release commit and
distribution tag.

## Release pull request

Changesets is the source of truth for version and changelog updates:

1. consumer-visible pull requests add a changeset;
2. the release pull request applies versions and generated changelogs;
3. reviewers verify version impact, release notes, package contents, CI, and documentation; and
4. a maintainer explicitly approves publication after the release pull request is merged.

The configured GitHub changelog formatter requires `GITHUB_TOKEN` when resolving commit, pull
request, and author links. Release automation must provide that token through GitHub Actions secrets;
never store it in the repository or a changeset.

Before the version step, correct release-note content in its source changeset. After
`pnpm release:version`, review the generated package version and changelog rather than assuming the
selected bump or pull-request label was correct.

## Prerelease flow

The first prerelease starts from `@modekit/vue@0.0.0` with a reviewed `minor` changeset:

```sh
pnpm changeset pre enter alpha
pnpm release:version
```

This produces `0.1.0-alpha.0`. Commit the resulting `.changeset` state, package version, and
generated changelog in a release pull request. After every verification gate passes and a
maintainer explicitly authorizes publication, publish with the matching registry channel:

```sh
pnpm release:publish -- --tag alpha
pnpm view @modekit/vue@0.1.0-alpha.0 version
pnpm view @modekit/vue dist-tags --json
```

Additional reviewed changesets on the same prerelease line produce `0.1.0-alpha.1` and later alpha
versions. Use `--tag alpha` for every publication and verify that `latest` did not move.

To finish the line as the ordinary `0.1.0` release:

```sh
pnpm changeset pre exit
pnpm release:version
```

Review and commit the exit from prerelease mode through the same release pull-request process.
Only the reviewed ordinary release may be published without a prerelease `--tag`, which assigns the
normal `latest` channel. No release is required to pass through alpha, beta, and rc sequentially.

## Verification commands

Run from a clean checkout of the release commit:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm --filter @modekit/vue test:browser
pnpm --filter @modekit/vue pack --pack-destination /tmp/modekit-pack
```

Inspect the tarball before publishing. It must contain the built JavaScript, declarations,
`styles.css`, optional `preflight.css`, package README, approved license, and correct package
metadata. It must not contain source-only fixtures, credentials, or local readiness notes.

## First publication gate

Before the first npm publication:

- approve and add the project license and copyright holder;
- configure Changesets and generated changelogs;
- verify the npm organization/package ownership and maintainer access;
- remove `private: true` from `packages/vue/package.json` in a reviewed publication change;
- set the approved initial version and public scoped-package access;
- verify the private vulnerability-reporting route; and
- complete the automated and manual release-readiness checks.

The repository temporarily enables Changesets versioning for private packages while explicitly
excluding the private root workspace and documentation package. This allows `@modekit/vue`
changesets and changelogs to be prepared before publication. When the library's `private` flag is
removed in the reviewed first-release change, remove that temporary private-package accommodation
and confirm only `@modekit/vue` is in the release plan.

Publish the scoped package explicitly with public access and the approved prerelease tag only after
those approvals. For the first alpha:

```sh
pnpm release:publish -- --tag alpha
```

Verify the registry version, dist-tag, package provenance when configured, tarball contents, and a
fresh consumer installation before announcing the release. A version containing `alpha`, `beta`,
or `rc` does not by itself prevent npm from assigning `latest`; the explicit publish tag and the
post-publication `dist-tags` check are both required.

## Failed-release recovery

- If validation fails before publication, fix the release pull request and rerun every gate.
- Never overwrite an npm version that was already published. Fix forward with a new patch or
  prerelease version.
- If a dist-tag is wrong, move only the tag after verifying the intended published version.
- If a release is unsafe to use, deprecate that exact version with a concise migration message and
  publish a corrected version. Unpublish only when registry policy, security impact, and maintainer
  approval justify it.
- Do not rewrite published release tags or hide a failed release from the changelog.

## Deprecation policy

Mark deprecated APIs in types and documentation, provide a replacement and migration example, and
retain the old path for at least one planned minor release when practical. Security or correctness
issues may require faster removal, but the release notes must explain the exception.
