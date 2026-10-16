# Releasing ModeKit

ModeKit is currently experimental and unpublished. Releases are maintainer-owned operations; a
passing build alone is not publication approval.

## Version policy

ModeKit follows semantic versioning. During `0.x`, breaking public API changes require a minor
version and must be documented; patch releases remain backward-compatible bug fixes. After `1.0`,
breaking changes require a major version.

Prerelease progression is:

1. `alpha` for incomplete APIs and early integration feedback;
2. `beta` for feature-complete releases still receiving compatibility feedback;
3. `rc` for release candidates with no planned API changes; and
4. the default `latest` npm channel only after explicit stable-release approval.

Publish prereleases under matching npm dist-tags (`alpha`, `beta`, or `next`). Do not publish an
experimental prerelease under `latest`.

## Release pull request

Changesets is the planned source of truth for version and changelog updates. Once configured:

1. consumer-visible pull requests add a changeset;
2. the release pull request applies versions and generated changelogs;
3. reviewers verify version impact, release notes, package contents, CI, and documentation; and
4. a maintainer explicitly approves publication after the release pull request is merged.

Do not hand-edit generated changelog entries after Changesets becomes active; correct their source
changeset instead.

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

Publish the scoped package explicitly with public access only after those approvals:

```sh
pnpm --filter @modekit/vue publish --access public
```

Verify the registry version, dist-tag, package provenance when configured, tarball contents, and a
fresh consumer installation before announcing the release.

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
