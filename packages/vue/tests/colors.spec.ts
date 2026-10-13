import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  modeKitColors,
  modeKitNeutralColors,
  modeKitPrimaryColors,
  type ModeKitColor,
  type ModeKitNeutralColor,
  type ModeKitPrimaryColor,
} from '../src/index.js'

describe('shared color contract', () => {
  it('exports semantic aliases and supported palette families', () => {
    expect(modeKitColors).toEqual([
      'primary',
      'neutral',
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

  it('exports the configurable primary and neutral families', () => {
    expect(modeKitPrimaryColors).toEqual([
      'black',
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
    expect(modeKitNeutralColors).toEqual(['slate', 'gray', 'zinc', 'stone'])
    expectTypeOf<(typeof modeKitPrimaryColors)[number]>().toEqualTypeOf<ModeKitPrimaryColor>()
    expectTypeOf<(typeof modeKitNeutralColors)[number]>().toEqualTypeOf<ModeKitNeutralColor>()
  })
})
