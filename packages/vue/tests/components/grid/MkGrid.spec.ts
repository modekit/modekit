import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import { createModeKit, MkGrid } from '../../../src/index.js'

function items() {
  return ['One', 'Two', 'Three'].map((item) => h('div', { key: item }, item))
}

function rootStyle(wrapper: ReturnType<typeof mount>): CSSStyleDeclaration {
  return (wrapper.element as HTMLElement).style
}

describe('MkGrid', () => {
  it('renders a one-column Grid with stable defaults', () => {
    const wrapper = mount(MkGrid, { slots: { default: () => items() } })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mk-grid', 'mk:grid', 'mk:items-stretch']),
    )
    expect(wrapper.attributes('data-mk-align')).toBe('stretch')
    expect(wrapper.attributes('data-mk-columns')).toBe('1')
    expect(wrapper.attributes('data-mk-display')).toBe('grid')
    expect(rootStyle(wrapper).gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))')
    expect(rootStyle(wrapper).rowGap).toBe('0px')
    expect(rootStyle(wrapper).columnGap).toBe('0px')
    expect(rootStyle(wrapper).margin).toBe('0px')
    expect((wrapper.element as HTMLElement).children).toHaveLength(3)
  })

  it('creates equal fixed columns', () => {
    const wrapper = mount(MkGrid, {
      props: { columns: 3 },
      slots: { default: () => items() },
    })

    expect(wrapper.attributes('data-mk-columns')).toBe('3')
    expect(rootStyle(wrapper).gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))')
  })

  it('creates responsive auto-fit columns from a minimum width', () => {
    const wrapper = mount(MkGrid, {
      props: { columns: 6, minColWidth: 240 },
      slots: { default: () => items() },
    })

    expect(wrapper.attributes('data-mk-columns')).toBeUndefined()
    expect(wrapper.attributes('data-mk-min-col-width')).toBe('240')
    expect(rootStyle(wrapper).gridTemplateColumns).toBe('repeat(auto-fit, minmax(240px, 1fr))')
  })

  it('resolves preset, numeric, and axis-specific gaps', () => {
    const preset = mount(MkGrid, { props: { gap: 'm' } })
    const numeric = mount(MkGrid, { props: { gap: 10 } })
    const axes = mount(MkGrid, { props: { gap: ['s', 20] } })

    expect(rootStyle(preset).rowGap).toBe('0.75rem')
    expect(rootStyle(preset).columnGap).toBe('0.75rem')
    expect(rootStyle(numeric).rowGap).toBe('10px')
    expect(rootStyle(numeric).columnGap).toBe('10px')
    expect(rootStyle(axes).rowGap).toBe('0.5rem')
    expect(rootStyle(axes).columnGap).toBe('20px')
  })

  it('controls display and cross-axis alignment', () => {
    const wrapper = mount(MkGrid, {
      props: { align: 'baseline', display: 'inline-grid' },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mk:inline-grid', 'mk:items-baseline']),
    )
    expect(wrapper.attributes('data-mk-align')).toBe('baseline')
    expect(wrapper.attributes('data-mk-display')).toBe('inline-grid')
  })

  it('supports special container margins and logical spacing props', () => {
    const wrapper = mount(MkGrid, {
      props: {
        margin: 'auto-inline',
        marginBlock: 's',
        padding: 'system',
        paddingInlineEnd: 12,
      },
    })

    expect(rootStyle(wrapper).marginInline).toBe('1rem')
    expect(rootStyle(wrapper).marginBlock).toBe('0.5rem')
    expect(rootStyle(wrapper).padding).toBe('1rem')
    expect(rootStyle(wrapper).paddingInlineEnd).toBe('12px')
  })

  it('maps sizing, positioning, overflow, flex, and self-alignment props', () => {
    const wrapper = mount(MkGrid, {
      props: {
        alignSelf: 'center',
        blockSize: 320,
        flexBasis: '50%',
        flexGrow: 1,
        flexShrink: 0,
        inlineSize: '100%',
        insetInlineStart: 'm',
        justifySelf: 'end',
        maxInlineSize: '64rem',
        minBlockSize: 'min-content',
        overflow: 'hidden',
        overflowBlock: 'auto',
        overflowInline: 'scroll',
        position: 'relative',
      },
    })
    const style = rootStyle(wrapper)

    expect(style.alignSelf).toBe('center')
    expect(style.blockSize).toBe('320px')
    expect(style.flexBasis).toBe('50%')
    expect(style.flexGrow).toBe('1')
    expect(style.flexShrink).toBe('0')
    expect(style.inlineSize).toBe('100%')
    expect(style.insetInlineStart).toBe('0.75rem')
    expect(style.justifySelf).toBe('end')
    expect(style.maxInlineSize).toBe('64rem')
    expect(style.minBlockSize).toBe('min-content')
    expect(style.overflow).toBe('hidden')
    expect(wrapper.attributes('style')).toContain('overflow-block: auto')
    expect(wrapper.attributes('style')).toContain('overflow-inline: scroll')
    expect(style.position).toBe('relative')
  })

  it('forwards native attributes and supports a polymorphic root', () => {
    const wrapper = mount(MkGrid, {
      props: { as: 'section', gap: 8 },
      attrs: {
        id: 'dashboard-grid',
        class: 'custom-grid',
        style: { rowGap: '24px' },
        'aria-label': 'Dashboard widgets',
      },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('SECTION')
    expect(wrapper.attributes('id')).toBe('dashboard-grid')
    expect(wrapper.attributes('aria-label')).toBe('Dashboard widgets')
    expect(wrapper.classes()).toContain('custom-grid')
    expect(rootStyle(wrapper).rowGap).toBe('24px')
    expect(rootStyle(wrapper).columnGap).toBe('8px')
  })

  it('applies global defaults and resolves class overrides in order', () => {
    const wrapper = mount(MkGrid, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              grid: {
                base: 'mk:p-1',
                variants: {
                  align: { center: 'mk:place-items-center' },
                  display: { 'inline-grid': 'configured-inline-grid' },
                },
                defaultVariants: {
                  align: 'center',
                  display: 'inline-grid',
                },
              },
            },
          }),
        ],
      },
      props: { ui: { base: 'mk:p-2' } },
      attrs: { class: 'mk:p-3 custom-grid' },
    })

    expect(wrapper.attributes('data-mk-align')).toBe('center')
    expect(wrapper.attributes('data-mk-display')).toBe('inline-grid')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk:inline-grid',
        'mk:items-center',
        'mk:place-items-center',
        'configured-inline-grid',
        'mk:p-3',
        'custom-grid',
      ]),
    )
    expect(wrapper.classes()).not.toContain('mk:p-1')
    expect(wrapper.classes()).not.toContain('mk:p-2')
  })
})
