import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { consumerMatrix, consumerToolVersions } from '../tests/fixtures/package-consumer/matrix.mjs'

const repositoryRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const packageDirectory = join(repositoryRoot, 'packages/vue')
const fixtureDirectory = join(repositoryRoot, 'tests/fixtures/package-consumer')
const repositoryManifest = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8'))
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'modekit-consumer-'))
const tarballPath = join(temporaryDirectory, 'modekit-vue.tgz')

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' })
}

function runPnpm(args, cwd) {
  const command = process.platform === 'win32' ? 'corepack.cmd' : 'corepack'
  run(command, ['pnpm', ...args], cwd)
}

function measureAsset(directory, extension) {
  const matches = readdirSync(directory).filter((asset) => asset.endsWith(extension))
  assert.equal(matches.length, 1, `Expected one ${extension} asset in ${directory}`)
  const file = matches[0]
  const content = readFileSync(join(directory, file))

  return {
    file,
    gzipBytes: gzipSync(content, { level: 9 }).byteLength,
    rawBytes: content.byteLength,
  }
}

function verifyConsumer(versions) {
  const consumerDirectory = join(temporaryDirectory, `consumer-${versions.name}`)
  mkdirSync(consumerDirectory)

  writeFileSync(
    join(consumerDirectory, 'package.json'),
    `${JSON.stringify(
      {
        name: `modekit-package-consumer-${versions.name}`,
        private: true,
        type: 'module',
        packageManager: repositoryManifest.packageManager,
        dependencies: {
          '@modekit/vue': `file:${tarballPath}`,
          vue: versions.vue,
        },
        devDependencies: {
          jsdom: consumerToolVersions.jsdom,
          typescript: versions.typescript,
          vite: consumerToolVersions.vite,
        },
      },
      null,
      2,
    )}\n`,
  )
  writeFileSync(
    join(consumerDirectory, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          lib: ['ES2022', 'DOM'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          noEmit: true,
          skipLibCheck: true,
          strict: true,
          target: 'ES2022',
        },
        include: ['client.ts', 'consumer.ts', 'minimal.ts'],
      },
      null,
      2,
    )}\n`,
  )
  for (const fixture of [
    'client.ts',
    'consumer.ts',
    'hydrate.mjs',
    'index.html',
    'minimal.html',
    'minimal.ts',
    'verify.mjs',
    'vite.minimal.config.mjs',
  ]) {
    copyFileSync(join(fixtureDirectory, fixture), join(consumerDirectory, fixture))
  }

  runPnpm(
    ['install', '--ignore-scripts', '--prefer-offline', '--strict-peer-dependencies'],
    consumerDirectory,
  )
  runPnpm(['exec', 'tsc'], consumerDirectory)
  runPnpm(['exec', 'vite', 'build'], consumerDirectory)
  runPnpm(['exec', 'vite', 'build', '--config', 'vite.minimal.config.mjs'], consumerDirectory)
  run('node', ['verify.mjs'], consumerDirectory)
  run('node', ['hydrate.mjs'], consumerDirectory)

  const clientHtml = readFileSync(join(consumerDirectory, 'dist/index.html'), 'utf8')
  const clientAssets = readdirSync(join(consumerDirectory, 'dist/assets'))
  assert.match(clientHtml, /<script type="module" crossorigin src="\/assets\/[^"]+\.js"><\/script>/)
  assert.match(clientHtml, /<link rel="stylesheet" crossorigin href="\/assets\/[^"]+\.css">/)
  assert.ok(clientAssets.some((asset) => asset.endsWith('.js')))
  assert.ok(clientAssets.some((asset) => asset.endsWith('.css')))

  const minimalAssetsDirectory = join(consumerDirectory, 'dist-minimal/assets')
  const minimalJavaScript = measureAsset(minimalAssetsDirectory, '.js')
  const minimalCss = measureAsset(minimalAssetsDirectory, '.css')
  process.stdout.write(
    `Minimal build '${versions.name}': JS ${minimalJavaScript.rawBytes} B raw / ${minimalJavaScript.gzipBytes} B gzip; CSS ${minimalCss.rawBytes} B raw / ${minimalCss.gzipBytes} B gzip.\n`,
  )

  const packedManifest = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules/@modekit/vue/package.json'), 'utf8'),
  )
  const installedVueManifest = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules/vue/package.json'), 'utf8'),
  )
  const installedTypeScriptManifest = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules/typescript/package.json'), 'utf8'),
  )
  const installedViteManifest = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules/vite/package.json'), 'utf8'),
  )
  const installedJsdomManifest = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules/jsdom/package.json'), 'utf8'),
  )
  assert.equal(packedManifest.exports['.'].types, './dist/index.d.ts')
  assert.equal(packedManifest.exports['./styles.css'].default, './dist/styles.css')
  assert.equal(packedManifest.exports['./preflight.css'].default, './dist/preflight.css')
  assert.equal(installedVueManifest.version, versions.vue)
  assert.equal(installedTypeScriptManifest.version, versions.typescript)
  assert.equal(installedViteManifest.version, consumerToolVersions.vite)
  assert.equal(installedJsdomManifest.version, consumerToolVersions.jsdom)
  process.stdout.write(
    `Packed consumer '${versions.name}' passed with Vue ${versions.vue} and TypeScript ${versions.typescript}.\n`,
  )
}

try {
  runPnpm(['pack', '--out', tarballPath], packageDirectory)
  for (const versions of consumerMatrix) verifyConsumer(versions)
} finally {
  rmSync(temporaryDirectory, { force: true, recursive: true })
}
