import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import {
  createModeKit,
  MkTextarea,
  textareaResizeModes,
  textareaSizes,
  textareaVariants,
} from '../../../src/index.js'

describe('MkTextarea', () => {
  it('renders one native textarea and forwards practical native attributes', () => {
    const wrapper = mount(MkTextarea, {
      props: {
        id: 'summary',
        name: 'summary',
        placeholder: 'Describe the change',
        rows: 5,
        cols: 40,
        minlength: 10,
        maxlength: 240,
        wrap: 'soft',
        autocomplete: 'off',
      },
    })
    const textarea = wrapper.get('textarea')

    expect(wrapper.findAll('textarea')).toHaveLength(1)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk-textarea',
        'mk:border-neutral-300',
        'mk:bg-white',
        'mk:rounded-lg',
      ]),
    )
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-variant')).toBe('outline')
    expect(wrapper.attributes('data-mk-resize')).toBe('vertical')
    expect(textarea.attributes()).toEqual(
      expect.objectContaining({
        id: 'summary',
        name: 'summary',
        placeholder: 'Describe the change',
        rows: '5',
        cols: '40',
        minlength: '10',
        maxlength: '240',
        wrap: 'soft',
        autocomplete: 'off',
      }),
    )
    expect(textarea.classes()).toEqual(
      expect.arrayContaining([
        'mk-textarea__control',
        'mk:w-full',
        'mk:px-3',
        'mk:py-2.5',
        'mk:resize-none',
        'mk:placeholder:text-neutral-600/60',
      ]),
    )
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mk:resize-y', 'mk:overflow-hidden']))
  })

  it('renders and updates a controlled value as a string', async () => {
    const wrapper = mount(MkTextarea, { props: { modelValue: 'Initial' } })
    const textarea = wrapper.get('textarea')

    expect((textarea.element as HTMLTextAreaElement).value).toBe('Initial')

    await textarea.setValue('Updated')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Updated']])
    await wrapper.setProps({ modelValue: 'Confirmed' })
    expect((textarea.element as HTMLTextAreaElement).value).toBe('Confirmed')
  })

  it('supports browser-owned uncontrolled values and native value fallback', async () => {
    const withDefault = mount(MkTextarea, { props: { defaultValue: 'Draft' } })
    const withValue = mount(MkTextarea, { attrs: { value: 'Attribute value' } })

    await withDefault.get('textarea').setValue('Edited')

    expect((withDefault.get('textarea').element as HTMLTextAreaElement).value).toBe('Edited')
    expect(withDefault.emitted('update:modelValue')).toEqual([['Edited']])
    expect((withValue.get('textarea').element as HTMLTextAreaElement).value).toBe('Attribute value')
  })

  it('restores an uncontrolled initial value when its external form resets', async () => {
    const wrapper = mount(MkTextarea, {
      props: { defaultValue: 'Initial', form: 'profile' },
      attachTo: document.body,
    })
    const form = document.createElement('form')
    form.id = 'profile'
    document.body.append(form)
    await wrapper.vm.$nextTick()
    const textarea = wrapper.get('textarea')

    await textarea.setValue('Changed')
    form.reset()
    await wrapper.vm.$nextTick()

    expect((textarea.element as HTMLTextAreaElement).value).toBe('Initial')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Changed']])

    wrapper.unmount()
    form.remove()
  })

  it('waits for IME composition before updating while preserving native listeners', async () => {
    const onInput = vi.fn()
    const onCompositionstart = vi.fn()
    const onCompositionend = vi.fn()
    const wrapper = mount(MkTextarea, {
      attrs: { onInput, onCompositionstart, onCompositionend },
    })
    const textarea = wrapper.get('textarea')

    await textarea.trigger('compositionstart')
    ;(textarea.element as HTMLTextAreaElement).value = '途中'
    await textarea.trigger('input', { isComposing: true })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(onInput).toHaveBeenCalledOnce()

    await textarea.trigger('compositionend')

    expect(wrapper.emitted('update:modelValue')).toEqual([['途中']])
    expect(onCompositionstart).toHaveBeenCalledOnce()
    expect(onCompositionend).toHaveBeenCalledOnce()
  })

  it('preserves native input, focus, blur, change, and key listeners', async () => {
    const onInput = vi.fn()
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const onChange = vi.fn()
    const onKeydown = vi.fn()
    const wrapper = mount(MkTextarea, {
      attrs: { onInput, onFocus, onBlur, onChange, onKeydown },
    })
    const textarea = wrapper.get('textarea')

    await textarea.trigger('focus')
    ;(textarea.element as HTMLTextAreaElement).value = 'Notes'
    await textarea.trigger('input')
    await textarea.trigger('change')
    await textarea.trigger('keydown', { key: 'Enter' })
    await textarea.trigger('blur')

    expect(onInput).toHaveBeenCalledOnce()
    expect(onFocus).toHaveBeenCalledOnce()
    expect(onBlur).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledOnce()
    expect(onKeydown).toHaveBeenCalledOnce()
  })

  it('forwards disabled, readonly, required, and invalid states to the native control', () => {
    const wrapper = mount(MkTextarea, {
      props: { disabled: true, readonly: true, required: true, invalid: true },
    })
    const textarea = wrapper.get('textarea')

    expect(wrapper.attributes('data-mk-disabled')).toBe('')
    expect(wrapper.attributes('data-mk-readonly')).toBe('')
    expect(wrapper.attributes('data-mk-invalid')).toBe('')
    expect(textarea.attributes('disabled')).toBeDefined()
    expect(textarea.attributes('readonly')).toBeDefined()
    expect(textarea.attributes('required')).toBeDefined()
    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('preserves an explicit aria-invalid value and reflects it on the visual root', () => {
    const wrapper = mount(MkTextarea, { props: { 'aria-invalid': 'spelling' } })

    expect(wrapper.attributes('data-mk-invalid')).toBe('')
    expect(wrapper.get('textarea').attributes('aria-invalid')).toBe('spelling')
  })

  it.each([
    ['sm', 'mk:rounded-md', 'mk:px-2.5', 'mk:py-2', 'mk:text-sm'],
    ['md', 'mk:rounded-lg', 'mk:px-3', 'mk:py-2.5', 'mk:text-sm'],
    ['lg', 'mk:rounded-xl', 'mk:px-4', 'mk:py-3', 'mk:text-base'],
  ] as const)(
    'resolves the %s size across the surface and control',
    (size, radius, px, py, text) => {
      const wrapper = mount(MkTextarea, { props: { size } })
      const textarea = wrapper.get('textarea')

      expect(wrapper.attributes('data-mk-size')).toBe(size)
      expect(wrapper.classes()).toContain(radius)
      expect(textarea.classes()).toEqual(expect.arrayContaining([px, py, text]))
    },
  )

  it.each([
    ['outline', ['mk:border-neutral-300', 'mk:bg-white']],
    ['soft', ['mk:border-0', 'mk:bg-neutral-100']],
    ['subtle', ['mk:border-neutral-200', 'mk:bg-neutral-100/50']],
    ['ghost', ['mk:border-0', 'mk:bg-transparent', 'mk:hover:bg-neutral-100/50']],
    ['plain', ['mk:border-0', 'mk:bg-transparent']],
  ] as const)('renders the %s chrome variant', (variant, classes) => {
    const wrapper = mount(MkTextarea, { props: { variant } })

    expect(wrapper.attributes('data-mk-variant')).toBe(variant)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([...classes]))

    if (variant === 'plain') {
      expect(
        wrapper.classes().some((className) => className.includes('has-focus-visible:outline')),
      ).toBe(false)
    } else {
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining([
          'mk:outline-2',
          'mk:outline-solid',
          'mk:outline-offset-2',
          'mk:outline-transparent',
          'mk:transition-[border-color,outline-color]',
          'mk:has-focus-visible:outline-primary',
          'mk:motion-reduce:transition-none',
        ]),
      )
    }
  })

  it.each([
    ['none', 'mk:resize-none', false],
    ['vertical', 'mk:resize-y', true],
    ['horizontal', 'mk:resize-x', true],
    ['both', 'mk:resize', true],
  ] as const)('applies the %s resize mode to the complete surface', (resize, className, clips) => {
    const wrapper = mount(MkTextarea, { props: { resize } })

    expect(wrapper.attributes('data-mk-resize')).toBe(resize)
    expect(wrapper.classes()).toContain(className)
    expect(wrapper.classes().includes('mk:overflow-hidden')).toBe(clips)
    expect(wrapper.get('textarea').classes()).toContain('mk:resize-none')
  })

  it('merges global, local, slot, and native class overrides in order', () => {
    const wrapper = mount(MkTextarea, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              textarea: {
                base: 'mk:border-2',
                slots: { textarea: 'mk:font-medium' },
                variants: {
                  size: { lg: 'mk:rounded-2xl' },
                  variant: { soft: 'mk:shadow-raised' },
                  resize: { none: 'mk:cursor-default' },
                },
                defaultVariants: { size: 'lg', variant: 'soft', resize: 'none' },
              },
            },
          }),
        ],
      },
      props: {
        ui: { base: 'mk:bg-white', textarea: 'mk:text-primary' },
        class: 'mk:rounded-none',
      },
    })
    const textarea = wrapper.get('textarea')

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-variant')).toBe('soft')
    expect(wrapper.attributes('data-mk-resize')).toBe('none')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk:border-2',
        'mk:shadow-raised',
        'mk:cursor-default',
        'mk:bg-white',
        'mk:rounded-none',
      ]),
    )
    expect(wrapper.classes()).not.toContain('mk:rounded-xl')
    expect(textarea.classes()).toEqual(
      expect.arrayContaining(['mk:font-medium', 'mk:text-primary']),
    )
    expect(textarea.classes()).not.toContain('mk:text-neutral-950')
  })

  it('applies native style to the visual surface and exposes finite contracts', () => {
    const wrapper = mount(MkTextarea, { props: { style: 'width: 20rem' } })

    expect(wrapper.attributes('style')).toContain('width: 20rem')
    expect(wrapper.get('textarea').attributes('style')).toBeUndefined()
    expect(textareaResizeModes).toEqual(['none', 'vertical', 'horizontal', 'both'])
    expect(textareaSizes).toEqual(['sm', 'md', 'lg'])
    expect(textareaVariants).toEqual(['outline', 'soft', 'subtle', 'ghost', 'plain'])
  })
})
