import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { URL } from 'node:url'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  createModeKit,
  dialogAnimations,
  dialogSizes,
  dropdownSizes,
  hoverCardSides,
  MkAlertDialog,
  MkButton,
  MkDialog,
  MkDropdown,
  MkDropdownItem,
  MkFlex,
  MkGrid,
  MkHoverCard,
  MkRadioGroup,
  MkSelect,
  MkSheet,
  MkSpacing,
  MkTextarea,
  MkToast,
  MkToastProvider,
  MkTooltip,
  MkTooltipProvider,
  selectSizes,
  selectVariants,
  sheetSides,
  sheetSizes,
  sheetVariants,
  spacingOrientations,
  textareaResizeModes,
  textareaSizes,
  textareaVariants,
  toastPositions,
  toastVariants,
  tooltipSides,
  useToast,
} from '@modekit/vue'

const dropdownItems = [
  { type: 'label', label: 'Packed choices' },
  { type: 'checkbox', label: 'Packed checkbox', checked: true },
  { type: 'separator' },
  {
    type: 'radio-group',
    value: 'compact',
    items: [{ label: 'Packed radio', value: 'compact' }],
  },
  {
    type: 'submenu',
    label: 'Packed submenu',
    defaultOpen: true,
    items: [{ label: 'Packed nested action' }],
  },
]

const selectItems = [
  {
    type: 'group',
    label: 'Packed statuses',
    items: [
      { label: 'Packed selected option', value: 'selected' },
      { label: 'Packed disabled option', value: 'disabled', disabled: true },
    ],
  },
  { type: 'separator' },
  { label: 'Packed final option', value: 'final' },
]

const app = createSSRApp({
  render: () =>
    h(MkGrid, { columns: 2, gap: 'm' }, () => [
      h(
        MkFlex,
        {
          direction: 'column',
          wrap: 'wrap',
          justify: 'space-between',
          gap: ['s', 12],
          flex: [2, 1, 'xl'],
        },
        () => [
          h(MkButton, { type: 'submit' }, () => 'Save'),
          h(MkSpacing, { orientation: 'horizontal', size: 'full' }),
          h(MkSpacing, { grow: true }),
        ],
      ),
      h(
        MkDropdown,
        { defaultOpen: true, portal: false, items: dropdownItems },
        {
          default: () => h(MkButton, () => 'Open actions'),
        },
      ),
      h(MkSelect, {
        defaultOpen: true,
        defaultValue: 'selected',
        items: selectItems,
        portal: false,
        name: 'packed-status',
      }),
      h(MkTextarea, {
        rows: 4,
        maxlength: 240,
        resize: 'vertical',
        defaultValue: 'Packed textarea',
        name: 'packed-notes',
      }),
      h(
        MkHoverCard,
        { defaultOpen: true, portal: false },
        {
          default: () => h('a', { href: '#profile' }, 'Packed profile'),
          content: () => 'Packed hover card',
        },
      ),
      h(
        MkDialog,
        {
          defaultOpen: true,
          modal: false,
          portal: false,
          title: 'Packed dialog',
          description: 'Packed dialog description',
        },
        { content: () => 'Packed dialog content' },
      ),
      h(MkAlertDialog, {
        defaultOpen: true,
        portal: false,
        title: 'Packed alert dialog',
        description: 'Packed alert description',
      }),
      h(
        MkSheet,
        {
          defaultOpen: true,
          modal: false,
          portal: false,
          variant: 'inset',
          title: 'Packed sheet',
          description: 'Packed sheet description',
        },
        { content: () => 'Packed sheet content' },
      ),
    ]),
})

app.use(
  createModeKit({
    theme: { primary: 'green', neutral: 'slate' },
    ui: { button: { defaultVariants: { size: 'sm' } } },
  }),
)

