# Repository and release settings

These settings cannot be enforced by repository files alone. Verify them in GitHub and npm before
activating publication; do not mark them enabled from workflow presence alone.

## GitHub Actions

- Create a repository-installed GitHub App for release pull requests with only **Contents:
  read/write** and **Pull requests: read/write**. Store its App ID as the `RELEASE_APP_ID` repository
  variable and its private key as the `RELEASE_APP_PRIVATE_KEY` Actions secret. The resulting token
  is short-lived and ensures CI runs on the pull request the app creates.
- Keep the default workflow token read-only. The release-PR workflow uses the narrowly scoped app
  token; the protected publish job alone receives `id-token: write`.
- GitHub Pages is enabled through Actions with `modekit.dev` as the custom domain. Point the domain's
  DNS records to GitHub Pages and enable HTTPS before the first documentation deployment.

## Protected `main`

The `main` branch protection rule currently:

- requires pull requests; add one required maintainer approval after a second trusted maintainer is
  available so the solo maintainer is not locked out of ordinary pull requests;
- requires resolved conversations;
- requires the two `Verify` matrix checks and `Browser verification (Chromium)`;
- requires branches to be current before merging;
- disables force pushes and branch deletion;
- allows squash merges with Conventional Commit-style pull-request titles; and
- automatically deletes merged topic branches.

Confirm the exact required-check names in a successful pull request before saving the rule. Release
pull requests follow the same review and CI path as feature pull requests.

## `npm-production` environment

The GitHub environment named exactly `npm-production` currently:

- restrict deployment to protected `main`;
- require Mustaf Shllaku's approval;
- prevent administrators from bypassing protection when the account plan supports it; and
- do not add a long-lived npm token.

The environment requires Mustaf Shllaku's approval and deployments from protected branches. Keep
the approval rule active; `workflow_dispatch` is deliberate but is not a substitute for the
protected environment.

## npm ownership and trusted publisher

Before the first publication, verify that Mustaf Shllaku controls the `modekit` npm scope and has
permission to create the public `@modekit/vue` package. Trusted-publisher setup must use:

- provider: GitHub Actions;
- organization: `modekit`;
- repository: `modekit`;
- workflow filename: `publish.yml`;
- environment: `npm-production`; and
- direct `npm publish` permission. Enable dist-tag permission only if later workflows need to move
  an existing tag.

npm trusted publishing requires an existing package settings page. At activation time, verify npm's
current first-package path. If `@modekit/vue` cannot receive a trusted publisher before it exists,
the owner must explicitly approve a one-time 2FA-protected or staged bootstrap publication; never
place that bootstrap credential in GitHub Actions. Configure and exercise the trusted publisher
immediately afterward. A newly created trusted-publisher configuration expires unless its first
successful publish occurs within npm's stated activation window.

The publish workflow pins npm `11.21.1`, runs on Node 24, and uses GitHub-hosted runners. npm creates
provenance automatically only when trusted publishing comes from a public repository for a public
package. Verify the provenance record on npm after publication rather than assuming it exists.

## Release operation

1. Merge ordinary changes through reviewed pull requests with changesets.
2. Review and merge the generated release pull request.
3. Copy the resulting full `main` commit SHA.
4. Manually run **Publish approved release** for that SHA and the reviewed npm tag.
5. Approve the `npm-production` environment only after the prepare job proves the version, tag,
   registry state, tests, browser behavior, tarball, and documentation build.
6. Verify npm, the matching GitHub release/tag, provenance, and `modekit.dev` after completion.

The workflow refuses a commit that is not the current `origin/main`, an already published version
or Git tag, pending unversioned changesets, mismatched prerelease/tag state, a private package, or a
dirty checkout. It uploads one checksummed tarball from the verified build and publishes that exact
artifact after approval. No nightly or canary publisher is configured.
