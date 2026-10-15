import { describe, expectTypeOf, it } from 'vitest'

import type {
  DialogAnimation,
  DialogDescriptionSlotProps,
  DialogEmits,
  DialogPortalTarget,
  DialogProps,
  DialogSize,
  DialogSlotProps,
  DialogSlots,
  DialogStyleConfig,
  DialogTitleSlotProps,
  DialogUI,
  ModeKitOptions,
} from '../../../src/index.js'

describe('Dialog contract', () => {
  it('includes state, behavior, sizing, native attributes, and ModeKit options', () => {
    expectTypeOf<DialogProps['open']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<DialogProps['modal']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<DialogProps['dismissible']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<DialogProps['unmountOnHide']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<DialogProps['size']>().toEqualTypeOf<DialogSize | undefined>()
    expectTypeOf<DialogProps['animation']>().toEqualTypeOf<DialogAnimation | undefined>()
    expectTypeOf<DialogProps['portal']>().toEqualTypeOf<DialogPortalTarget | undefined>()
    expectTypeOf<DialogProps['ui']>().toEqualTypeOf<DialogUI | undefined>()
    expectTypeOf<DialogProps['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<DialogProps['aria-label']>().toEqualTypeOf<string | undefined>()
  })

  it('types state updates, lifecycle events, slots, and global configuration', () => {
    expectTypeOf<DialogEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<DialogEmits['escapeKeyDown']>().toEqualTypeOf<[event: KeyboardEvent]>()
    expectTypeOf<DialogSlotProps>().toEqualTypeOf<{ open: boolean; close: () => void }>()
    expectTypeOf<DialogTitleSlotProps['title']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<DialogDescriptionSlotProps['description']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<NonNullable<DialogSlots['content']>>()
      .parameter(0)
      .toEqualTypeOf<DialogSlotProps>()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['dialog']>().toEqualTypeOf<
      DialogStyleConfig | undefined
    >()
  })
})
