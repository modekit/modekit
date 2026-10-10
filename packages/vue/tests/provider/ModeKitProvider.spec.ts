import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import { ModeKitProvider, useThemeConfig } from '../../src/index.js'

const ThemeConsumer = defineComponent({
  setup() {
    const config = useThemeConfig()

    return () =>
      h(
        'output',
        { 'data-testid': 'config' },
        [
          config.value.platform,
          config.value.colorScheme,
          config.value.density,
          config.value.contrast,
        ].join(':'),
      )
  },
})

describe('ModeKitProvider', () => {
  it('provides the default theme config and exposes it as data attributes', () => {
    const wrapper = mount(ModeKitProvider, {
      slots: {
        default: () => h(ThemeConsumer),
      },
    })

    expect(wrapper.attributes()).toMatchObject({
      'data-mk-platform': 'web',
      'data-mk-color-scheme': 'light',
      'data-mk-density': 'comfortable',
      'data-mk-contrast': 'normal',
    })
    expect(wrapper.get('[data-testid="config"]').text()).toBe('web:light:comfortable:normal')
  })

  it('provides reactive theme config from its props', async () => {
    const wrapper = mount(ModeKitProvider, {
      props: {
        platform: 'ios',
        colorScheme: 'dark',
        density: 'compact',
        contrast: 'high',
      },
      slots: {
        default: () => h(ThemeConsumer),
      },
    })

    expect(wrapper.get('[data-testid="config"]').text()).toBe('ios:dark:compact:high')
    expect(wrapper.attributes()).toMatchObject({
      'data-mk-platform': 'ios',
      'data-mk-color-scheme': 'dark',
      'data-mk-density': 'compact',
      'data-mk-contrast': 'high',
    })

    await wrapper.setProps({ platform: 'android' })

    expect(wrapper.get('[data-testid="config"]').text()).toBe('android:dark:compact:high')
    expect(wrapper.attributes('data-mk-platform')).toBe('android')
  })
})

describe('useThemeConfig', () => {
  it('returns the default config outside a provider', () => {
    const wrapper = mount(ThemeConsumer)

    expect(wrapper.get('[data-testid="config"]').text()).toBe('web:light:comfortable:normal')
  })
})
