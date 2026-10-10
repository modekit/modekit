import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { MkButton } from '../../../src/index.js'

describe('MkButton', () => {
  it('renders a native button with safe defaults', () => {
    const wrapper = mount(MkButton, {
      slots: { default: 'Save' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('data-mk-variant')).toBe('primary')
    expect(wrapper.text()).toBe('Save')
  })

  it('forwards native button attributes and events', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MkButton, {
      props: {
        'aria-label': 'Save changes',
        name: 'intent',
        value: 'save',
        type: 'submit',
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-label')).toBe('Save changes')
    expect(wrapper.attributes('name')).toBe('intent')
    expect(wrapper.attributes('value')).toBe('save')
    expect(wrapper.attributes('type')).toBe('submit')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('becomes busy and non-interactive while loading', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MkButton, {
      props: { loading: true, onClick },
      slots: {
        loader: '<span>Loading</span>',
        default: 'Save',
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('data-mk-loading')).toBe('')
    expect(wrapper.text()).toBe('LoadingSave')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('casts native boolean attributes written in templates', () => {
    const wrapper = mount(
      defineComponent({
        components: { MkButton },
        template: '<MkButton disabled>Disabled</MkButton>',
      }),
    )

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('renders content slots in their documented order', () => {
    const wrapper = mount(MkButton, {
      slots: {
        leading: '<span>Before</span>',
        default: '<span>Label</span>',
        trailing: '<span>After</span>',
      },
    })

    expect(wrapper.text()).toBe('BeforeLabelAfter')
  })

  it('preserves consumer classes and local token overrides', () => {
    const wrapper = mount(MkButton, {
      props: {
        class: 'checkout-action',
        style: '--mk-button-height: 3rem',
      },
    })

    expect(wrapper.classes()).toEqual(['mk-button', 'checkout-action'])
    expect(wrapper.attributes('style')).toContain('--mk-button-height: 3rem')
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<Parameters<typeof MkButton>[0]['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkButton>[0]['form']>().toEqualTypeOf<string | undefined>()
  })
})
