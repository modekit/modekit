import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

describe('Vue test environment', () => {
  it('mounts a Vue component in the DOM', () => {
    const Example = defineComponent({
      setup() {
        return () => h('span', { 'data-testid': 'content' }, 'ModeKit')
      },
    })
    const wrapper = mount(Example)

    expect(wrapper.get('[data-testid="content"]').text()).toBe('ModeKit')
  })
})
