import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

const repositoryRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const packageDirectory = join(repositoryRoot, 'packages/vue')
const repositoryManifest = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8'))
const sourceManifest = JSON.parse(readFileSync(join(packageDirectory, 'package.json'), 'utf8'))
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'modekit-consumer-'))
const consumerDirectory = join(temporaryDirectory, 'consumer')
const tarballPath = join(temporaryDirectory, 'modekit-vue.tgz')

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' })
}

try {
  run('pnpm', ['pack', '--out', tarballPath], packageDirectory)
  mkdirSync(consumerDirectory)

  writeFileSync(
    join(consumerDirectory, 'package.json'),
    `${JSON.stringify(
      {
        name: 'modekit-package-consumer',
        private: true,
        type: 'module',
        packageManager: repositoryManifest.packageManager,
        dependencies: {
          '@modekit/vue': `file:${tarballPath}`,
          vue: sourceManifest.devDependencies.vue,
        },
        devDependencies: {
          typescript: repositoryManifest.devDependencies.typescript,
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
        include: ['consumer.ts'],
      },
      null,
      2,
    )}\n`,
  )
  writeFileSync(
    join(consumerDirectory, 'consumer.ts'),
    `import { createSSRApp, h } from 'vue'\nimport { createModeKit, MkButton } from '@modekit/vue'\n\nconst app = createSSRApp({ render: () => h(MkButton, { type: 'submit' }, () => 'Save') })\napp.use(createModeKit({ theme: { primary: 'green', neutral: 'slate' }, ui: { button: { defaultVariants: { size: 'sm' } } } }))\n`,
  )
  writeFileSync(
    join(consumerDirectory, 'verify.mjs'),
    `import assert from 'node:assert/strict'\nimport { readFile } from 'node:fs/promises'\nimport { createSSRApp, h } from 'vue'\nimport { renderToString } from 'vue/server-renderer'\nimport { createModeKit, MkButton } from '@modekit/vue'\n\nconst app = createSSRApp({ render: () => h(MkButton, { type: 'submit' }, () => 'Save') })\napp.use(createModeKit({ theme: { primary: 'green', neutral: 'slate' }, ui: { button: { defaultVariants: { size: 'sm' } } } }))\nconst html = await renderToString(app)\nassert.match(html, /<button/)\nassert.match(html, /type="submit"/)\nassert.match(html, /data-mk-size="sm"/)\nassert.match(html, /Save/)\nassert.match(html, /<\\/button>$/)\n\nconst cssUrl = import.meta.resolve('@modekit/vue/styles.css')\nconst css = await readFile(new URL(cssUrl), 'utf8')\nassert.match(css, /\\.mk-button/)\nassert.match(css, /data-mk-primary/)\nassert.match(css, /data-mk-neutral/)\n`,
  )

  run('pnpm', ['install', '--ignore-scripts', '--offline'], consumerDirectory)
  run('pnpm', ['exec', 'tsc'], consumerDirectory)
  run('node', ['verify.mjs'], consumerDirectory)

  const packedManifest = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules/@modekit/vue/package.json'), 'utf8'),
  )
  assert.equal(packedManifest.exports['.'].types, './dist/index.d.ts')
  assert.equal(packedManifest.exports['./styles.css'].default, './dist/styles.css')
  process.stdout.write('Packed @modekit/vue consumer validation passed.\n')
} finally {
  rmSync(temporaryDirectory, { force: true, recursive: true })
}
