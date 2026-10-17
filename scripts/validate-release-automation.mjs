import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { parse } from 'yaml'
import { inspectReleaseCandidate } from './release-candidate.mjs'

const repositoryRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const releaseCandidateScript = join(repositoryRoot, 'scripts/release-candidate.mjs')

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function createCandidate({ privatePackage = false, version = '0.1.0-alpha.0' } = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'modekit-release-'))
  mkdirSync(join(directory, '.changeset'))
  mkdirSync(join(directory, 'packages/vue'), { recursive: true })
  writeFileSync(join(directory, '.changeset/README.md'), '# Changesets\n')
  writeJson(join(directory, 'packages/vue/package.json'), {
    name: '@modekit/vue',
    version,
    private: privatePackage,
    repository: {
      type: 'git',
      url: 'git+https://github.com/modekit/modekit.git',
      directory: 'packages/vue',
    },
  })
  writeFileSync(
    join(directory, 'packages/vue/CHANGELOG.md'),
    `# @modekit/vue\n\n## ${version}\n\n### Minor Changes\n\n- Add the first tested release.\n`,
  )
  if (version.includes('-')) {
    writeJson(join(directory, '.changeset/pre.json'), { mode: 'pre', tag: 'alpha' })
  }
  return directory
}

function testCandidateValidation() {
  const alphaDirectory = createCandidate()
  const stableDirectory = createCandidate({ version: '0.1.0' })
  const privateDirectory = createCandidate({ privatePackage: true })

  try {
    const alpha = inspectReleaseCandidate({
      commit: 'a'.repeat(40),
      npmTag: 'alpha',
      repositoryRoot: alphaDirectory,
      verifyGit: false,
    })
    assert.equal(alpha.gitTag, '@modekit/vue@0.1.0-alpha.0')
    assert.match(alpha.releaseNotes, /first tested release/)

    const stable = inspectReleaseCandidate({
      commit: 'b'.repeat(40),
      npmTag: 'latest',
      repositoryRoot: stableDirectory,
      verifyGit: false,
    })
    assert.equal(stable.version, '0.1.0')

    assert.throws(
      () =>
        inspectReleaseCandidate({
          commit: 'a'.repeat(40),
          npmTag: 'latest',
          repositoryRoot: alphaDirectory,
          verifyGit: false,
        }),
      /must match the version prerelease identifier/,
    )
    assert.throws(
      () =>
        inspectReleaseCandidate({
          commit: 'c'.repeat(40),
          npmTag: 'alpha',
          repositoryRoot: privateDirectory,
          verifyGit: false,
        }),
      /must not be private/,
    )
  } finally {
    rmSync(alphaDirectory, { force: true, recursive: true })
    rmSync(stableDirectory, { force: true, recursive: true })
    rmSync(privateDirectory, { force: true, recursive: true })
  }
}

function testCandidateCliInDisposableRepository() {
  const directory = createCandidate()
  const outputDirectory = join(directory, 'release-output')

  try {
    execFileSync('git', ['init', '--quiet'], { cwd: directory })
    execFileSync('git', ['config', 'user.name', 'ModeKit release test'], { cwd: directory })
    execFileSync('git', ['config', 'user.email', 'release-test@modekit.dev'], { cwd: directory })
    execFileSync('git', ['add', '.'], { cwd: directory })
    execFileSync('git', ['commit', '--quiet', '-m', 'test: release candidate'], { cwd: directory })
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: directory,
      encoding: 'utf8',
    }).trim()

    execFileSync(
      process.execPath,
      [
        releaseCandidateScript,
        '--commit',
        commit,
        '--main-ref',
        'HEAD',
        '--npm-tag',
        'alpha',
        '--output-directory',
        outputDirectory,
        '--repository-root',
        directory,
      ],
      { cwd: directory, stdio: 'inherit' },
    )

    const metadata = JSON.parse(readFileSync(join(outputDirectory, 'metadata.json'), 'utf8'))
    assert.equal(metadata.commit, commit)
    assert.equal(metadata.gitTag, '@modekit/vue@0.1.0-alpha.0')
    assert.match(readFileSync(join(outputDirectory, 'release-notes.md'), 'utf8'), /Minor Changes/)
  } finally {
    rmSync(directory, { force: true, recursive: true })
  }
}

