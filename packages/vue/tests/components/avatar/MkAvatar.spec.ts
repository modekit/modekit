import { mount } from '@vue/test-utils'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import {
  avatarBadgePositions,
  avatarColors,
  avatarSizes,
  createModeKit,
  MkAvatar,
} from '../../../src/index.js'

describe('MkAvatar', () => {
  it('renders a circular native span with secondary fallback content and safe defaults', () => {
    const wrapper = mount(MkAvatar, {
      props: { fallback: 'JD' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('SPAN')
    expect(wrapper.findComponent(AvatarRoot).exists()).toBe(true)
    expect(wrapper.findComponent(AvatarImage).exists()).toBe(false)
    expect(wrapper.findComponent(AvatarFallback).exists()).toBe(true)
    expect(wrapper.attributes('data-mk-color')).toBe('secondary')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-square')).toBeUndefined()
    expect(wrapper.classes()).toContain('mk:size-10')
    expect(wrapper.classes()).toContain('mk:rounded-full')
    expect(wrapper.classes()).toContain('mk:overflow-visible')
    expect(wrapper.findComponent(AvatarFallback).classes()).toContain('mk:overflow-hidden')
    expect(wrapper.findComponent(AvatarFallback).classes()).toContain('mk:rounded-[inherit]')
    expect(wrapper.findComponent(AvatarFallback).classes()).toContain('mk:bg-secondary')
    expect(wrapper.text()).toBe('JD')
  })

  it('renders the Reka image with native loading and request attributes', () => {
    const wrapper = mount(MkAvatar, {
      props: {
        src: '/avatar.svg',
        alt: 'John Doe',
        fallback: 'JD',
        referrerPolicy: 'no-referrer',
        crossOrigin: 'anonymous',
        loading: 'lazy',
        decoding: 'async',
      },
    })
    const image = wrapper.findComponent(AvatarImage)

    expect(image.exists()).toBe(true)
    expect(image.props('src')).toBe('/avatar.svg')
    expect(image.props('referrerPolicy')).toBe('no-referrer')
    expect(image.props('crossOrigin')).toBe('anonymous')
    expect(image.attributes('alt')).toBe('John Doe')
    expect(image.attributes('loading')).toBe('lazy')
    expect(image.attributes('decoding')).toBe('async')
    expect(image.classes()).toContain('mk:object-cover')
  })

  it.each([
    ['xs', 'mk:size-6', 'mk:text-[10px]', 'mk:[&>svg]:size-3'],
    ['sm', 'mk:size-8', 'mk:text-xs', 'mk:[&>svg]:size-4'],
    ['md', 'mk:size-10', 'mk:text-sm', 'mk:[&>svg]:size-5'],
    ['lg', 'mk:size-12', 'mk:text-base', 'mk:[&>svg]:size-6'],
    ['xl', 'mk:size-16', 'mk:text-xl', 'mk:[&>svg]:size-8'],
  ] as const)(
    'resolves the %s size across root, text, and icon fallback',
    (size, rootClass, textClass, iconClass) => {
      const wrapper = mount(MkAvatar, {
        props: { size },
        slots: { default: () => h('svg', { 'data-avatar-icon': '' }) },
      })
      const fallback = wrapper.findComponent(AvatarFallback)

      expect(avatarSizes).toContain(size)
      expect(wrapper.attributes('data-mk-size')).toBe(size)
      expect(wrapper.classes()).toContain(rootClass)
      expect(fallback.classes()).toContain(textClass)
      expect(fallback.classes()).toContain(iconClass)
      expect(wrapper.find('[data-avatar-icon]').exists()).toBe(true)
    },
  )

  it.each([
    ['primary', 'mk:bg-primary', 'mk:text-primary-foreground'],
    ['secondary', 'mk:bg-secondary', 'mk:text-secondary-foreground'],
    ['success', 'mk:bg-success', 'mk:text-success-foreground'],
    ['warning', 'mk:bg-warning', 'mk:text-foreground'],
    ['info', 'mk:bg-info', 'mk:text-info-foreground'],
    ['destructive', 'mk:bg-destructive', 'mk:text-destructive-foreground'],
  ] as const)('resolves the %s fallback color', (color, backgroundClass, foregroundClass) => {
    const wrapper = mount(MkAvatar, {
      props: { color, fallback: 'JD' },
    })
    const fallback = wrapper.findComponent(AvatarFallback)

    expect(avatarColors).toContain(color)
    expect(wrapper.attributes('data-mk-color')).toBe(color)
    expect(fallback.classes()).toContain(backgroundClass)
    expect(fallback.classes()).toContain(foregroundClass)
  })

  it('uses the default slot as custom fallback content without image props', () => {
    const wrapper = mount(MkAvatar, {
      attrs: { 'aria-label': 'Unassigned user' },
      slots: {
        default: () => h('svg', { 'data-avatar-icon': '', 'aria-hidden': 'true' }),
      },
    })

    expect(wrapper.findComponent(AvatarImage).exists()).toBe(false)
    expect(wrapper.findComponent(AvatarFallback).exists()).toBe(true)
    expect(wrapper.find('[data-avatar-icon]').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('Unassigned user')
  })

  it('prefers default slot content over fallback text', () => {
    const wrapper = mount(MkAvatar, {
      props: { fallback: 'JD' },
      slots: { default: '<span data-slot="default">AB</span>' },
    })

    expect(wrapper.find('[data-slot="default"]').text()).toBe('AB')
    expect(wrapper.text()).not.toContain('JD')
  })

  it.each([
    ['xs', 'mk:rounded-sm'],
    ['sm', 'mk:rounded-sm'],
    ['md', 'mk:rounded-md'],
    ['lg', 'mk:rounded-md'],
    ['xl', 'mk:rounded-lg'],
  ] as const)('renders a square %s avatar with the matching radius', (size, radiusClass) => {
    const wrapper = mount(MkAvatar, {
      props: { size, square: true, fallback: 'JD' },
    })

    expect(wrapper.attributes('data-mk-square')).toBe('')
    expect(wrapper.classes()).toContain(radiusClass)
    expect(wrapper.classes()).not.toContain('mk:rounded-full')
  })

  it('renders through the configured root element', () => {
    const wrapper = mount(MkAvatar, {
      props: { as: 'div', fallback: 'MK' },
      attrs: { role: 'img', 'aria-label': 'ModeKit' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('ModeKit')
  })

  it('forwards fallback delay to Reka AvatarFallback', () => {
    const wrapper = mount(MkAvatar, {
      props: { fallback: 'JD', delayMs: 250 },
    })

    expect(wrapper.findComponent(AvatarFallback).props('delayMs')).toBe(250)
  })

  it('forwards Reka image loading status changes', async () => {
    const wrapper = mount(MkAvatar, {
      props: { src: '/avatar.svg', fallback: 'JD' },
    })

    wrapper.findComponent(AvatarImage).vm.$emit('loadingStatusChange', 'loaded')
    await nextTick()

    expect(wrapper.emitted('loadingStatusChange')).toContainEqual(['loaded'])
  })

  it.each([
    ['top-left', 'mk:top-0.5', 'mk:left-0.5'],
    ['top-right', 'mk:top-0.5', 'mk:right-0.5'],
    ['bottom-left', 'mk:bottom-0.5', 'mk:left-0.5'],
    ['bottom-right', 'mk:bottom-0.5', 'mk:right-0.5'],
  ] as const)('positions the status badge at %s', (badgePosition, blockClass, inlineClass) => {
    const wrapper = mount(MkAvatar, {
      props: {
        badge: true,
        badgePosition,
        color: 'destructive',
        badgeColor: 'success',
        fallback: 'JD',
      },
    })
    const badge = wrapper.find('.mk-avatar__badge')

    expect(avatarBadgePositions).toContain(badgePosition)
    expect(wrapper.attributes('data-mk-color')).toBe('destructive')
    expect(wrapper.attributes('data-mk-badge-color')).toBe('success')
    expect(wrapper.attributes('data-mk-badge-position')).toBe(badgePosition)
    expect(wrapper.findComponent(AvatarFallback).classes()).toContain('mk:bg-destructive')
    expect(badge.exists()).toBe(true)
    expect(badge.attributes('aria-hidden')).toBe('true')
    expect(badge.classes()).toContain(blockClass)
    expect(badge.classes()).toContain(inlineClass)
    expect(badge.classes()).toContain('mk:bg-success')
  })

  it('does not render a badge unless enabled', () => {
    const wrapper = mount(MkAvatar, {
      props: { fallback: 'JD' },
    })

    expect(wrapper.find('.mk-avatar__badge').exists()).toBe(false)
    expect(wrapper.attributes('data-mk-badge-color')).toBeUndefined()
    expect(wrapper.attributes('data-mk-badge-position')).toBeUndefined()
  })

  it('merges local slot and native root classes after the recipe', () => {
    const wrapper = mount(MkAvatar, {
      props: {
        fallback: 'JD',
        badge: true,
        ui: {
          base: 'ring-2',
          fallback: 'font-bold',
          badge: 'outline',
        },
        class: 'team-avatar',
      },
    })

    expect(wrapper.classes()).toContain('ring-2')
    expect(wrapper.classes()).toContain('team-avatar')
    expect(wrapper.findComponent(AvatarFallback).classes()).toContain('font-bold')
    expect(wrapper.attributes('data-mk-badge-color')).toBe('success')
    expect(wrapper.find('.mk-avatar__badge').classes()).toContain('mk:bg-success')
    expect(wrapper.find('.mk-avatar__badge').classes()).toContain('outline')
  })

  it('applies global root, slot, variant, and default overrides', () => {
    const wrapper = mount(MkAvatar, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              avatar: {
                base: 'ring-1',
                slots: {
                  image: 'grayscale',
                  fallback: 'tracking-wide',
                  badge: 'border',
                },
                variants: {
                  color: {
                    info: 'text-info',
                  },
                  badgeColor: {
                    warning: 'shadow-sm',
                  },
                  size: {
                    xl: 'ring-4',
                  },
                  square: {
                    true: 'outline',
                  },
                  badgePosition: {
                    'top-left': 'm-0.5',
                  },
                },
                defaultVariants: {
                  color: 'info',
                  badgeColor: 'warning',
                  size: 'xl',
                  square: true,
                  badgePosition: 'top-left',
                },
              },
            },
          }),
        ],
      },
      props: {
        src: '/avatar.svg',
        fallback: 'JD',
        badge: true,
      },
    })

    expect(wrapper.attributes('data-mk-color')).toBe('info')
    expect(wrapper.attributes('data-mk-badge-color')).toBe('warning')
    expect(wrapper.attributes('data-mk-size')).toBe('xl')
    expect(wrapper.attributes('data-mk-square')).toBe('')
    expect(wrapper.attributes('data-mk-badge-position')).toBe('top-left')
    expect(wrapper.classes()).toContain('mk:size-16')
    expect(wrapper.classes()).toContain('text-info')
    expect(wrapper.classes()).not.toContain('ring-1')
    expect(wrapper.classes()).toContain('ring-4')
    expect(wrapper.classes()).toContain('outline')
    expect(wrapper.findComponent(AvatarImage).classes()).toContain('grayscale')
    expect(wrapper.findComponent(AvatarFallback).classes()).toContain('tracking-wide')
    expect(wrapper.find('.mk-avatar__badge').classes()).toContain('mk:bg-warning')
    expect(wrapper.find('.mk-avatar__badge').classes()).toContain('border')
    expect(wrapper.find('.mk-avatar__badge').classes()).toContain('shadow-sm')
    expect(wrapper.find('.mk-avatar__badge').classes()).toContain('m-0.5')
  })
})
