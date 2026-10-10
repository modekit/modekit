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
  it('provides the default theme config without adding a wrapper element', () => {
    const wrapper = mount(ModeKitProvider, {
      slots: {
        default: () => h(ThemeConsumer),
      },
    })

    expect(wrapper.html()).toBe(
      '<output data-testid="config">web:light:comfortable:normal</output>',
    )
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

    await wrapper.setProps({ platform: 'android' })

    expect(wrapper.get('[data-testid="config"]').text()).toBe('android:dark:compact:high')
  })
})

describe('useThemeConfig', () => {
  it('returns the default config outside a provider', () => {
    const wrapper = mount(ThemeConsumer)

    expect(wrapper.get('[data-testid="config"]').text()).toBe('web:light:comfortable:normal')
  })
})
