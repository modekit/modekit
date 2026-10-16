import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

const repositoryRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const changesetCommand = join(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'changeset.CMD' : 'changeset',
)

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function createFixture() {
  const directory = mkdtempSync(join(tmpdir(), 'modekit-changesets-'))
  mkdirSync(join(directory, '.changeset'))
  mkdirSync(join(directory, 'packages/docs'), { recursive: true })
  mkdirSync(join(directory, 'packages/vue'), { recursive: true })

  writeJson(join(directory, 'package.json'), {
    name: 'modekit',
    version: '0.0.0',
    private: true,
    packageManager: readJson(join(repositoryRoot, 'package.json')).packageManager,
  })
  copyFileSync(join(repositoryRoot, 'pnpm-workspace.yaml'), join(directory, 'pnpm-workspace.yaml'))
  copyFileSync(
    join(repositoryRoot, '.changeset/config.json'),
    join(directory, '.changeset/config.json'),
  )
  writeJson(join(directory, 'packages/docs/package.json'), {
    name: '@modekit/docs',
    version: '0.0.0',
    private: true,
  })
  writeJson(join(directory, 'packages/vue/package.json'), {
    name: '@modekit/vue',
    version: '0.0.0',
    private: true,
  })
  writeFileSync(
    join(directory, '.changeset/test-release.md'),
    `---\n"@modekit/vue": minor\n---\n\nAdd a disposable release feature and document issue #123.\n`,
  )

  return directory
}

function run(args, cwd) {
  execFileSync(changesetCommand, args, {
    cwd,
    env: {
      ...process.env,
      GITHUB_REPOSITORY: 'modekit/modekit',
    },
    stdio: 'inherit',
  })
}

function verifyVersionFlow() {
  const directory = createFixture()

  try {
    run(['version'], directory)

    assert.equal(readJson(join(directory, 'package.json')).version, '0.0.0')
    assert.equal(readJson(join(directory, 'packages/docs/package.json')).version, '0.0.0')
    assert.equal(readJson(join(directory, 'packages/vue/package.json')).version, '0.1.0')

    const changelog = readFileSync(join(directory, 'packages/vue/CHANGELOG.md'), 'utf8')
    assert.match(changelog, /^# @modekit\/vue/m)
    assert.match(changelog, /^## 0\.1\.0$/m)
    assert.match(changelog, /Add a disposable release feature/)
    assert.match(changelog, /https:\/\/github\.com\/modekit\/modekit\/issues\/123/)
  } finally {
    rmSync(directory, { force: true, recursive: true })
  }
}

function verifyPrereleaseFlow() {
  const directory = createFixture()

  try {
    run(['pre', 'enter', 'alpha'], directory)
    run(['version'], directory)

    assert.equal(readJson(join(directory, 'packages/vue/package.json')).version, '0.1.0-alpha.0')
    assert.equal(readJson(join(directory, 'package.json')).version, '0.0.0')
    assert.equal(readJson(join(directory, 'packages/docs/package.json')).version, '0.0.0')

    const prereleaseState = readJson(join(directory, '.changeset/pre.json'))
    assert.equal(prereleaseState.mode, 'pre')
    assert.equal(prereleaseState.tag, 'alpha')
    assert.match(
      readFileSync(join(directory, 'packages/vue/CHANGELOG.md'), 'utf8'),
      /^## 0\.1\.0-alpha\.0$/m,
    )
  } finally {
    rmSync(directory, { force: true, recursive: true })
  }
}

verifyVersionFlow()
verifyPrereleaseFlow()
process.stdout.write('Changesets version and prerelease generation passed in disposable copies.\n')
