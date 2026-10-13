import type { App, ObjectPlugin } from 'vue'
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest'

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

  it('exposes typed primary and neutral theme options', () => {
    expectTypeOf<NonNullable<ModeKitOptions['theme']>['primary']>().toEqualTypeOf<
      ModeKitPrimaryColor | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['theme']>['neutral']>().toEqualTypeOf<
      ModeKitNeutralColor | undefined
    >()
  })
})
