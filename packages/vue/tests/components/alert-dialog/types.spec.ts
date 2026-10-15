import { describe, expectTypeOf, it } from 'vitest'

import type {
  AlertDialogAnimation,
  AlertDialogEmits,
  AlertDialogPortalTarget,
  AlertDialogProps,
  AlertDialogSize,
  AlertDialogSlotProps,
  AlertDialogSlots,
  AlertDialogStyleConfig,
  AlertDialogUI,
  ModeKitOptions,
} from '../../../src/index.js'

describe('Alert Dialog contract', () => {
  it('includes state, presentation, actions, and native attributes', () => {
    expectTypeOf<AlertDialogProps['open']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<AlertDialogProps['size']>().toEqualTypeOf<AlertDialogSize | undefined>()
    expectTypeOf<AlertDialogProps['animation']>().toEqualTypeOf<AlertDialogAnimation | undefined>()
    expectTypeOf<AlertDialogProps['portal']>().toEqualTypeOf<AlertDialogPortalTarget | undefined>()
    expectTypeOf<AlertDialogProps['ui']>().toEqualTypeOf<AlertDialogUI | undefined>()
    expectTypeOf<AlertDialogProps['id']>().toEqualTypeOf<string | undefined>()
  })

  it('types events, slots, and global configuration', () => {
    expectTypeOf<AlertDialogEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<AlertDialogEmits['action']>().toEqualTypeOf<[event: MouseEvent]>()
    expectTypeOf<AlertDialogSlotProps>().toEqualTypeOf<{ open: boolean; close: () => void }>()
    expectTypeOf<NonNullable<AlertDialogSlots['action']>>()
      .parameter(0)
      .toEqualTypeOf<AlertDialogSlotProps>()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['alertDialog']>().toEqualTypeOf<
      AlertDialogStyleConfig | undefined
    >()
  })
})
