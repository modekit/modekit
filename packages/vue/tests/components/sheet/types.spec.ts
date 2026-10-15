import { describe, expectTypeOf, it } from 'vitest'
import type { Component, HTMLAttributes } from 'vue'

import { MkSheet } from '../../../src/index.js'
import type {
  ModeKitUIConfig,
  SheetCloseReason,
  SheetEmits,
  SheetProps,
  SheetSide,
  SheetSize,
  SheetSlots,
  SheetVariant,
} from '../../../src/index.js'

describe('MkSheet types', () => {
  it('exports a ModeKit-owned alpha component contract', () => {
    expectTypeOf(MkSheet).toExtend<Component>()
    expectTypeOf<SheetSide>().toEqualTypeOf<'top' | 'right' | 'bottom' | 'left'>()
    expectTypeOf<SheetSize>().toEqualTypeOf<'sm' | 'md' | 'lg' | 'xl'>()
    expectTypeOf<SheetVariant>().toEqualTypeOf<'edge' | 'inset'>()
    expectTypeOf<SheetCloseReason>().toEqualTypeOf<
      | 'swipe'
      | 'escape-key'
      | 'outside-press'
      | 'click'
      | 'cancel'
      | 'trigger-press'
      | 'close-press'
    >()
    expectTypeOf<SheetProps>().toExtend<HTMLAttributes>()
    expectTypeOf<SheetProps>().not.toHaveProperty('unmountOnHide')
    expectTypeOf<SheetEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<SheetEmits['afterOpen']>().toEqualTypeOf<[]>()
    expectTypeOf<SheetEmits['afterClose']>().toEqualTypeOf<[]>()
    expectTypeOf<NonNullable<SheetSlots['actions']>>().toBeFunction()
    expectTypeOf<NonNullable<SheetSlots['content']>>().toBeFunction()
  })

  it('integrates Sheet configuration without exposing Reka types', () => {
    expectTypeOf<NonNullable<ModeKitUIConfig['sheet']>>().toHaveProperty('variants')
    expectTypeOf<NonNullable<ModeKitUIConfig['sheet']>>().toHaveProperty('defaultVariants')
  })
})
