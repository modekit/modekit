import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

const defaultRepositoryRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const allowedNpmTags = new Set(['alpha', 'beta', 'rc', 'next', 'latest'])
const versionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([a-z][a-z0-9-]*)\.(0|[1-9]\d*))?$/

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function git(repositoryRoot, args) {
  return execFileSync('git', args, { cwd: repositoryRoot, encoding: 'utf8' }).trim()
}

export function extractChangelogEntry(changelog, version) {
  const heading = `## ${version}`
  const start = changelog.split('\n').findIndex((line) => line.trim() === heading)
  assert.notEqual(start, -1, `Missing ${heading} in packages/vue/CHANGELOG.md`)

  const lines = changelog.split('\n')
  let end = lines.length
  for (let index = start + 1; index < lines.length; index += 1) {
    if (lines[index].startsWith('## ')) {
      end = index
      break
    }
  }

  return `${lines.slice(start, end).join('\n').trim()}\n`
}

export function inspectReleaseCandidate({
  commit,
  npmTag,
  repositoryRoot = defaultRepositoryRoot,
  verifyGit = true,
  mainRef,
}) {
  assert.match(commit, /^[0-9a-f]{40}$/i, 'Release commit must be a full 40-character SHA')
  assert.ok(allowedNpmTags.has(npmTag), `Unsupported npm tag: ${npmTag}`)

  const manifestPath = join(repositoryRoot, 'packages/vue/package.json')
  const manifest = readJson(manifestPath)
  assert.equal(manifest.name, '@modekit/vue')
  assert.notEqual(manifest.private, true, '@modekit/vue must not be private in a release commit')
  assert.equal(
    manifest.repository?.url,
    'git+https://github.com/modekit/modekit.git',
    'The npm trusted publisher requires the verified GitHub repository URL',
  )

  const versionMatch = versionPattern.exec(manifest.version)
  assert.ok(versionMatch, `Unsupported release version: ${manifest.version}`)
  assert.notEqual(manifest.version, '0.0.0', 'The placeholder 0.0.0 version cannot be published')

  const prereleaseTag = versionMatch[4]
  const preStatePath = join(repositoryRoot, '.changeset/pre.json')
  if (prereleaseTag) {
    assert.equal(npmTag, prereleaseTag, 'The npm tag must match the version prerelease identifier')
    assert.notEqual(npmTag, 'latest', 'A prerelease must never publish on latest')
    assert.ok(existsSync(preStatePath), 'Changesets prerelease state is missing')
    const preState = readJson(preStatePath)
    assert.equal(preState.mode, 'pre', 'Changesets must still be in prerelease mode')
    assert.equal(preState.tag, prereleaseTag, 'Changesets and package prerelease tags differ')
  } else {
    assert.equal(npmTag, 'latest', 'An ordinary release must use the latest npm tag')
    assert.ok(!existsSync(preStatePath), 'Ordinary releases must exit Changesets prerelease mode')
  }

  const pendingChangesets = readdirSync(join(repositoryRoot, '.changeset')).filter(
    (file) => file.endsWith('.md') && file !== 'README.md',
  )
  assert.deepEqual(pendingChangesets, [], 'Release commit still contains unversioned changesets')

  const changelog = readFileSync(join(repositoryRoot, 'packages/vue/CHANGELOG.md'), 'utf8')
  const releaseNotes = extractChangelogEntry(changelog, manifest.version)

  if (verifyGit) {
    assert.equal(git(repositoryRoot, ['rev-parse', 'HEAD']), commit, 'Checked-out commit differs')
    assert.equal(
      git(repositoryRoot, ['status', '--porcelain']),
      '',
      'Release checkout is not clean',
    )
    if (mainRef) {
      assert.equal(
        git(repositoryRoot, ['rev-parse', mainRef]),
        commit,
        `Release commit is not the current ${mainRef}`,
      )
    }
  }

  return {
    commit: commit.toLowerCase(),
    gitTag: `${manifest.name}@${manifest.version}`,
    npmTag,
    packageName: manifest.name,
    releaseNotes,
    version: manifest.version,
  }
}

function parseArguments(arguments_) {
  const values = new Map()
  for (let index = 0; index < arguments_.length; index += 2) {
    const key = arguments_[index]
    const value = arguments_[index + 1]
    assert.ok(key?.startsWith('--') && value, `Invalid argument near ${key ?? 'end of input'}`)
    values.set(key.slice(2), value)
  }
  return values
}

function writeOutput(metadata, outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true })
  const notesPath = join(outputDirectory, 'release-notes.md')
  const metadataPath = join(outputDirectory, 'metadata.json')
  writeFileSync(notesPath, metadata.releaseNotes)
  writeFileSync(
    metadataPath,
    `${JSON.stringify({ ...metadata, releaseNotes: undefined }, null, 2)}\n`,
  )

  const githubOutput = process.env.GITHUB_OUTPUT
  if (githubOutput) {
    const outputs = [
      `git-tag=${metadata.gitTag}`,
      `metadata-path=${metadataPath}`,
      `notes-path=${notesPath}`,
      `npm-tag=${metadata.npmTag}`,
      `package-name=${metadata.packageName}`,
      `version=${metadata.version}`,
    ]
    writeFileSync(githubOutput, `${outputs.join('\n')}\n`, { flag: 'a' })
  }

  process.stdout.write(
    `Validated ${metadata.packageName}@${metadata.version} at ${metadata.commit} for npm tag ${metadata.npmTag}.\n`,
  )
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arguments_ = parseArguments(process.argv.slice(2))
  const metadata = inspectReleaseCandidate({
    commit: arguments_.get('commit'),
    mainRef: arguments_.get('main-ref'),
    npmTag: arguments_.get('npm-tag'),
    repositoryRoot: arguments_.get('repository-root') ?? defaultRepositoryRoot,
  })
  const outputDirectory = arguments_.get('output-directory')
  assert.ok(outputDirectory, '--output-directory is required')
  writeOutput(metadata, outputDirectory)
}
