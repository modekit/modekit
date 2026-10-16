import { mount } from '@vue/test-utils'
import { h, Teleport, type App, type ObjectPlugin } from 'vue'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  createModeKit,
  type ModeKitNeutralColor,
  type ModeKitOptions,
  type ModeKitPrimaryColor,
} from '../../src/index.js'

function installModeKit(options: ModeKitOptions): void {
  const app = {} as App
  const plugin = createModeKit(options) as ObjectPlugin
  app.provide = () => app

  plugin.install(app)
}

describe('createModeKit', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete document.documentElement.dataset.mkPrimary
    delete document.documentElement.dataset.mkNeutral
  })

  it('applies the configured primary and neutral families to the document', () => {
    installModeKit({
      theme: {
        primary: 'green',
        neutral: 'slate',
      },
    })

    expect(document.documentElement.dataset.mkPrimary).toBe('green')
    expect(document.documentElement.dataset.mkNeutral).toBe('slate')
  })

  it('leaves an existing theme value alone when its option is omitted', () => {
    document.documentElement.dataset.mkPrimary = 'violet'

    installModeKit({ theme: { neutral: 'stone' } })

    expect(document.documentElement.dataset.mkPrimary).toBe('violet')
    expect(document.documentElement.dataset.mkNeutral).toBe('stone')
  })

  it('uses the last configured application theme in a shared document', () => {
    installModeKit({ theme: { primary: 'green', neutral: 'slate' } })
    installModeKit({ theme: { primary: 'violet', neutral: 'stone' } })

    expect(document.documentElement.dataset.mkPrimary).toBe('violet')
    expect(document.documentElement.dataset.mkNeutral).toBe('stone')
  })

  it('skips document theme changes during server rendering', () => {
    vi.stubGlobal('document', undefined)

    expect(() => {
      installModeKit({ theme: { primary: 'green', neutral: 'slate' } })
    }).not.toThrow()
  })

  it('keeps matching server-rendered theme attributes during client installation', () => {
    document.documentElement.dataset.mkPrimary = 'green'
    document.documentElement.dataset.mkNeutral = 'slate'

    installModeKit({ theme: { primary: 'green', neutral: 'slate' } })

    expect(document.documentElement.dataset.mkPrimary).toBe('green')
    expect(document.documentElement.dataset.mkNeutral).toBe('slate')
  })

  it('keeps body-portalled content inside the themed document root', () => {
    const wrapper = mount(
      {
        render: () =>
          h(Teleport, { to: 'body' }, h('div', { id: 'modekit-theme-portal' }, 'Portal content')),
      },
      {
        global: {
          plugins: [createModeKit({ theme: { primary: 'green', neutral: 'slate' } })],
        },
      },
    )

    const portalledContent = document.querySelector('#modekit-theme-portal')

    expect(portalledContent).not.toBeNull()
    expect(document.documentElement.contains(portalledContent)).toBe(true)
    expect(document.documentElement.dataset.mkPrimary).toBe('green')
    expect(document.documentElement.dataset.mkNeutral).toBe('slate')

    wrapper.unmount()
  })

  it('exposes typed primary and neutral theme options', () => {
    expectTypeOf<NonNullable<ModeKitOptions['theme']>['primary']>().toEqualTypeOf<
      ModeKitPrimaryColor | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['theme']>['neutral']>().toEqualTypeOf<
      ModeKitNeutralColor | undefined
    >()
  })
})
