import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { createModeKit, labelSizes, MkLabel } from '../../../src/index.js'

describe('MkLabel', () => {
  it('renders a Reka UI label with safe defaults and native attributes', () => {
    const wrapper = mount(MkLabel, {
      props: {
        for: 'email',
        title: 'Email address',
      },
      slots: { default: 'Email' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('LABEL')
    expect(wrapper.attributes('for')).toBe('email')
    expect(wrapper.attributes('title')).toBe('Email address')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mk-label', 'mk:text-sm', 'mk:leading-5', 'mk:text-neutral-950']),
    )
    expect(wrapper.text()).toBe('Email')
  })

  it('adds a visual required marker without changing the accessible name', () => {
    const wrapper = mount(MkLabel, {
      props: { for: 'name', required: true },
      slots: { default: 'Name' },
    })
    const marker = wrapper.get('.mk-label__required')

    expect(wrapper.attributes('data-required')).toBe('')
    expect(marker.attributes('aria-hidden')).toBe('true')
    expect(marker.classes()).toContain('mk:text-red-700')
    expect(marker.classes()).toContain('mk:dark:text-red-400')
    expect(marker.text()).toBe('*')
  })

  it('exposes disabled presentation without inventing label semantics', () => {
    const wrapper = mount(MkLabel, {
      props: { disabled: true },
      slots: { default: 'Unavailable' },
    })

    expect(wrapper.attributes('data-disabled')).toBe('')
    expect(wrapper.classes()).toContain('mk:data-[disabled]:cursor-not-allowed')
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it.each([
    ['sm', 'mk:text-xs', 'mk:leading-4'],
    ['md', 'mk:text-sm', 'mk:leading-5'],
    ['lg', 'mk:text-base', 'mk:leading-6'],
  ] as const)('resolves the %s size', (size, text, leading) => {
    const wrapper = mount(MkLabel, { props: { size }, slots: { default: 'Label' } })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([text, leading]))
  })

  it('combines global, local, and native classes after its built-in recipe', () => {
    const wrapper = mount(MkLabel, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              label: {
                base: 'tracking-wide',
                slots: { requiredIndicator: 'font-bold' },
                variants: { size: { lg: 'uppercase' } },
                defaultVariants: { size: 'lg' },
              },
            },
          }),
        ],
      },
      props: {
        required: true,
        ui: { base: 'text-balance', requiredIndicator: 'select-none' },
        class: 'block',
      },
      slots: { default: 'Configured label' },
    })

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk:text-base',
        'tracking-wide',
        'uppercase',
        'text-balance',
        'block',
      ]),
    )
    expect(wrapper.get('.mk-label__required').classes()).toEqual(
      expect.arrayContaining(['font-bold', 'select-none']),
    )
  })

  it('exports the finite size contract', () => {
    expect(labelSizes).toEqual(['sm', 'md', 'lg'])
  })
})
