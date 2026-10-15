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

function runPnpm(args, cwd) {
  const command = process.platform === 'win32' ? 'corepack.cmd' : 'corepack'
  run(command, ['pnpm', ...args], cwd)
}

try {
  runPnpm(['pack', '--out', tarballPath], packageDirectory)
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
    `import { createSSRApp, h } from 'vue'\nimport { createModeKit, dropdownSizes, MkButton, MkDropdown, MkDropdownItem, MkFlex, MkGrid, MkSpacing, MkTooltip, MkTooltipProvider, spacingOrientations, tooltipSides } from '@modekit/vue'\nimport type { DropdownItem } from '@modekit/vue'\n\nconst dropdownItems = [\n  { type: 'label', label: 'Packed choices' },\n  { type: 'checkbox', label: 'Packed checkbox', checked: true },\n  { type: 'separator' },\n  { type: 'radio-group', value: 'compact', items: [{ label: 'Packed radio', value: 'compact' }] },\n  { type: 'submenu', label: 'Packed submenu', defaultOpen: true, items: [{ label: 'Packed nested action' }] },\n] satisfies readonly DropdownItem[]\n\nconst app = createSSRApp({\n  render: () => h(MkGrid, { columns: 2, gap: 'm' }, () => [\n    h(MkFlex, { direction: 'column', wrap: 'wrap', justify: 'space-between', gap: ['s', 12], flex: [2, 1, 'xl'] }, () => [\n      h(MkButton, { type: 'submit' }, () => 'Save'),\n      h(MkSpacing, { orientation: 'horizontal', size: 'full' }),\n      h(MkSpacing, { grow: true }),\n    ]),\n    h(MkDropdown, { defaultOpen: true, portal: false, items: dropdownItems }, {\n      default: () => h(MkButton, () => 'Open actions'),\n    }),\n  ]),\n})\napp.use(createModeKit({ theme: { primary: 'green', neutral: 'slate' }, ui: { button: { defaultVariants: { size: 'sm' } } } }))\nvoid spacingOrientations\nvoid tooltipSides\nvoid MkTooltip\nvoid MkTooltipProvider\nvoid dropdownSizes\nvoid MkDropdown\nvoid MkDropdownItem\n`,
  )
  writeFileSync(
    join(consumerDirectory, 'verify.mjs'),
    `import assert from 'node:assert/strict'\nimport { readFile } from 'node:fs/promises'\nimport { createSSRApp, h } from 'vue'\nimport { renderToString } from 'vue/server-renderer'\nimport { createModeKit, dropdownSizes, MkButton, MkDropdown, MkDropdownItem, MkFlex, MkGrid, MkSpacing, MkTooltip, MkTooltipProvider, spacingOrientations, tooltipSides } from '@modekit/vue'\n\nconst dropdownItems = [\n  { type: 'label', label: 'Packed choices' },\n  { type: 'checkbox', label: 'Packed checkbox', checked: true },\n  { type: 'separator' },\n  { type: 'radio-group', value: 'compact', items: [{ label: 'Packed radio', value: 'compact' }] },\n  { type: 'submenu', label: 'Packed submenu', defaultOpen: true, items: [{ label: 'Packed nested action' }] },\n]\n\nconst app = createSSRApp({\n  render: () => h(MkGrid, { columns: 2, gap: 'm' }, () => [\n    h(MkFlex, { direction: 'column', wrap: 'wrap', justify: 'space-between', gap: ['s', 12], flex: [2, 1, 'xl'] }, () => [\n      h(MkButton, { type: 'submit' }, () => 'Save'),\n      h(MkSpacing, { orientation: 'horizontal', size: 'full' }),\n      h(MkSpacing, { grow: true }),\n    ]),\n    h(MkDropdown, { defaultOpen: true, portal: false, items: dropdownItems }, {\n      default: () => h(MkButton, () => 'Open actions'),\n    }),\n  ]),\n})\napp.use(createModeKit({ theme: { primary: 'green', neutral: 'slate' }, ui: { button: { defaultVariants: { size: 'sm' } } } }))\nconst html = await renderToString(app)\nassert.deepEqual(spacingOrientations, ['vertical', 'horizontal'])\nassert.deepEqual(tooltipSides, ['top', 'right', 'bottom', 'left'])\nassert.deepEqual(dropdownSizes, ['sm', 'md', 'lg'])\nassert.equal(typeof MkDropdown, 'object')\nassert.equal(typeof MkDropdownItem, 'object')\nassert.equal(typeof MkTooltip, 'object')\nassert.equal(typeof MkTooltipProvider, 'object')\nassert.match(html, /<div/)\nassert.match(html, /mk-grid/)\nassert.match(html, /data-mk-columns="2"/)\nassert.match(html, /mk-flex/)\nassert.match(html, /data-mk-direction="column"/)\nassert.match(html, /data-mk-justify="space-between"/)\nassert.match(html, /data-mk-wrap="wrap"/)\nassert.match(html, /flex:2 1 1.5rem/)\nassert.match(html, /row-gap:0.5rem/)\nassert.match(html, /column-gap:12px/)\nassert.match(html, /<button/)\nassert.match(html, /type="submit"/)\nassert.match(html, /data-mk-size="sm"/)\nassert.match(html, /mk-spacing/)\nassert.match(html, /data-mk-orientation="horizontal"/)\nassert.match(html, /data-mk-size="full"/)\nassert.match(html, /data-mk-grow="true"/)\nassert.match(html, /Save/)\nassert.match(html, /mk-dropdown/)\nassert.match(html, /Packed choices/)\nassert.match(html, /Packed checkbox/)\nassert.match(html, /Packed radio/)\nassert.match(html, /Packed submenu/)\nassert.match(html, /Packed nested action/)\nassert.match(html, /<\\/div>$/)\n\nconst cssUrl = import.meta.resolve('@modekit/vue/styles.css')\nconst css = await readFile(new URL(cssUrl), 'utf8')\nassert.match(css, /\\.mk-button/)\nassert.match(css, /@keyframes mk-tooltip-open/)\nassert.match(css, /\\.mk\\\\:flex/)\nassert.match(css, /\\.mk\\\\:grid/)\nassert.match(css, /data-mk-primary/)\nassert.match(css, /data-mk-neutral/)\nassert.match(css, /:where\\(\\.mk-headline,\\.mk-text,\\.mk-paragraph,\\.mk-caption\\)\\{margin:0\\}/)\nassert.doesNotMatch(css, /box-sizing:border-box;border:0 solid;margin:0;padding:0/)\n\nconst preflightUrl = import.meta.resolve('@modekit/vue/preflight.css')\nconst preflight = await readFile(new URL(preflightUrl), 'utf8')\nassert.match(preflight, /box-sizing:border-box;border:0 solid;margin:0;padding:0/)\nassert.match(preflight, /h1,h2,h3,h4,h5,h6\\{font-size:inherit;font-weight:inherit\\}/)\n`,
  )

  runPnpm(['install', '--ignore-scripts', '--prefer-offline'], consumerDirectory)
  runPnpm(['exec', 'tsc'], consumerDirectory)
  run('node', ['verify.mjs'], consumerDirectory)

  const packedManifest = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules/@modekit/vue/package.json'), 'utf8'),
  )
  assert.equal(packedManifest.exports['.'].types, './dist/index.d.ts')
  assert.equal(packedManifest.exports['./styles.css'].default, './dist/styles.css')
  assert.equal(packedManifest.exports['./preflight.css'].default, './dist/preflight.css')
  process.stdout.write('Packed @modekit/vue consumer validation passed.\n')
} finally {
  rmSync(temporaryDirectory, { force: true, recursive: true })
}
