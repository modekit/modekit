import { createSSRApp, h } from 'vue'
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
import type { DropdownItem, SelectItem } from '@modekit/vue'

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
] satisfies readonly DropdownItem[]

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
] satisfies readonly SelectItem[]

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

void spacingOrientations
void tooltipSides
void toastPositions
void toastVariants
void useToast
void MkToast
void MkToastProvider
void MkTooltip
void MkTooltipProvider
void dropdownSizes
void hoverCardSides
void dialogAnimations
void dialogSizes
void sheetSides
void sheetSizes
void sheetVariants
void selectSizes
void selectVariants
void textareaResizeModes
void textareaSizes
void textareaVariants
void MkTextarea
void MkSelect
void MkAlertDialog
void MkDialog
void MkSheet
void MkHoverCard
void MkRadioGroup
void MkDropdown
void MkDropdownItem
