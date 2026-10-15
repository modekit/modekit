import { mount } from '@vue/test-utils'
import { SelectContent } from 'reka-ui'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import {
  createModeKit,
  MkSelect,
  selectAlignments,
  selectDirections,
  selectPositions,
  selectPositionStrategies,
  selectSides,
  selectSizes,
  selectVariants,
} from '../../../src/index.js'
import type { SelectItem, SelectProps } from '../../../src/index.js'

class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

const scrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  'scrollIntoView',
)

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  Element.prototype.scrollIntoView = vi.fn()
})

afterAll(() => {
  vi.unstubAllGlobals()
  if (scrollIntoViewDescriptor) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', scrollIntoViewDescriptor)
  } else {
    delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView
  }
})

afterEach(() => {
  document.body.replaceChildren()
})

const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done', disabled: true },
] satisfies readonly SelectItem[]

function mountSelect(props: Partial<SelectProps> = {}) {
  return mount(MkSelect, {
    attachTo: document.body,
    props: {
      items,
      portal: false,
      placeholder: 'Select status',
      ...props,
    },
  })
}

async function settle(): Promise<void> {
  await nextTick()
  await nextTick()
  await nextTick()
  await nextTick()
}

function requiredOption(wrapper: ReturnType<typeof mountSelect>, index: number) {
  const option = wrapper.findAll('[role="option"]')[index]
  if (!option) throw new Error(`Expected option at index ${String(index)}`)
  return option
}

