import { describe, expect, expectTypeOf, it } from 'vitest'

import { modeKitColors, type ModeKitColor } from '../src/index.js'

describe('shared color contract', () => {
  it('exports semantic aliases and supported palette families', () => {
    expect(modeKitColors).toEqual([
      'primary',
      'neutral',
      'secondary',
      'muted',
      'success',
      'warning',
      'info',
      'destructive',
      'slate',
      'gray',
      'zinc',
      'stone',
      'red',
      'orange',
      'amber',
      'yellow',
      'lime',
      'green',
      'emerald',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
    ])

    expectTypeOf<(typeof modeKitColors)[number]>().toEqualTypeOf<ModeKitColor>()
  })
})
