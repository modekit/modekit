import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import {
  createModeKit,
  flexAlignments,
  flexContentAlignments,
  flexDirections,
  flexDisplays,
  flexJustifications,
  flexSelfAlignments,
  flexSpacePresets,
  flexWraps,
  MkFlex,
} from '../../../src/index.js'

function items() {
  return ['One', 'Two', 'Three'].map((item) => h('div', { key: item }, item))
}

function rootStyle(wrapper: ReturnType<typeof mount>): CSSStyleDeclaration {
  return (wrapper.element as HTMLElement).style
}

describe('MkFlex', () => {
  it('renders a row flex container with native initial behavior', () => {
    const wrapper = mount(MkFlex, { slots: { default: () => items() } })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk-flex',
        'mk:flex',
        'mk:flex-row',
        'mk:flex-nowrap',
        'mk:items-stretch',
        'mk:justify-start',
        'mk:content-stretch',
      ]),
    )
    expect(wrapper.attributes('data-mk-direction')).toBe('row')
    expect(wrapper.attributes('data-mk-wrap')).toBe('nowrap')
    expect(rootStyle(wrapper).rowGap).toBe('0px')
    expect(rootStyle(wrapper).columnGap).toBe('0px')
    expect((wrapper.element as HTMLElement).children).toHaveLength(3)
  })

  it('controls both axes, wrapping, and display independently', () => {
    const wrapper = mount(MkFlex, {
      props: {
        align: 'baseline',
        alignContent: 'space-between',
        direction: 'column-reverse',
        display: 'inline-flex',
        justify: 'space-evenly',
        wrap: 'wrap-reverse',
      },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk:inline-flex',
        'mk:flex-col-reverse',
        'mk:flex-wrap-reverse',
        'mk:items-baseline',
        'mk:justify-evenly',
        'mk:content-between',
      ]),
    )
    expect(wrapper.attributes('data-mk-align')).toBe('baseline')
    expect(wrapper.attributes('data-mk-align-content')).toBe('space-between')
    expect(wrapper.attributes('data-mk-justify')).toBe('space-evenly')
  })

  it('resolves preset, numeric, and axis-specific gaps', () => {
    const preset = mount(MkFlex, { props: { gap: 'm' } })
    const numeric = mount(MkFlex, { props: { gap: 10 } })
    const axes = mount(MkFlex, { props: { gap: ['s', 20] } })

    expect(rootStyle(preset).rowGap).toBe('0.75rem')
    expect(rootStyle(preset).columnGap).toBe('0.75rem')
    expect(rootStyle(numeric).rowGap).toBe('10px')
    expect(rootStyle(numeric).columnGap).toBe('10px')
    expect(rootStyle(axes).rowGap).toBe('0.5rem')
    expect(rootStyle(axes).columnGap).toBe('20px')
  })

  it('supports keyword, ratio, and explicit flex shorthands', () => {
    const keyword = mount(MkFlex, { props: { flex: 'auto' } })
    const ratio = mount(MkFlex, { props: { flex: 2 } })
    const explicit = mount(MkFlex, { props: { flex: [2, 1, 'xl'] } })

    expect(rootStyle(keyword).flex).toBe('1 1 auto')
    expect(rootStyle(ratio).flex).toBe('2 1 0%')
    expect(rootStyle(explicit).flex).toBe('2 1 1.5rem')
  })

  it('maps flex-item longhands, order, and self-alignment', () => {
    const wrapper = mount(MkFlex, {
      props: {
        alignSelf: 'center',
        flex: 'initial',
        flexBasis: 240,
        flexGrow: 3,
        flexShrink: 0,
        order: -1,
      },
    })
    const style = rootStyle(wrapper)

    expect(style.alignSelf).toBe('center')
    expect(style.flex).toBe('3 0 240px')
    expect(style.flexBasis).toBe('240px')
    expect(style.flexGrow).toBe('3')
    expect(style.flexShrink).toBe('0')
    expect(style.order).toBe('-1')
  })

  it('forwards native attributes and supports a polymorphic root', () => {
    const wrapper = mount(MkFlex, {
      props: { as: 'nav', gap: 8 },
      attrs: {
        id: 'primary-actions',
        class: 'custom-flex',
        style: { columnGap: '24px' },
        'aria-label': 'Primary actions',
      },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('NAV')
    expect(wrapper.attributes('id')).toBe('primary-actions')
    expect(wrapper.attributes('aria-label')).toBe('Primary actions')
    expect(wrapper.classes()).toContain('custom-flex')
    expect(rootStyle(wrapper).rowGap).toBe('8px')
    expect(rootStyle(wrapper).columnGap).toBe('24px')
  })

  it('applies global defaults and resolves class overrides in order', () => {
    const wrapper = mount(MkFlex, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              flex: {
                base: 'mk:p-1',
                variants: {
                  align: { center: 'configured-align' },
                  justify: { 'space-between': 'configured-justify' },
                },
                defaultVariants: {
                  align: 'center',
                  direction: 'column',
                  display: 'inline-flex',
                  justify: 'space-between',
                  wrap: 'wrap',
                },
              },
            },
          }),
        ],
      },
      props: { ui: { base: 'mk:p-2' } },
      attrs: { class: 'mk:p-3 custom-flex' },
    })

    expect(wrapper.attributes('data-mk-align')).toBe('center')
    expect(wrapper.attributes('data-mk-direction')).toBe('column')
    expect(wrapper.attributes('data-mk-display')).toBe('inline-flex')
    expect(wrapper.attributes('data-mk-justify')).toBe('space-between')
    expect(wrapper.attributes('data-mk-wrap')).toBe('wrap')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk:inline-flex',
        'mk:flex-col',
        'mk:flex-wrap',
        'configured-align',
        'configured-justify',
        'mk:p-3',
        'custom-flex',
      ]),
    )
    expect(wrapper.classes()).not.toContain('mk:p-1')
    expect(wrapper.classes()).not.toContain('mk:p-2')
  })

  it('exports every finite Flex axis contract', () => {
    expect(flexAlignments).toEqual(['start', 'center', 'baseline', 'end', 'stretch'])
    expect(flexContentAlignments).toEqual([
      'start',
      'center',
      'end',
      'space-between',
      'space-around',
      'space-evenly',
      'stretch',
    ])
    expect(flexDirections).toEqual(['row', 'row-reverse', 'column', 'column-reverse'])
    expect(flexDisplays).toEqual(['none', 'flex', 'inline-flex'])
    expect(flexJustifications).toEqual([
      'start',
      'center',
      'end',
      'space-between',
      'space-around',
      'space-evenly',
    ])
    expect(flexSelfAlignments).toEqual(['auto', 'start', 'center', 'baseline', 'end', 'stretch'])
    expect(flexSpacePresets).toEqual(['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'])
    expect(flexWraps).toEqual(['nowrap', 'wrap', 'wrap-reverse'])
  })
})