describe('MkSelect', () => {
  it('renders an accessible combobox trigger with a placeholder and forwarded attributes', () => {
    const onFocus = vi.fn()
    const wrapper = mountSelect({
      id: 'status',
      'aria-label': 'Status',
      onFocus,
    })
    const trigger = wrapper.get('[role="combobox"]')

    expect(trigger.element.tagName).toBe('BUTTON')
    expect(trigger.attributes('type')).toBe('button')
    expect(trigger.attributes('id')).toBe('status')
    expect(trigger.attributes('aria-label')).toBe('Status')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('data-placeholder')).toBe('')
    expect(trigger.text()).toContain('Select status')
    expect(trigger.classes()).toEqual(
      expect.arrayContaining([
        'mk-select',
        'mk:h-10',
        'mk:rounded-lg',
        'mk:border-neutral-300',
        'mk:bg-white',
      ]),
    )

    trigger.element.dispatchEvent(new FocusEvent('focus'))
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('supports controlled value and open state', async () => {
    const wrapper = mountSelect({ modelValue: 'backlog', open: true })
    const trigger = wrapper.get('[role="combobox"]')

    expect(trigger.text()).toContain('Backlog')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

    ;(requiredOption(wrapper, 1).element as HTMLElement).focus()
    await requiredOption(wrapper, 1).trigger('keydown', { key: 'Enter' })
    await settle()

    expect(wrapper.emitted('update:modelValue')).toEqual([['todo']])
    expect(wrapper.emitted('update:open')).toContainEqual([false])
    expect(trigger.text()).toContain('Backlog')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('supports uncontrolled selection and closes after choosing an item', async () => {
    const wrapper = mountSelect({ defaultOpen: true, defaultValue: 'backlog' })

    ;(requiredOption(wrapper, 1).element as HTMLElement).focus()
    await requiredOption(wrapper, 1).trigger('keydown', { key: 'Enter' })
    await settle()

    expect(wrapper.emitted('update:modelValue')).toEqual([['todo']])
    expect(wrapper.emitted('update:open')).toContainEqual([false])
    expect(wrapper.get('[role="combobox"]').text()).toContain('Todo')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('supports multiple selection and keeps the listbox open', async () => {
    const wrapper = mountSelect({
      defaultOpen: true,
      defaultValue: ['backlog'],
      multiple: true,
    })

    ;(requiredOption(wrapper, 1).element as HTMLElement).focus()
    await requiredOption(wrapper, 1).trigger('keydown', { key: 'Enter' })
    await settle()

    expect(wrapper.emitted('update:modelValue')).toEqual([[['backlog', 'todo']]])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    expect(wrapper.get('[role="combobox"]').text()).toContain('Backlog, Todo')
    expect(requiredOption(wrapper, 0).attributes('aria-selected')).toBe('true')
    expect(requiredOption(wrapper, 1).attributes('aria-selected')).toBe('true')
  })

  it('renders groups, labels, separators, descriptions, and disabled options', () => {
    const groupedItems = [
      {
        type: 'group',
        label: 'Active work',
        items: [
          { label: 'Backlog', value: 'backlog', description: 'Not started yet' },
          { label: 'In progress', value: 'progress' },
        ],
      },
      { type: 'separator' },
      {
        type: 'group',
        label: 'Completed',
        items: [{ label: 'Done', value: 'done', disabled: true }],
      },
    ] satisfies readonly SelectItem[]
    const wrapper = mountSelect({ defaultOpen: true, items: groupedItems })

    expect(wrapper.findAll('[role="group"]')).toHaveLength(2)
    expect(wrapper.findAll('.mk-select__label').map((label) => label.text())).toEqual([
      'Active work',
      'Completed',
    ])
    expect(wrapper.get('.mk-select__separator').classes()).toContain('mk-select__separator')
    expect(wrapper.get('.mk-select__item-description').text()).toBe('Not started yet')
    expect(requiredOption(wrapper, 2).attributes('data-disabled')).toBe('')
  })

  it('renders an empty state when no selectable options exist', () => {
    const wrapper = mountSelect({ defaultOpen: true, emptyText: 'Nothing available', items: [] })

    expect(wrapper.get('.mk-select__empty').text()).toBe('Nothing available')
  })

  it.each([
    ['sm', 'mk:h-8', 'mk:rounded-md', 'mk:min-h-7'],
    ['md', 'mk:h-10', 'mk:rounded-lg', 'mk:min-h-8'],
    ['lg', 'mk:h-12', 'mk:rounded-xl', 'mk:min-h-10'],
  ] as const)(
    'coordinates the %s size across trigger and options',
    (size, height, radius, itemClass) => {
      const wrapper = mountSelect({ defaultOpen: true, size })
      const trigger = wrapper.get('[role="combobox"]')

      expect(trigger.attributes('data-mk-size')).toBe(size)
      expect(trigger.classes()).toEqual(expect.arrayContaining([height, radius]))
      expect(requiredOption(wrapper, 0).classes()).toContain(itemClass)
      expect(wrapper.get('[role="listbox"]').attributes('data-mk-size')).toBe(size)
    },
  )

  it.each([
    ['outline', ['mk:border-neutral-300', 'mk:bg-white']],
    ['soft', ['mk:border-0', 'mk:bg-neutral-100']],
    ['subtle', ['mk:border-neutral-200', 'mk:bg-neutral-100/50']],
    ['ghost', ['mk:border-0', 'mk:bg-transparent']],
    ['plain', ['mk:border-0', 'mk:bg-transparent']],
  ] as const)('renders the %s trigger variant', (variant, classes) => {
    const trigger = mountSelect({ variant }).get('[role="combobox"]')

    expect(trigger.attributes('data-mk-variant')).toBe(variant)
    expect(trigger.classes()).toEqual(expect.arrayContaining([...classes]))
  })

  it('renders selected-value, leading, trailing, item, indicator, and empty slots', () => {
    const wrapper = mount(MkSelect, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        defaultValue: 'backlog',
        items,
        portal: false,
      },
      slots: {
        leading: ({ selectedItems }) => `Lead ${selectedItems[0]?.label ?? 'None'}`,
        value: ({ modelValue }) => `Value ${String(modelValue)}`,
        trailing: ({ open }) => `Trail ${String(open)}`,
        item: ({ item }) => `Item ${item.label}`,
        'item-leading': ({ index }) => `L${String(index)}`,
        'item-trailing': ({ selected }) => `T${String(selected)}`,
        indicator: ({ item }) => `✓${item.label}`,
      },
    })

    expect(wrapper.get('.mk-select__leading').text()).toBe('Lead Backlog')
    expect(wrapper.get('.mk-select__value').text()).toBe('Value backlog')
    expect(wrapper.get('.mk-select__trailing').text()).toBe('Trail true')
    expect(requiredOption(wrapper, 0).get('.mk-select__item-label').text()).toBe('Item Backlog')
    expect(requiredOption(wrapper, 0).get('.mk-select__item-leading').text()).toBe('L0')
    expect(requiredOption(wrapper, 0).get('.mk-select__item-trailing').text()).toBe('Ttrue')
    expect(requiredOption(wrapper, 0).get('.mk-select__indicator').text()).toBe('✓Backlog')
  })

  it('shows a decorative size-matched spinner while loading', () => {
    const wrapper = mountSelect({ loading: true, size: 'lg' })
    const trigger = wrapper.get('[role="combobox"]')
    const spinner = wrapper.get('.mk-spinner')

    expect(trigger.attributes('aria-busy')).toBe('true')
    expect(trigger.attributes('data-mk-loading')).toBe('')
    expect(spinner.attributes('aria-hidden')).toBe('true')
    expect(spinner.attributes('data-mk-size')).toBe('lg')
    expect(spinner.classes()).toContain('mk-select__spinner')
    expect(wrapper.find('.mk-select__trigger-icon').exists()).toBe(false)
  })

  it('forwards disabled, required, invalid, name, autocomplete, and direction semantics', () => {
    const wrapper = mountSelect({
      autocomplete: 'organization',
      defaultOpen: true,
      dir: 'rtl',
      disabled: true,
      invalid: true,
      name: 'status',
      required: true,
    })
    const trigger = wrapper.get('[role="combobox"]')
    const nativeSelect = wrapper.get('select')

    expect(trigger.attributes('disabled')).toBeDefined()
    expect(trigger.attributes('aria-required')).toBe('true')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.attributes('data-mk-invalid')).toBe('')
    expect(trigger.attributes('dir')).toBe('rtl')
    expect(nativeSelect.attributes('name')).toBe('status')
    expect(nativeSelect.attributes('autocomplete')).toBe('organization')
    expect(nativeSelect.attributes('required')).toBeDefined()
    expect(nativeSelect.attributes('disabled')).toBeDefined()
  })

  it('supports popper and item-aligned positioning contracts', () => {
    const popper = mountSelect({
      align: 'end',
      alignOffset: 3,
      avoidCollisions: false,
      collisionPadding: 12,
      defaultOpen: true,
      hideWhenDetached: true,
      position: 'popper',
      positionStrategy: 'absolute',
      side: 'top',
      sideOffset: 9,
    })
    const content = popper.getComponent(SelectContent)

    expect(content.props()).toMatchObject({
      align: 'end',
      alignOffset: 3,
      avoidCollisions: false,
      collisionPadding: 12,
      hideWhenDetached: true,
      position: 'popper',
      positionStrategy: 'absolute',
      side: 'top',
      sideOffset: 9,
    })
    expect(popper.get('[role="listbox"]').attributes('data-mk-position')).toBe('popper')

    const aligned = mountSelect({ defaultOpen: true, position: 'item-aligned' })
    expect(aligned.getComponent(SelectContent).props('position')).toBe('item-aligned')
  })

  it('supports body, custom, and inline portal targets', async () => {
    const inline = mountSelect({ defaultOpen: true, portal: false })
    expect(inline.find('[role="listbox"]').exists()).toBe(true)

    const target = document.createElement('div')
    target.id = 'select-target'
    document.body.append(target)
    const custom = mountSelect({ defaultOpen: true, portal: '#select-target' })
    await settle()

    expect(custom.find('[role="listbox"]').exists()).toBe(false)
    expect(target.querySelector('[role="listbox"]')).not.toBeNull()
  })

  it('supports persistent mounting and optional arrows', () => {
    const wrapper = mountSelect({ arrow: true, open: false, unmountOnHide: false })

    expect(wrapper.get('[role="listbox"]').attributes('data-state')).toBe('closed')
    expect(wrapper.get('.mk-select__arrow').classes()).toContain('mk-select__arrow')
  })

  it('emits item selection and honors prevented selection', async () => {
    const wrapper = mountSelect({ defaultOpen: true, defaultValue: 'backlog' })
    const item = requiredOption(wrapper, 1)
    item.element.addEventListener('select.select', (event) => {
      event.preventDefault()
    })

    ;(item.element as HTMLElement).focus()
    await item.trigger('keydown', { key: 'Enter' })
    await settle()

    expect(wrapper.emitted('itemSelect')?.[0]?.[0]).toMatchObject({ label: 'Todo', value: 'todo' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('[role="combobox"]').text()).toContain('Backlog')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('opens with keyboard and supports Arrow-key navigation', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('[role="combobox"]')

    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await settle()

    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    ;(requiredOption(wrapper, 0).element as HTMLElement).focus()
    expect(document.activeElement).toBe(requiredOption(wrapper, 0).element)

    requiredOption(wrapper, 0).element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    )
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve))
    expect(document.activeElement).toBe(requiredOption(wrapper, 1).element)
  })

  it('emits primitive lifecycle events', () => {
    const wrapper = mountSelect({ defaultOpen: true })
    const content = wrapper.getComponent(SelectContent)
    const escape = new KeyboardEvent('keydown', { key: 'Escape' })
    const outside = new Event('pointerdown')
    const closeFocus = new Event('focus')

    content.vm.$emit('escapeKeyDown', escape)
    content.vm.$emit('pointerDownOutside', outside)
    content.vm.$emit('closeAutoFocus', closeFocus)

    expect(wrapper.emitted('escapeKeyDown')).toEqual([[escape]])
    expect(wrapper.emitted('pointerDownOutside')).toEqual([[outside]])
    expect(wrapper.emitted('closeAutoFocus')).toEqual([[closeFocus]])
  })

  it('merges global, local, and native classes in override order', () => {
    const wrapper = mount(MkSelect, {
      attachTo: document.body,
      global: {
        plugins: [
          createModeKit({
            ui: {
              select: {
                base: 'mk:h-9 global-base',
                variants: {
                  size: { lg: 'global-size' },
                  variant: { soft: 'global-variant' },
                },
                slots: {
                  content: 'global-content',
                  item: 'mk:min-h-11 global-item',
                  indicator: 'global-indicator',
                },
                defaultVariants: { size: 'lg', variant: 'soft' },
              },
            },
          }),
        ],
      },
      props: {
        class: 'mk:h-14 native-base',
        defaultOpen: true,
        defaultValue: 'backlog',
        items,
        portal: false,
        ui: {
          base: 'mk:h-13 local-base',
          content: 'local-content',
          item: 'mk:min-h-12 local-item',
          indicator: 'local-indicator',
        },
      },
    })
    const trigger = wrapper.get('[role="combobox"]')

    expect(trigger.attributes('data-mk-size')).toBe('lg')
    expect(trigger.attributes('data-mk-variant')).toBe('soft')
    expect(trigger.classes()).toEqual(
      expect.arrayContaining([
        'mk:h-14',
        'global-base',
        'global-size',
        'global-variant',
        'local-base',
        'native-base',
      ]),
    )
    expect(trigger.classes()).not.toEqual(expect.arrayContaining(['mk:h-12', 'mk:h-9', 'mk:h-13']))
    expect(wrapper.get('[role="listbox"]').classes()).toEqual(
      expect.arrayContaining(['global-content', 'local-content']),
    )
    expect(requiredOption(wrapper, 0).classes()).toEqual(
      expect.arrayContaining(['mk:min-h-12', 'global-item', 'local-item']),
    )
    expect(requiredOption(wrapper, 0).classes()).not.toEqual(
      expect.arrayContaining(['mk:min-h-10', 'mk:min-h-11']),
    )
    expect(wrapper.get('.mk-select__indicator').classes()).toEqual(
      expect.arrayContaining(['global-indicator', 'local-indicator']),
    )
  })

  it('exports the complete curated axes', () => {
    expect(selectSizes).toEqual(['sm', 'md', 'lg'])
    expect(selectVariants).toEqual(['outline', 'soft', 'subtle', 'ghost', 'plain'])
    expect(selectSides).toEqual(['top', 'right', 'bottom', 'left'])
    expect(selectAlignments).toEqual(['start', 'center', 'end'])
    expect(selectPositions).toEqual(['popper', 'item-aligned'])
    expect(selectPositionStrategies).toEqual(['absolute', 'fixed'])
    expect(selectDirections).toEqual(['ltr', 'rtl'])
  })
})
