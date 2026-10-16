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
    `import { createSSRApp, h } from 'vue'\nimport { createModeKit, dialogAnimations, dialogSizes, dropdownSizes, hoverCardSides, MkAlertDialog, MkButton, MkDialog, MkDropdown, MkDropdownItem, MkFlex, MkGrid, MkHoverCard, MkRadioGroup, MkSelect, MkSheet, MkSpacing, MkTextarea, MkToast, MkToastProvider, MkTooltip, MkTooltipProvider, selectSizes, selectVariants, sheetSides, sheetSizes, sheetVariants, spacingOrientations, textareaResizeModes, textareaSizes, textareaVariants, toastPositions, toastVariants, tooltipSides, useToast } from '@modekit/vue'\nimport type { DropdownItem, SelectItem } from '@modekit/vue'\n\nconst dropdownItems = [\n  { type: 'label', label: 'Packed choices' },\n  { type: 'checkbox', label: 'Packed checkbox', checked: true },\n  { type: 'separator' },\n  { type: 'radio-group', value: 'compact', items: [{ label: 'Packed radio', value: 'compact' }] },\n  { type: 'submenu', label: 'Packed submenu', defaultOpen: true, items: [{ label: 'Packed nested action' }] },\n] satisfies readonly DropdownItem[]\n\nconst selectItems = [\n  { type: 'group', label: 'Packed statuses', items: [{ label: 'Packed selected option', value: 'selected' }, { label: 'Packed disabled option', value: 'disabled', disabled: true }] },\n  { type: 'separator' },\n  { label: 'Packed final option', value: 'final' },\n] satisfies readonly SelectItem[]\n\nconst app = createSSRApp({\n  render: () => h(MkGrid, { columns: 2, gap: 'm' }, () => [\n    h(MkFlex, { direction: 'column', wrap: 'wrap', justify: 'space-between', gap: ['s', 12], flex: [2, 1, 'xl'] }, () => [\n      h(MkButton, { type: 'submit' }, () => 'Save'),\n      h(MkSpacing, { orientation: 'horizontal', size: 'full' }),\n      h(MkSpacing, { grow: true }),\n    ]),\n    h(MkDropdown, { defaultOpen: true, portal: false, items: dropdownItems }, {\n      default: () => h(MkButton, () => 'Open actions'),\n    }),\n    h(MkSelect, { defaultOpen: true, defaultValue: 'selected', items: selectItems, portal: false, name: 'packed-status' }),\n    h(MkTextarea, { rows: 4, maxlength: 240, resize: 'vertical', defaultValue: 'Packed textarea', name: 'packed-notes' }),\n    h(MkHoverCard, { defaultOpen: true, portal: false }, {\n      default: () => h('a', { href: '#profile' }, 'Packed profile'),\n      content: () => 'Packed hover card',\n    }),\n    h(MkDialog, { defaultOpen: true, modal: false, portal: false, title: 'Packed dialog', description: 'Packed dialog description' }, {\n      content: () => 'Packed dialog content',\n    }),\n    h(MkAlertDialog, { defaultOpen: true, portal: false, title: 'Packed alert dialog', description: 'Packed alert description' }),\n    h(MkSheet, { defaultOpen: true, modal: false, portal: false, variant: 'inset', title: 'Packed sheet', description: 'Packed sheet description' }, {\n      content: () => 'Packed sheet content',\n    }),\n  ]),\n})\napp.use(createModeKit({ theme: { primary: 'green', neutral: 'slate' }, ui: { button: { defaultVariants: { size: 'sm' } } } }))\nvoid spacingOrientations\nvoid tooltipSides\nvoid toastPositions\nvoid toastVariants\nvoid useToast\nvoid MkToast\nvoid MkToastProvider\nvoid MkTooltip\nvoid MkTooltipProvider\nvoid dropdownSizes\nvoid hoverCardSides\nvoid dialogAnimations\nvoid dialogSizes\nvoid sheetSides\nvoid sheetSizes\nvoid sheetVariants\nvoid selectSizes\nvoid selectVariants\nvoid textareaResizeModes\nvoid textareaSizes\nvoid textareaVariants\nvoid MkTextarea\nvoid MkSelect\nvoid MkAlertDialog\nvoid MkDialog\nvoid MkSheet\nvoid MkHoverCard\nvoid MkRadioGroup\nvoid MkDropdown\nvoid MkDropdownItem\n`,
  )
  writeFileSync(
    join(consumerDirectory, 'verify.mjs'),
    `import assert from 'node:assert/strict'\nimport { readFile } from 'node:fs/promises'\nimport { createSSRApp, h } from 'vue'\nimport { renderToString } from 'vue/server-renderer'\nimport { createModeKit, dialogAnimations, dialogSizes, dropdownSizes, hoverCardSides, MkAlertDialog, MkButton, MkDialog, MkDropdown, MkDropdownItem, MkFlex, MkGrid, MkHoverCard, MkRadioGroup, MkSelect, MkSheet, MkSpacing, MkTextarea, MkToast, MkToastProvider, MkTooltip, MkTooltipProvider, selectSizes, selectVariants, sheetSides, sheetSizes, sheetVariants, spacingOrientations, textareaResizeModes, textareaSizes, textareaVariants, toastPositions, toastVariants, tooltipSides, useToast } from '@modekit/vue'\n\nconst dropdownItems = [\n  { type: 'label', label: 'Packed choices' },\n  { type: 'checkbox', label: 'Packed checkbox', checked: true },\n  { type: 'separator' },\n  { type: 'radio-group', value: 'compact', items: [{ label: 'Packed radio', value: 'compact' }] },\n  { type: 'submenu', label: 'Packed submenu', defaultOpen: true, items: [{ label: 'Packed nested action' }] },\n]\n\nconst selectItems = [\n  { type: 'group', label: 'Packed statuses', items: [{ label: 'Packed selected option', value: 'selected' }, { label: 'Packed disabled option', value: 'disabled', disabled: true }] },\n  { type: 'separator' },\n  { label: 'Packed final option', value: 'final' },\n]\n\nconst app = createSSRApp({\n  render: () => h(MkGrid, { columns: 2, gap: 'm' }, () => [\n    h(MkFlex, { direction: 'column', wrap: 'wrap', justify: 'space-between', gap: ['s', 12], flex: [2, 1, 'xl'] }, () => [\n      h(MkButton, { type: 'submit' }, () => 'Save'),\n      h(MkSpacing, { orientation: 'horizontal', size: 'full' }),\n      h(MkSpacing, { grow: true }),\n    ]),\n    h(MkDropdown, { defaultOpen: true, portal: false, items: dropdownItems }, {\n      default: () => h(MkButton, () => 'Open actions'),\n    }),\n    h(MkSelect, { defaultOpen: true, defaultValue: 'selected', items: selectItems, portal: false, name: 'packed-status' }),\n    h(MkTextarea, { rows: 4, maxlength: 240, resize: 'vertical', defaultValue: 'Packed textarea', name: 'packed-notes' }),\n    h(MkHoverCard, { defaultOpen: true, portal: false }, {\n      default: () => h('a', { href: '#profile' }, 'Packed profile'),\n      content: () => 'Packed hover card',\n    }),\n    h(MkDialog, { defaultOpen: true, modal: false, portal: false, title: 'Packed dialog', description: 'Packed dialog description' }, {\n      content: () => 'Packed dialog content',\n    }),\n    h(MkAlertDialog, { defaultOpen: true, portal: false, title: 'Packed alert dialog', description: 'Packed alert description' }),\n    h(MkSheet, { defaultOpen: true, modal: false, portal: false, variant: 'inset', title: 'Packed sheet', description: 'Packed sheet description' }, {\n      content: () => 'Packed sheet content',\n    }),\n  ]),\n})\napp.use(createModeKit({ theme: { primary: 'green', neutral: 'slate' }, ui: { button: { defaultVariants: { size: 'sm' } } } }))\nconst html = await renderToString(app)\nassert.deepEqual(spacingOrientations, ['vertical', 'horizontal'])\nassert.deepEqual(tooltipSides, ['top', 'right', 'bottom', 'left'])\nassert.deepEqual(toastPositions, ['top-left', 'top-right', 'bottom-left', 'bottom-right'])\nassert.deepEqual(toastVariants, ['solid', 'soft', 'outline'])\nassert.deepEqual(dropdownSizes, ['sm', 'md', 'lg'])\nassert.deepEqual(hoverCardSides, ['top', 'right', 'bottom', 'left'])\nassert.deepEqual(dialogAnimations, ['scale', 'fade', 'slide-up', 'slide-down', 'none'])\nassert.deepEqual(dialogSizes, ['sm', 'md', 'lg', 'xl'])\nassert.deepEqual(sheetSides, ['top', 'right', 'bottom', 'left'])\nassert.deepEqual(sheetSizes, ['sm', 'md', 'lg', 'xl'])\nassert.deepEqual(sheetVariants, ['edge', 'inset'])\nassert.deepEqual(selectSizes, ['sm', 'md', 'lg'])\nassert.deepEqual(selectVariants, ['outline', 'soft', 'subtle', 'ghost', 'plain'])\nassert.deepEqual(textareaResizeModes, ['none', 'vertical', 'horizontal', 'both'])\nassert.deepEqual(textareaSizes, ['sm', 'md', 'lg'])\nassert.deepEqual(textareaVariants, ['outline', 'soft', 'subtle', 'ghost', 'plain'])\nassert.equal(typeof MkSelect, 'object')\nassert.equal(typeof MkTextarea, 'object')\nassert.equal(typeof MkRadioGroup, 'object')\nassert.equal(typeof MkAlertDialog, 'object')\nassert.equal(typeof MkDialog, 'object')\nassert.equal(typeof MkSheet, 'object')\nassert.equal(typeof MkHoverCard, 'object')\nassert.equal(typeof MkDropdown, 'object')\nassert.equal(typeof MkDropdownItem, 'object')\nassert.equal(typeof MkToast, 'object')\nassert.equal(typeof MkToastProvider, 'object')\nassert.equal(typeof useToast, 'function')\nassert.equal(typeof MkTooltip, 'object')\nassert.equal(typeof MkTooltipProvider, 'object')\nassert.match(html, /<div/)\nassert.match(html, /mk-grid/)\nassert.match(html, /data-mk-columns="2"/)\nassert.match(html, /mk-flex/)\nassert.match(html, /data-mk-direction="column"/)\nassert.match(html, /data-mk-justify="space-between"/)\nassert.match(html, /data-mk-wrap="wrap"/)\nassert.match(html, /flex:2 1 1.5rem/)\nassert.match(html, /row-gap:0.5rem/)\nassert.match(html, /column-gap:12px/)\nassert.match(html, /<button/)\nassert.match(html, /type="submit"/)\nassert.match(html, /data-mk-size="sm"/)\nassert.match(html, /mk-spacing/)\nassert.match(html, /data-mk-orientation="horizontal"/)\nassert.match(html, /data-mk-size="full"/)\nassert.match(html, /data-mk-grow="true"/)\nassert.match(html, /Save/)\nassert.match(html, /mk-dropdown/)\nassert.match(html, /Packed choices/)\nassert.match(html, /Packed checkbox/)\nassert.match(html, /Packed radio/)\nassert.match(html, /Packed submenu/)\nassert.match(html, /Packed nested action/)\nassert.match(html, /mk-select/)\nassert.match(html, /mk-textarea/)\nassert.match(html, /Packed textarea/)\nassert.match(html, /name="packed-notes"/)\nassert.match(html, /maxlength="240"/)\nassert.match(html, /Packed selected option/)\nassert.match(html, /Packed disabled option/)\nassert.match(html, /Packed final option/)\nassert.match(html, /mk-hover-card/)\nassert.match(html, /Packed hover card/)\nassert.match(html, /mk-dialog/)\nassert.match(html, /Packed dialog content/)\nassert.match(html, /mk-alert-dialog/)\nassert.match(html, /Packed alert dialog/)\nassert.match(html, /mk-sheet/)\nassert.match(html, /data-mk-variant="inset"/)\nassert.match(html, /Packed sheet content/)\nassert.match(html, /<\\/div>$/)\n\nconst cssUrl = import.meta.resolve('@modekit/vue/styles.css')\nconst css = await readFile(new URL(cssUrl), 'utf8')\nassert.match(css, /\\.mk-button/)\nassert.match(css, /\\.mk-textarea/)\nassert.match(css, /--reka-select-trigger-width/)\nassert.match(css, /@keyframes mk-tooltip-open/)\nassert.match(css, /@keyframes mk-toast-open/)\nassert.match(css, /@keyframes mk-toast-swipe-end/)\nassert.match(css, /--reka-toast-swipe-move-x/)\nassert.match(css, /@keyframes mk-dialog-scale-open/)\nassert.match(css, /scale:\\.88/)\nassert.match(css, /@keyframes mk-dialog-slide-up-open/)\nassert.match(css, /2\\.5rem/)\nassert.match(css, /@keyframes mk-dialog-overlay-open/)\nassert.match(css, /@keyframes mk-sheet-right-open/)\nassert.match(css, /--drawer-swipe-movement-x/)\nassert.match(css, /\\.mk\\\\:flex/)\nassert.match(css, /\\.mk\\\\:grid/)\nassert.match(css, /data-mk-primary/)\nassert.match(css, /data-mk-neutral/)\nassert.match(css, /:where\\(\\.mk-headline,\\.mk-text,\\.mk-paragraph,\\.mk-caption\\)\\{margin:0\\}/)\nassert.match(\n  css,\n  /:where\\(\\.mk-button,\\.mk-callout__close,\\.mk-checkbox__control,\\.mk-dialog__close,\\.mk-dropdown__filter,\\.mk-input__control,\\.mk-radio-group__control,\\.mk-select,\\.mk-sheet__close,\\.mk-switch__control,\\.mk-tabs__trigger,\\.mk-textarea__control,\\.mk-toast__action,\\.mk-toast__close\\)\\{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit\\}/,\n)\nassert.doesNotMatch(css, /box-sizing:border-box;border:0 solid;margin:0;padding:0/)\n\nconst preflightUrl = import.meta.resolve('@modekit/vue/preflight.css')\nconst preflight = await readFile(new URL(preflightUrl), 'utf8')\nassert.match(preflight, /box-sizing:border-box;border:0 solid;margin:0;padding:0/)\nassert.match(preflight, /h1,h2,h3,h4,h5,h6\\{font-size:inherit;font-weight:inherit\\}/)\n`,
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
