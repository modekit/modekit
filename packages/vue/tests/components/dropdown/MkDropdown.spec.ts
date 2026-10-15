import { mount } from '@vue/test-utils'
import {
  DropdownMenuContent as DropdownContent,
  DropdownMenuSubContent as DropdownSubContent,
} from 'reka-ui'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'

import {
  createModeKit,
  dropdownAlignments,
  dropdownDirections,
  dropdownItemColors,
  dropdownPositionStrategies,
  dropdownSides,
  dropdownSizes,
  modeKitColors,
  MkDropdown,
  MkDropdownCheckboxItem,
  MkDropdownFilter,
  MkDropdownGroup,
  MkDropdownItem,
  MkDropdownLabel,
  MkDropdownRadioGroup,
  MkDropdownRadioItem,
  MkDropdownSeparator,
  MkDropdownSub,
  MkDropdownSubContent,
  MkDropdownSubTrigger,
} from '../../../src/index.js'
import type {
  DropdownCheckboxItemSlotProps,
  DropdownItem,
  DropdownItemSlotProps,
  DropdownProps,
} from '../../../src/index.js'

class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

afterEach(() => {
  document.body.replaceChildren()
})

function requiredItem<T>(items: readonly T[], index: number): T {
  const item = items[index]
  if (item === undefined) throw new Error(`Expected item at index ${String(index)}`)
  return item
}

function mountMenu(props: Partial<DropdownProps> = {}) {
  return mount(MkDropdown, {
    attachTo: document.body,
    props: {
      portal: false,
      ...props,
    },
    slots: {
      default: () => h('button', { type: 'button' }, 'Actions'),
      content: () => [
        h(MkDropdownItem, null, { default: () => 'Edit' }),
        h(MkDropdownItem, null, { default: () => 'Duplicate' }),
      ],
    },
  })
}

