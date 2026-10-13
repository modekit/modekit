import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import {
  buttonGroupOrientations,
  createModeKit,
  MkButton,
  MkButtonGroup,
} from '../../../src/index.js'

function buttons() {
  return [
    h(MkButton, { key: 'first', variant: 'outline' }, { default: () => 'First' }),
    h(MkButton, { key: 'second', variant: 'outline' }, { default: () => 'Second' }),
    h(MkButton, { key: 'third', variant: 'outline' }, { default: () => 'Third' }),
  ]
}

describe('MkButtonGroup', () => {
  it('renders an accessible horizontal group with connected Button styling', () => {
    const wrapper = mount(MkButtonGroup, {
      attrs: { 'aria-label': 'View options' },
      slots: { default: () => buttons() },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('View options')
    expect(wrapper.attributes('data-mk-orientation')).toBe('horizontal')
    expect(wrapper.classes()).toContain('mk-button-group')
    expect(wrapper.classes()).toContain('mk:isolate')
    expect(wrapper.classes()).toContain('mk:flex-row')
    expect(wrapper.classes()).toContain('mk:[&>.mk-button:not(:first-child)]:-ml-px')
    expect(wrapper.classes()).toContain('mk:[&>.mk-button:not(:first-child)]:rounded-l-none')
    expect(wrapper.classes()).toContain('mk:[&>.mk-button:not(:last-child)]:rounded-r-none')
    expect(wrapper.classes()).toContain('mk:[&>.mk-button:focus-visible]:z-20')
    expect(wrapper.findAllComponents(MkButton)).toHaveLength(3)
  })

  it('supports connected vertical groups', () => {
    const wrapper = mount(MkButtonGroup, {
      props: { orientation: 'vertical' },
      slots: { default: () => buttons() },
    })

    expect(buttonGroupOrientations).toContain('vertical')
    expect(wrapper.attributes('data-mk-orientation')).toBe('vertical')
    expect(wrapper.classes()).toContain('mk:flex-col')
    expect(wrapper.classes()).toContain('mk:[&>.mk-button:not(:first-child)]:-mt-px')
    expect(wrapper.classes()).toContain('mk:[&>.mk-button:not(:first-child)]:rounded-t-none')
    expect(wrapper.classes()).toContain('mk:[&>.mk-button:not(:last-child)]:rounded-b-none')
  })

  it('preserves each Button child configuration and native behavior', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(MkButtonGroup, {
      slots: {
        default: () => [
          h(
            MkButton,
            { color: 'success', size: 'sm', onClick: handleClick },
            { default: () => 'Save' },
          ),
          h(
            MkButton,
            { color: 'destructive', size: 'lg', disabled: true },
            { default: () => 'Delete' },
          ),
        ],
      },
    })
    const children = wrapper.findAllComponents(MkButton)

    await children[0]?.trigger('click')

    expect(handleClick).toHaveBeenCalledOnce()
    expect(children[0]?.attributes('data-mk-color')).toBe('success')
    expect(children[0]?.attributes('data-mk-size')).toBe('sm')
    expect(children[1]?.attributes('data-mk-color')).toBe('destructive')
    expect(children[1]?.attributes('data-mk-size')).toBe('lg')
    expect(children[1]?.attributes('disabled')).toBeDefined()
  })

  it('renders Button children directly without wrapper elements', () => {
    const wrapper = mount(MkButtonGroup, {
      slots: { default: () => buttons() },
    })
    const group = wrapper.get('[role="group"]').element

    expect(group.children).toHaveLength(3)
    expect(Array.from(group.children).every((element) => element.matches('.mk-button'))).toBe(true)
    expect(
      wrapper.findAllComponents(MkButton).every((button) => button.element.parentElement === group),
    ).toBe(true)
  })

  it('renders through a configured root and preserves an explicit role', () => {
    const wrapper = mount(MkButtonGroup, {
      props: { as: 'nav' },
      attrs: { role: 'toolbar', 'aria-label': 'Editor actions' },
      slots: { default: () => buttons() },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('NAV')
    expect(wrapper.attributes('role')).toBe('toolbar')
    expect(wrapper.attributes('aria-label')).toBe('Editor actions')
  })

  it('applies global defaults and resolves root overrides in order', () => {
    const wrapper = mount(MkButtonGroup, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              buttonGroup: {
                base: 'mk:p-1',
                variants: {
                  orientation: {
                    vertical: 'mk:items-stretch',
                  },
                },
                defaultVariants: {
                  orientation: 'vertical',
                },
              },
            },
          }),
        ],
      },
      props: {
        ui: { base: 'mk:p-2' },
      },
      attrs: { class: 'mk:p-3 custom-group' },
      slots: { default: () => buttons() },
    })

    expect(wrapper.attributes('data-mk-orientation')).toBe('vertical')
    expect(wrapper.classes()).toContain('mk:flex-col')
    expect(wrapper.classes()).toContain('mk:items-stretch')
    expect(wrapper.classes()).toContain('mk:p-3')
    expect(wrapper.classes()).not.toContain('mk:p-1')
    expect(wrapper.classes()).not.toContain('mk:p-2')
    expect(wrapper.classes()).toContain('custom-group')
  })
})
