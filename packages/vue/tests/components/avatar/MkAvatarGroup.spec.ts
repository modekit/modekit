import { mount } from '@vue/test-utils'
import { Fragment, h } from 'vue'
import { describe, expect, it } from 'vitest'

import { avatarGroupSpacings, createModeKit, MkAvatar, MkAvatarGroup } from '../../../src/index.js'

function avatars(count: number) {
  return Array.from({ length: count }, (_, index) =>
    h(MkAvatar, {
      key: index,
      fallback: String.fromCharCode(65 + index),
      'aria-label': `Member ${String(index + 1)}`,
    }),
  )
}

describe('MkAvatarGroup', () => {
  it('renders an accessible group with shared defaults and overlap styling', () => {
    const wrapper = mount(MkAvatarGroup, {
      attrs: { 'aria-label': 'Project members' },
      slots: { default: () => avatars(3) },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Project members')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-spacing')).toBe('normal')
    expect(wrapper.classes()).toContain('mk-avatar-group')
    expect(wrapper.classes()).toContain('mk:isolate')
    expect(wrapper.classes()).toContain('mk:[&>.mk-avatar]:ring-2')
    expect(wrapper.classes()).toContain('mk:[&>.mk-avatar:not(:first-child)]:-ml-2')
  })

  it('provides its size to Avatar children', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: { size: 'xl' },
      slots: { default: () => avatars(2) },
    })

    const children = wrapper.findAllComponents(MkAvatar)

    expect(wrapper.attributes('data-mk-size')).toBe('xl')
    expect(children).toHaveLength(2)
    expect(children.every((child) => child.attributes('data-mk-size') === 'xl')).toBe(true)
    expect(children.every((child) => child.classes().includes('mk:size-16'))).toBe(true)
  })

  it('allows an Avatar to override the inherited group size', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: { size: 'lg' },
      slots: {
        default: () => [h(MkAvatar, { fallback: 'A' }), h(MkAvatar, { fallback: 'B', size: 'xs' })],
      },
    })

    const children = wrapper.findAllComponents(MkAvatar)

    expect(children[0]?.attributes('data-mk-size')).toBe('lg')
    expect(children[1]?.attributes('data-mk-size')).toBe('xs')
  })

  it.each([
    ['tight', 'mk:[&>.mk-avatar:not(:first-child)]:-ml-3'],
    ['normal', 'mk:[&>.mk-avatar:not(:first-child)]:-ml-2'],
    ['loose', 'mk:[&>.mk-avatar:not(:first-child)]:-ml-1'],
  ] as const)('resolves %s overlap spacing', (spacing, spacingClass) => {
    const wrapper = mount(MkAvatarGroup, {
      props: { spacing },
      slots: { default: () => avatars(2) },
    })

    expect(avatarGroupSpacings).toContain(spacing)
    expect(wrapper.attributes('data-mk-spacing')).toBe(spacing)
    expect(wrapper.classes()).toContain(spacingClass)
  })

  it('limits visible members and renders a deterministic overflow Avatar', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: { max: 2, size: 'lg', overflowColor: 'info' },
      slots: { default: () => avatars(5) },
    })

    const rendered = wrapper.findAllComponents(MkAvatar)
    const overflow = rendered[2]

    expect(rendered).toHaveLength(3)
    expect(wrapper.text()).toBe('AB+3')
    expect(wrapper.attributes('data-mk-max')).toBe('2')
    expect(wrapper.attributes('data-mk-overflow-count')).toBe('3')
    expect(overflow?.attributes('aria-label')).toBe('3 more members')
    expect(overflow?.attributes('data-mk-color')).toBe('info')
    expect(overflow?.attributes('data-mk-size')).toBe('lg')
    expect(overflow?.classes()).toContain('mk-avatar-group__overflow')
  })

  it('uses a singular accessible overflow label for one hidden member', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: { max: 2 },
      slots: { default: () => avatars(3) },
    })

    expect(wrapper.findAllComponents(MkAvatar)[2]?.attributes('aria-label')).toBe('1 more member')
  })

  it('does not render overflow when max includes every member', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: { max: 3 },
      slots: { default: () => avatars(3) },
    })

    expect(wrapper.findAllComponents(MkAvatar)).toHaveLength(3)
    expect(wrapper.attributes('data-mk-overflow-count')).toBeUndefined()
    expect(wrapper.find('.mk-avatar-group__overflow').exists()).toBe(false)
  })

  it('flattens fragment children before applying max', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: { max: 1 },
      slots: { default: () => h(Fragment, null, avatars(3)) },
    })

    expect(wrapper.findAllComponents(MkAvatar)).toHaveLength(2)
    expect(wrapper.text()).toBe('A+2')
  })

  it('supports custom overflow content and an accessible label', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: { max: 1, overflowLabel: 'Additional project members' },
      slots: {
        default: () => avatars(3),
        overflow: ({ count }) => h('span', { 'data-overflow': '' }, `${String(count)} hidden`),
      },
    })

    const overflow = wrapper.findAllComponents(MkAvatar)[1]

    expect(wrapper.find('[data-overflow]').text()).toBe('2 hidden')
    expect(overflow?.attributes('aria-label')).toBe('Additional project members')
  })

  it('renders through a configured root and merges local overrides', () => {
    const wrapper = mount(MkAvatarGroup, {
      props: {
        as: 'section',
        ui: {
          base: 'border',
          item: 'shadow-sm',
          overflow: 'font-bold',
        },
        max: 1,
      },
      attrs: { role: 'region', class: 'team-stack' },
      slots: { default: () => avatars(2) },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('SECTION')
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('team-stack')
    expect(wrapper.findAllComponents(MkAvatar)[0]?.classes()).toContain('shadow-sm')
    expect(wrapper.find('.mk-avatar-group__overflow').classes()).toContain('font-bold')
  })

  it('applies global root, slot, variant, and default overrides', () => {
    const wrapper = mount(MkAvatarGroup, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              avatarGroup: {
                base: 'border',
                slots: {
                  item: 'shadow-sm',
                  overflow: 'font-semibold',
                },
                variants: {
                  size: {
                    xl: 'p-1',
                  },
                  spacing: {
                    loose: 'gap-px',
                  },
                  overflowColor: {
                    warning: 'outline',
                  },
                },
                defaultVariants: {
                  size: 'xl',
                  spacing: 'loose',
                  overflowColor: 'warning',
                },
              },
            },
          }),
        ],
      },
      props: { max: 1 },
      slots: { default: () => avatars(2) },
    })

    const children = wrapper.findAllComponents(MkAvatar)
    const overflow = children[1]

    expect(wrapper.attributes('data-mk-size')).toBe('xl')
    expect(wrapper.attributes('data-mk-spacing')).toBe('loose')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('p-1')
    expect(wrapper.classes()).toContain('gap-px')
    expect(children[0]?.classes()).toContain('shadow-sm')
    expect(overflow?.attributes('data-mk-color')).toBe('warning')
    expect(overflow?.classes()).toContain('font-semibold')
    expect(overflow?.classes()).toContain('outline')
  })
})