describe('MkDropdown', () => {
  it('opens a semantic menu from a trigger and closes after item selection', async () => {
    const wrapper = mountMenu()
    const trigger = wrapper.get('button')

    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)

    await trigger.trigger('click')
    await nextTick()

    const menu = wrapper.get('[role="menu"]')
    const items = wrapper.findAll('[role="menuitem"]')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(menu.attributes('data-mk-size')).toBe('md')
    expect(menu.attributes('data-mk-side')).toBe('bottom')
    expect(menu.attributes('data-mk-align')).toBe('start')
    expect(items.map((item) => item.text())).toEqual(['Edit', 'Duplicate'])
    expect(wrapper.emitted('update:open')).toEqual([[true]])

    await requiredItem(items, 0).trigger('click')
    await nextTick()
    await nextTick()

    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    expect(wrapper.emitted('update:open')).toEqual([[true], [false]])
  })

  it('supports controlled and initially open uncontrolled state', async () => {
    const uncontrolled = mountMenu({ defaultOpen: true })
    const controlled = mountMenu({ open: true })

    expect(uncontrolled.find('[role="menu"]').exists()).toBe(true)
    expect(controlled.find('[role="menu"]').exists()).toBe(true)

    await controlled.get('button').trigger('click')
    await nextTick()

    expect(controlled.emitted('update:open')).toEqual([[false]])
    expect(controlled.find('[role="menu"]').exists()).toBe(true)
  })

  it.each([
    ['sm', 'mk:min-w-40', 'mk:min-h-7'],
    ['md', 'mk:min-w-44', 'mk:min-h-8'],
    ['lg', 'mk:min-w-52', 'mk:min-h-10'],
  ] as const)('applies coordinated %s sizing', (size, contentClass, itemClass) => {
    const wrapper = mountMenu({ defaultOpen: true, size })

    expect(wrapper.get('[role="menu"]').classes()).toContain(contentClass)
    expect(wrapper.get('[role="menuitem"]').classes()).toContain(itemClass)
  })

  it.each(dropdownSides)('forwards the %s side to Reka UI', (side) => {
    const wrapper = mountMenu({ defaultOpen: true, side })

    expect(wrapper.getComponent(DropdownContent).props('side')).toBe(side)
    expect(wrapper.get('[role="menu"]').attributes('data-mk-side')).toBe(side)
  })

  it.each(dropdownAlignments)('forwards the %s alignment to Reka UI', (align) => {
    const wrapper = mountMenu({ defaultOpen: true, align })

    expect(wrapper.getComponent(DropdownContent).props('align')).toBe(align)
    expect(wrapper.get('[role="menu"]').attributes('data-mk-align')).toBe(align)
  })

  it('opens with ArrowDown and manages roving keyboard focus', async () => {
    const wrapper = mountMenu()
    const trigger = wrapper.get('button')

    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await nextTick()

    const items = wrapper.findAll('[role="menuitem"]')

    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    expect(document.activeElement).toBe(requiredItem(items, 0).element)

    await requiredItem(items, 0).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(document.activeElement).toBe(requiredItem(items, 1).element)
  })

  it('supports disabled triggers and disabled menu items', async () => {
    const disabledTrigger = mountMenu({ disabled: true })

    await disabledTrigger.get('button').trigger('click')
    await nextTick()

    expect(disabledTrigger.find('[role="menu"]').exists()).toBe(false)
    expect(disabledTrigger.get('button').attributes('data-disabled')).toBe('')

    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'Actions'),
        content: () => h(MkDropdownItem, { disabled: true }, { default: () => 'Unavailable' }),
      },
    })
    const item = wrapper.get('[role="menuitem"]')

    expect(item.attributes('data-disabled')).toBe('')
    expect(item.classes()).toContain('mk:data-[disabled]:opacity-50')
  })

  it('emits item selection and preserves the menu when selection is prevented', async () => {
    const onSelect = vi.fn((event: Event) => {
      event.preventDefault()
    })
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'Actions'),
        content: () => h(MkDropdownItem, { onSelect }, { default: () => 'Keep open' }),
      },
    })

    await wrapper.get('[role="menuitem"]').trigger('click')
    await nextTick()

    expect(onSelect).toHaveBeenCalledOnce()
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
  })

  it('renders labels, groups, separators, leading content, shortcuts, and colored items', () => {
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false, size: 'lg' },
      slots: {
        default: () => h('button', 'Actions'),
        content: () => [
          h(MkDropdownLabel, null, { default: () => 'Workspace' }),
          h(MkDropdownGroup, null, {
            default: () =>
              h(
                MkDropdownItem,
                { color: 'red' },
                {
                  leading: () => h('svg', { class: 'trash-icon' }),
                  default: () => 'Delete',
                  trailing: () => '⌘⌫',
                },
              ),
          }),
          h(MkDropdownSeparator),
        ],
      },
    })

    expect(wrapper.get('.mk-dropdown__label').text()).toBe('Workspace')
    expect(wrapper.get('.mk-dropdown__group').attributes('role')).toBe('group')
    expect(wrapper.get('.mk-dropdown__separator').attributes('role')).toBe('separator')
    expect(wrapper.find('.mk-dropdown__item-leading .trash-icon').exists()).toBe(true)
    expect(wrapper.get('.mk-dropdown__item-trailing').text()).toBe('⌘⌫')
    expect(wrapper.get('[role="menuitem"]').attributes('data-mk-color')).toBe('red')
    expect(wrapper.get('[role="menuitem"]').classes()).toContain('mk:text-base')
  })

  it('renders declarative items, customizes labels, and emits item selection', async () => {
    const onSelect = vi.fn<(event: Event) => void>()
    const items = [
      { label: 'Edit project', color: 'blue' as const, onSelect },
      { label: 'Archive project', color: 'amber' as const, disabled: true },
    ]
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, items, portal: false },
      slots: {
        default: () => h('button', 'Actions'),
        item: ({ item, index }: DropdownItemSlotProps) => `${String(index + 1)}. ${item.label}`,
      },
    })
    const menuItems = wrapper.findAll('[role="menuitem"]')

    expect(menuItems.map((item) => item.text())).toEqual(['1. Edit project', '2. Archive project'])
    expect(requiredItem(menuItems, 0).attributes('data-mk-color')).toBe('blue')
    expect(requiredItem(menuItems, 0).classes()).toContain(
      'mk:data-[highlighted]:bg-component-soft',
    )
    expect(requiredItem(menuItems, 0).classes()).not.toContain(
      'mk:data-[highlighted]:bg-component-soft-hover',
    )
    expect(requiredItem(menuItems, 1).attributes('data-mk-color')).toBe('amber')
    expect(requiredItem(menuItems, 1).attributes('data-disabled')).toBe('')

    await requiredItem(menuItems, 0).trigger('click')
    await nextTick()

    expect(onSelect).toHaveBeenCalledOnce()
    const event = onSelect.mock.calls[0]?.[0]
    expect(wrapper.emitted('itemSelect')).toEqual([[items[0], 0, event]])
  })

  it('renders declarative labels, groups, separators, checkboxes, radio groups, and submenus', () => {
    const items = [
      {
        type: 'group',
        label: 'Visibility',
        items: [{ type: 'checkbox', label: 'Show toolbar', checked: true }],
      },
      { type: 'separator' },
      { type: 'label', label: 'Density' },
      {
        type: 'radio-group',
        value: 'comfortable',
        items: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
        ],
      },
      {
        type: 'submenu',
        label: 'Share with',
        defaultOpen: true,
        items: [{ label: 'Workspace' }, { label: 'Project members' }],
      },
    ] satisfies readonly DropdownItem[]
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, items, portal: false },
      slots: { default: () => h('button', 'Options') },
    })

    expect(wrapper.findAll('.mk-dropdown__label').map((label) => label.text())).toEqual([
      'Visibility',
      'Density',
    ])
    expect(wrapper.get('.mk-dropdown__group').attributes('role')).toBe('group')
    expect(wrapper.get('.mk-dropdown__separator').attributes('role')).toBe('separator')
    expect(wrapper.get('[role="menuitemcheckbox"]').attributes('aria-checked')).toBe('true')
    expect(
      wrapper.findAll('[role="menuitemradio"]').map((item) => item.attributes('aria-checked')),
    ).toEqual(['false', 'true'])
    expect(wrapper.get('[role="menuitem"][aria-haspopup="menu"]').text()).toContain('Share with')
    expect(wrapper.findAll('[role="menu"]').at(1)?.text()).toContain('Workspace')
  })

  it('updates declarative checkbox and radio items through typed callbacks', async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>()
    const checkboxItems = [
      { type: 'checkbox', label: 'Show toolbar', checked: false, onCheckedChange },
    ] satisfies readonly DropdownItem[]
    const checkbox = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, items: checkboxItems, portal: false },
      slots: { default: () => h('button', 'Visibility') },
    })

    await checkbox.get('[role="menuitemcheckbox"]').trigger('click')
    await nextTick()

    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(checkbox.emitted('itemSelect')?.[0]?.[0]).toEqual(checkboxItems[0])

    const onValueChange = vi.fn<(value: string | number) => void>()
    const radioItems = [
      {
        type: 'radio-group',
        value: 'list',
        onValueChange,
        items: [
          { label: 'List', value: 'list' },
          { label: 'Grid', value: 'grid' },
        ],
      },
    ] satisfies readonly DropdownItem[]
    const radio = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, items: radioItems, portal: false },
      slots: { default: () => h('button', 'Density') },
    })

    await requiredItem(radio.findAll('[role="menuitemradio"]'), 1).trigger('click')
    await nextTick()

    expect(onValueChange).toHaveBeenCalledWith('grid')
    expect(radio.emitted('itemSelect')?.[0]?.[0]).toEqual(radioItems[0]?.items[1])
  })

  it('selects nested declarative submenu actions', async () => {
    const onSelect = vi.fn<(event: Event) => void>()
    const items = [
      {
        type: 'submenu',
        label: 'Share with',
        items: [{ label: 'Workspace', onSelect }],
      },
    ] satisfies readonly DropdownItem[]
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, items, portal: false },
      slots: { default: () => h('button', 'Share') },
    })
    await wrapper.get('[role="menuitem"][aria-haspopup="menu"]').trigger('click')
    await nextTick()

    const nestedItem = wrapper
      .findAll('[role="menuitem"]')
      .find((item) => item.text() === 'Workspace')

    expect(nestedItem).toBeDefined()
    await nestedItem?.trigger('click')
    await nextTick()

    expect(onSelect).toHaveBeenCalledOnce()
    expect(wrapper.emitted('itemSelect')?.[0]?.[0]).toEqual(items[0]?.items[0])
  })

  it.each(dropdownItemColors)('supports the shared %s ModeKit color', (color) => {
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, items: [{ label: color, color }], portal: false },
      slots: { default: () => h('button', 'Colors') },
    })
    const item = wrapper.get('[role="menuitem"]')

    expect(item.attributes('data-mk-color')).toBe(color)
    expect(item.classes()).toContain('mk:text-component')
  })

  it('updates checkbox items and exposes checked state to custom indicators', async () => {
    const checked = ref(false)
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'Actions'),
        content: () =>
          h(
            MkDropdownCheckboxItem,
            {
              modelValue: checked.value,
              'onUpdate:modelValue': (value: unknown) => {
                if (typeof value === 'boolean') checked.value = value
              },
            },
            {
              default: ({ checked: current }: DropdownCheckboxItemSlotProps) =>
                `Notifications ${String(current)}`,
              indicator: ({ checked: current }: DropdownCheckboxItemSlotProps) =>
                h('span', { class: 'custom-check' }, String(current)),
            },
          ),
      },
    })
    const item = wrapper.get('[role="menuitemcheckbox"]')

    expect(item.attributes('aria-checked')).toBe('false')

    await item.trigger('click')
    await nextTick()

    expect(checked.value).toBe(true)
  })

  it('updates radio-group selection and renders checked indicators', async () => {
    const selected = ref('list')
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'View'),
        content: () =>
          h(
            MkDropdownRadioGroup,
            {
              modelValue: selected.value,
              'onUpdate:modelValue': (value: unknown) => {
                if (typeof value === 'string' || typeof value === 'number') {
                  selected.value = String(value)
                }
              },
            },
            {
              default: () => [
                h(MkDropdownRadioItem, { value: 'list' }, { default: () => 'List' }),
                h(MkDropdownRadioItem, { value: 'grid' }, { default: () => 'Grid' }),
              ],
            },
          ),
      },
    })
    const items = wrapper.findAll('[role="menuitemradio"]')

    expect(requiredItem(items, 0).attributes('aria-checked')).toBe('true')
    expect(requiredItem(items, 1).attributes('aria-checked')).toBe('false')

    await requiredItem(items, 1).trigger('click')
    await nextTick()

    expect(selected.value).toBe('grid')
  })

  it('integrates a filter with menu keyboard management', async () => {
    const query = ref('')
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'Search'),
        content: () =>
          h(MkDropdownFilter, {
            modelValue: query.value,
            placeholder: 'Filter actions',
            'aria-label': 'Filter actions',
            'onUpdate:modelValue': (value: unknown) => {
              if (typeof value === 'string') query.value = value
            },
          }),
      },
    })
    const filter = wrapper.get('input')

    await filter.setValue('dup')

    expect(query.value).toBe('dup')
    expect(filter.classes()).toContain('mk-dropdown__filter')
    expect(filter.attributes('aria-label')).toBe('Filter actions')
  })

  it('renders controlled submenus with inherited sizing and portal behavior', () => {
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false, size: 'sm' },
      slots: {
        default: () => h('button', 'Actions'),
        content: () =>
          h(
            MkDropdownSub,
            { defaultOpen: true },
            {
              default: () => [
                h(MkDropdownSubTrigger, null, { default: () => 'Share' }),
                h(MkDropdownSubContent, null, {
                  default: () => h(MkDropdownItem, null, { default: () => 'Copy link' }),
                }),
              ],
            },
          ),
      },
    })
    const menus = wrapper.findAll('[role="menu"]')
    const subTrigger = wrapper.get('[role="menuitem"][aria-haspopup="menu"]')
    const subContent = wrapper.getComponent(DropdownSubContent)

    expect(menus).toHaveLength(2)
    expect(subTrigger.text()).toContain('Share')
    expect(subTrigger.find('.mk-dropdown__sub-indicator').exists()).toBe(true)
    expect(wrapper.get('.mk-dropdown__sub-content').attributes('data-mk-size')).toBe('sm')
    expect(subContent.props()).toMatchObject({
      sideOffset: 4,
      alignOffset: -4,
      collisionPadding: 8,
      positionStrategy: 'fixed',
      loop: true,
    })
  })

  it('forwards positioning, collision, direction, and modal behavior', () => {
    const collisionPadding = { top: 16, right: 12 }
    const wrapper = mountMenu({
      defaultOpen: true,
      modal: false,
      dir: 'rtl',
      loop: false,
      side: 'right',
      align: 'end',
      sideOffset: 12,
      alignOffset: -4,
      avoidCollisions: false,
      collisionPadding,
      hideWhenDetached: true,
      positionStrategy: 'absolute',
    })
    const content = wrapper.getComponent(DropdownContent)

    expect(content.props()).toMatchObject({
      side: 'right',
      align: 'end',
      sideOffset: 12,
      alignOffset: -4,
      avoidCollisions: false,
      collisionPadding,
      hideWhenDetached: true,
      positionStrategy: 'absolute',
      loop: false,
    })
  })

  it('portals by default, supports a custom target, and renders a custom arrow', async () => {
    const target = document.createElement('div')
    target.id = 'dropdown-target'
    document.body.append(target)
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      props: { arrow: true, defaultOpen: true, portal: '#dropdown-target' },
      slots: {
        default: () => h('button', 'Actions'),
        content: () => h(MkDropdownItem, null, { default: () => 'Edit' }),
        arrow: () => h('path', { class: 'custom-arrow' }),
      },
    })

    await nextTick()
    await nextTick()

    expect(target.querySelector('.mk-dropdown')).not.toBeNull()
    expect(target.querySelector('.mk-dropdown__arrow .custom-arrow')).not.toBeNull()

    wrapper.unmount()
  })

  it('forwards lifecycle events', () => {
    const wrapper = mountMenu({ defaultOpen: true })
    const content = wrapper.getComponent(DropdownContent)
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    const outsideEvent = new Event('pointerDownOutside')
    const focusEvent = new Event('focusOutside')
    const interactEvent = new Event('interactOutside')
    const openEvent = new Event('openAutoFocus')
    const closeEvent = new Event('closeAutoFocus')

    content.vm.$emit('escapeKeyDown', escapeEvent)
    content.vm.$emit('pointerDownOutside', outsideEvent)
    content.vm.$emit('focusOutside', focusEvent)
    content.vm.$emit('interactOutside', interactEvent)
    content.vm.$emit('openAutoFocus', openEvent)
    content.vm.$emit('closeAutoFocus', closeEvent)

    expect(wrapper.emitted('escapeKeyDown')).toEqual([[escapeEvent]])
    expect(wrapper.emitted('pointerDownOutside')).toEqual([[outsideEvent]])
    expect(wrapper.emitted('focusOutside')).toEqual([[focusEvent]])
    expect(wrapper.emitted('interactOutside')).toEqual([[interactEvent]])
    expect(wrapper.emitted('openAutoFocus')).toEqual([[openEvent]])
    expect(wrapper.emitted('closeAutoFocus')).toEqual([[closeEvent]])
  })

  it('merges global, local, and native classes in override order', () => {
    const wrapper = mount(MkDropdown, {
      attachTo: document.body,
      global: {
        plugins: [
          createModeKit({
            ui: {
              dropdown: {
                base: 'mk:p-2 global-content',
                slots: {
                  item: 'mk:px-3 global-item',
                  indicator: 'global-indicator',
                },
                defaultVariants: { size: 'lg' },
              },
            },
          }),
        ],
      },
      props: {
        defaultOpen: true,
        portal: false,
        ui: {
          base: 'mk:p-3 local-content',
          item: 'mk:px-4 local-item',
          indicator: 'local-indicator',
        },
        class: 'mk:p-4 native-content',
      },
      slots: {
        default: () => h('button', 'Actions'),
        content: () =>
          h(
            MkDropdownCheckboxItem,
            { modelValue: true, class: 'mk:px-5 native-item' },
            { default: () => 'Enabled' },
          ),
      },
    })
    const content = wrapper.get('[role="menu"]')
    const item = wrapper.get('[role="menuitemcheckbox"]')
    const indicator = wrapper.get('.mk-dropdown__indicator')

    expect(content.classes()).toEqual(
      expect.arrayContaining([
        'mk-dropdown',
        'mk:p-4',
        'global-content',
        'local-content',
        'native-content',
      ]),
    )
    expect(content.classes()).not.toEqual(expect.arrayContaining(['mk:p-1', 'mk:p-2', 'mk:p-3']))
    expect(content.attributes('data-mk-size')).toBe('lg')
    expect(item.classes()).toEqual(
      expect.arrayContaining(['mk:px-5', 'global-item', 'local-item', 'native-item']),
    )
    expect(item.classes()).not.toEqual(expect.arrayContaining(['mk:px-3', 'mk:px-4']))
    expect(indicator.classes()).toEqual(
      expect.arrayContaining(['global-indicator', 'local-indicator']),
    )
  })

  it('exports all finite public contracts', () => {
    expect(dropdownSizes).toEqual(['sm', 'md', 'lg'])
    expect(dropdownItemColors).toBe(modeKitColors)
    expect(dropdownSides).toEqual(['top', 'right', 'bottom', 'left'])
    expect(dropdownAlignments).toEqual(['start', 'center', 'end'])
    expect(dropdownPositionStrategies).toEqual(['absolute', 'fixed'])
    expect(dropdownDirections).toEqual(['ltr', 'rtl'])
  })
})
