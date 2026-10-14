import { h } from 'vue'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { MkCard, MkCardEdge } from '../../../src/components/card/index.js'
import type { CardEdgeProps } from '../../../src/components/card/types.js'
import { createModeKit } from '../../../src/config/createModeKit.js'

describe('MkCardEdge', () => {
  it('renders content through a neutral div with edge-aware classes', () => {
    const wrapper = mount(MkCardEdge, {
      attrs: {
        id: 'cover-media',
        'aria-label': 'Cover media',
      },
      slots: {
        default: '<img alt="Mountain lake" src="/mountain-lake.jpg">',
      },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('id')).toBe('cover-media')
    expect(wrapper.attributes('aria-label')).toBe('Cover media')
    expect(wrapper.get('img').attributes('alt')).toBe('Mountain lake')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk-card-edge',
        'mk:overflow-hidden',
        'mk:-mx-[var(--mk-card-edge-inline)]',
        'mk:first:-mt-[var(--mk-card-edge-block-start)]',
        'mk:first:rounded-t-[var(--mk-card-edge-radius-start)]',
        'mk:last:-mb-[var(--mk-card-edge-block-end)]',
        'mk:last:rounded-b-[var(--mk-card-edge-radius-end)]',
      ]),
    )
  })

  it('supports polymorphic roots', () => {
    const wrapper = mount(MkCardEdge, {
      props: { as: 'figure' },
      slots: { default: 'Media' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('FIGURE')
    expect(wrapper.text()).toBe('Media')
  })

  it('inherits root and inset-panel edge metrics from Card', () => {
    const wrapper = mount({
      render: () =>
        h(
          MkCard,
          { body: 'inset', size: 'md' },
          { default: () => h(MkCardEdge, null, { default: () => 'Media' }) },
        ),
    })

    const card = wrapper.get('.mk-card')
    const body = wrapper.get('.mk-card__body')

    expect((card.element as HTMLElement).style.getPropertyValue('--mk-card-root-padding')).toBe(
      '1.5rem',
    )
    expect((card.element as HTMLElement).style.getPropertyValue('--mk-card-root-radius')).toBe(
      '0.75rem',
    )
    expect((body.element as HTMLElement).style.getPropertyValue('--mk-card-edge-inline')).toBe(
      '1.25rem',
    )
    expect(
      (body.element as HTMLElement).style.getPropertyValue('--mk-card-edge-radius-start'),
    ).toBe('0.5rem')
  })

  it('uses the flush panel radius as the nearest visible edge', () => {
    const wrapper = mount({
      render: () =>
        h(
          MkCard,
          { body: 'flush', size: 'lg' },
          { default: () => h(MkCardEdge, null, { default: () => 'Media' }) },
        ),
    })
    const body = wrapper.get('.mk-card__body')

    expect((body.element as HTMLElement).style.getPropertyValue('--mk-card-edge-inline')).toBe(
      '1.5rem',
    )
    expect(
      (body.element as HTMLElement).style.getPropertyValue('--mk-card-edge-radius-start'),
    ).toBe('1rem')
  })

  it('derives seamless vertical reach from the body position in Card', () => {
    const wrapper = mount({
      render: () =>
        h(
          MkCard,
          { size: 'sm' },
          {
            default: () => h(MkCardEdge, null, { default: () => 'Media' }),
            footer: () => 'Footer',
          },
        ),
    })
    const body = wrapper.get('.mk-card__body')

    expect((body.element as HTMLElement).style.getPropertyValue('--mk-card-edge-inline')).toBe('')
    expect(body.classes()).toEqual(
      expect.arrayContaining([
        'mk:[--mk-card-edge-inline:var(--mk-card-root-padding)]',
        'mk:first:[--mk-card-edge-block-start:var(--mk-card-root-padding)]',
        'mk:last:[--mk-card-edge-block-end:var(--mk-card-root-padding)]',
      ]),
    )
  })

  it('merges global, local, and native classes', () => {
    const wrapper = mount(MkCardEdge, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              cardEdge: {
                base: 'edge-global',
              },
            },
          }),
        ],
      },
      props: {
        ui: { base: 'edge-local' },
        class: 'edge-consumer',
      },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['edge-global', 'edge-local', 'edge-consumer']),
    )
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<CardEdgeProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<CardEdgeProps['as']>().not.toBeNever()
  })
})
