import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const versionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/

export function validateRegistryTags({ npmTag, phase, tags, version }) {
  assert.ok(phase === 'before' || phase === 'after', `Unsupported validation phase: ${phase}`)
  assert.ok(
    tags && typeof tags === 'object' && !Array.isArray(tags),
    'npm dist-tags must be an object',
  )

  const versionMatch = versionPattern.exec(version)
  assert.ok(versionMatch, `Unsupported release version: ${version}`)
  const prerelease = Boolean(versionMatch[4])

  if (phase === 'after') {
    assert.equal(tags[npmTag], version, `npm tag ${npmTag} does not point to ${version}`)
  } else {
    assert.notEqual(tags[npmTag], version, `${version} is already assigned to npm tag ${npmTag}`)
  }

  const latest = tags.latest
  if (latest !== undefined) {
    const latestMatch = versionPattern.exec(latest)
    assert.ok(latestMatch, `Unsupported version on npm latest: ${latest}`)
    assert.equal(
      latestMatch[4],
      undefined,
      `npm latest must point to a stable version, not prerelease ${latest}`,
    )
  }

  if (prerelease) {
    assert.notEqual(npmTag, 'latest', 'A prerelease must never publish on latest')
  } else if (phase === 'after') {
    assert.equal(latest, version, `npm latest does not point to stable release ${version}`)
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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arguments_ = parseArguments(process.argv.slice(2))
  const tagsPath = arguments_.get('tags-file')
  assert.ok(tagsPath, '--tags-file is required')

  const tags = JSON.parse(readFileSync(tagsPath, 'utf8'))
  const phase = arguments_.get('phase')
  const version = arguments_.get('version')
  const npmTag = arguments_.get('npm-tag')

  validateRegistryTags({ npmTag, phase, tags, version })
  process.stdout.write(`Validated npm dist-tags ${phase} publishing ${version} on ${npmTag}.\n`)
}