function readWorkflow(name) {
  return parse(readFileSync(join(repositoryRoot, `.github/workflows/${name}`), 'utf8'))
}

function testWorkflowBoundaries() {
  const ci = readWorkflow('ci.yml')
  assert.equal(ci.permissions.contents, 'read')
  assert.ok(Object.hasOwn(ci.on, 'pull_request'))

  const releasePullRequest = readWorkflow('release-pr.yml')
  assert.deepEqual(releasePullRequest.permissions, {})
  assert.deepEqual(releasePullRequest.jobs.version.permissions, { contents: 'read' })
  assert.equal(releasePullRequest.jobs.version.permissions['id-token'], undefined)

  const publish = readWorkflow('publish.yml')
  assert.deepEqual(publish.permissions, {})
  assert.ok(Object.hasOwn(publish.on, 'workflow_dispatch'))
  assert.equal(publish.on.pull_request, undefined)
  assert.equal(publish.on.pull_request_target, undefined)
  assert.equal(publish.on.schedule, undefined)
  assert.equal(publish.concurrency['cancel-in-progress'], false)
  assert.equal(publish.jobs.prepare.permissions.contents, 'read')
  assert.match(publish.jobs.prepare.if, /github\.ref\s*==\s*'refs\/heads\/main'/)
  assert.equal(publish.jobs.publish.environment, 'npm-production')
  assert.equal(publish.jobs.publish.permissions['id-token'], 'write')
  assert.equal(publish.jobs.publish.permissions.contents, 'write')

  const docsRelease = readWorkflow('docs-release.yml')
  assert.deepEqual(docsRelease.permissions, {})
  assert.ok(Object.hasOwn(docsRelease.on, 'workflow_dispatch'))
  assert.equal(docsRelease.on.pull_request, undefined)
  assert.equal(docsRelease.on.pull_request_target, undefined)
  assert.equal(docsRelease.on.schedule, undefined)
  assert.equal(docsRelease.concurrency['cancel-in-progress'], false)
  assert.equal(docsRelease.jobs.build.permissions.contents, 'read')
  assert.match(docsRelease.jobs.build.if, /github\.ref\s*==\s*'refs\/heads\/main'/)
  assert.equal(docsRelease.jobs.deploy.environment.name, 'github-pages')
  assert.equal(docsRelease.jobs.deploy.permissions.pages, 'write')
  assert.equal(docsRelease.jobs.deploy.permissions['id-token'], 'write')

  const source = readFileSync(join(repositoryRoot, '.github/workflows/publish.yml'), 'utf8')
  assert.doesNotMatch(source, /NPM_TOKEN/)
  assert.match(source, /npm publish/)
  assert.match(source, /--tag "\$NPM_TAG"/)
  assert.match(source, /actions\/upload-artifact@/)
  assert.match(source, /actions\/download-artifact@/)
  assert.match(source, /visibility.*public/)
  assert.match(source, /npm audit signatures/)

  const docsReleaseSource = readFileSync(
    join(repositoryRoot, '.github/workflows/docs-release.yml'),
    'utf8',
  )
  assert.doesNotMatch(docsReleaseSource, /NPM_TOKEN/)
  assert.match(docsReleaseSource, /releases\/tags\/\$\{encodeURIComponent\(tag\)\}/)
  assert.match(docsReleaseSource, /actions\/upload-pages-artifact@/)
  assert.match(docsReleaseSource, /actions\/deploy-pages@/)

  const releasePullRequestSource = readFileSync(
    join(repositoryRoot, '.github/workflows/release-pr.yml'),
    'utf8',
  )
  assert.match(releasePullRequestSource, /actions\/create-github-app-token@/)
  assert.match(releasePullRequestSource, /changesets\/action\/select-mode@/)
  assert.match(releasePullRequestSource, /changesets\/action\/version@/)
}

testCandidateValidation()
testCandidateCliInDisposableRepository()
testWorkflowBoundaries()
process.stdout.write('Release metadata and workflow boundary validation passed.\n')