const html = await renderToString(app)
assert.deepEqual(spacingOrientations, ['vertical', 'horizontal'])
assert.deepEqual(tooltipSides, ['top', 'right', 'bottom', 'left'])
assert.deepEqual(toastPositions, ['top-left', 'top-right', 'bottom-left', 'bottom-right'])
assert.deepEqual(toastVariants, ['solid', 'soft', 'outline'])
assert.deepEqual(dropdownSizes, ['sm', 'md', 'lg'])
assert.deepEqual(hoverCardSides, ['top', 'right', 'bottom', 'left'])
assert.deepEqual(dialogAnimations, ['scale', 'fade', 'slide-up', 'slide-down', 'none'])
assert.deepEqual(dialogSizes, ['sm', 'md', 'lg', 'xl'])
assert.deepEqual(sheetSides, ['top', 'right', 'bottom', 'left'])
assert.deepEqual(sheetSizes, ['sm', 'md', 'lg', 'xl'])
assert.deepEqual(sheetVariants, ['edge', 'inset'])
assert.deepEqual(selectSizes, ['sm', 'md', 'lg'])
assert.deepEqual(selectVariants, ['outline', 'soft', 'subtle', 'ghost', 'plain'])
assert.deepEqual(textareaResizeModes, ['none', 'vertical', 'horizontal', 'both'])
assert.deepEqual(textareaSizes, ['sm', 'md', 'lg'])
assert.deepEqual(textareaVariants, ['outline', 'soft', 'subtle', 'ghost', 'plain'])
assert.equal(typeof MkSelect, 'object')
assert.equal(typeof MkTextarea, 'object')
assert.equal(typeof MkRadioGroup, 'object')
assert.equal(typeof MkAlertDialog, 'object')
assert.equal(typeof MkDialog, 'object')
assert.equal(typeof MkSheet, 'object')
assert.equal(typeof MkHoverCard, 'object')
assert.equal(typeof MkDropdown, 'object')
assert.equal(typeof MkDropdownItem, 'object')
assert.equal(typeof MkToast, 'object')
assert.equal(typeof MkToastProvider, 'object')
assert.equal(typeof useToast, 'function')
assert.equal(typeof MkTooltip, 'object')
assert.equal(typeof MkTooltipProvider, 'object')
assert.match(html, /<div/)
assert.match(html, /mk-grid/)
assert.match(html, /data-mk-columns="2"/)
assert.match(html, /mk-flex/)
assert.match(html, /data-mk-direction="column"/)
assert.match(html, /data-mk-justify="space-between"/)
assert.match(html, /data-mk-wrap="wrap"/)
assert.match(html, /flex:2 1 1.5rem/)
assert.match(html, /row-gap:0.5rem/)
assert.match(html, /column-gap:12px/)
assert.match(html, /<button/)
assert.match(html, /type="submit"/)
assert.match(html, /data-mk-size="sm"/)
assert.match(html, /mk-spacing/)
assert.match(html, /data-mk-orientation="horizontal"/)
assert.match(html, /data-mk-size="full"/)
assert.match(html, /data-mk-grow="true"/)
assert.match(html, /Save/)
assert.match(html, /mk-dropdown/)
assert.match(html, /Packed choices/)
assert.match(html, /Packed checkbox/)
assert.match(html, /Packed radio/)
assert.match(html, /Packed submenu/)
assert.match(html, /Packed nested action/)
assert.match(html, /mk-select/)
assert.match(html, /mk-textarea/)
assert.match(html, /Packed textarea/)
assert.match(html, /name="packed-notes"/)
assert.match(html, /maxlength="240"/)
assert.match(html, /Packed selected option/)
assert.match(html, /Packed disabled option/)
assert.match(html, /Packed final option/)
assert.match(html, /mk-hover-card/)
assert.match(html, /Packed hover card/)
assert.match(html, /mk-dialog/)
assert.match(html, /Packed dialog content/)
assert.match(html, /mk-alert-dialog/)
assert.match(html, /Packed alert dialog/)
assert.match(html, /mk-sheet/)
assert.match(html, /data-mk-variant="inset"/)
assert.match(html, /Packed sheet content/)
assert.match(html, /<\/div>$/)

const cssUrl = import.meta.resolve('@modekit/vue/styles.css')
const css = await readFile(new URL(cssUrl), 'utf8')
assert.match(css, /\.mk-button/)
assert.match(css, /\.mk-textarea/)
assert.match(css, /--reka-select-trigger-width/)
assert.match(css, /@keyframes mk-tooltip-open/)
assert.match(css, /@keyframes mk-toast-open/)
assert.match(css, /@keyframes mk-toast-swipe-end/)
assert.match(css, /--reka-toast-swipe-move-x/)
assert.match(css, /@keyframes mk-dialog-scale-open/)
assert.match(css, /scale:\.88/)
assert.match(css, /@keyframes mk-dialog-slide-up-open/)
assert.match(css, /2\.5rem/)
assert.match(css, /@keyframes mk-dialog-overlay-open/)
assert.match(css, /@keyframes mk-sheet-right-open/)
assert.match(css, /--drawer-swipe-movement-x/)
assert.match(css, /\.mk\\:flex/)
assert.match(css, /\.mk\\:grid/)
assert.match(css, /data-mk-primary/)
assert.match(css, /data-mk-neutral/)
assert.match(css, /:where\(\.mk-headline,\.mk-text,\.mk-paragraph,\.mk-caption\)\{margin:0\}/)
assert.match(
  css,
  /:where\(\.mk-button,\.mk-callout__close,\.mk-checkbox__control,\.mk-dialog__close,\.mk-dropdown__filter,\.mk-input__control,\.mk-radio-group__control,\.mk-select,\.mk-sheet__close,\.mk-switch__control,\.mk-tabs__trigger,\.mk-textarea__control,\.mk-toast__action,\.mk-toast__close\)\{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit\}/,
)
assert.doesNotMatch(css, /box-sizing:border-box;border:0 solid;margin:0;padding:0/)

const preflightUrl = import.meta.resolve('@modekit/vue/preflight.css')
const preflight = await readFile(new URL(preflightUrl), 'utf8')
assert.match(preflight, /box-sizing:border-box;border:0 solid;margin:0;padding:0/)
assert.match(preflight, /h1,h2,h3,h4,h5,h6\{font-size:inherit;font-weight:inherit\}/)
