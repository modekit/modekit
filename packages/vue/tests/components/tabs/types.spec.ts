import { describe, expectTypeOf, it } from 'vitest'

import type {
  ModeKitOptions,
  TabsEmits,
  TabsItem,
  TabsProps,
  TabsSize,
  TabsSlotProps,
  TabsStyleConfig,
  TabsUI,
  TabsValue,
  TabsVariant,
} from '../../../src/index.js'

describe('Tabs contract', () => {
  it('includes items, values, native attributes, and ModeKit options', () => {
    expectTypeOf<TabsProps['items']>().toEqualTypeOf<readonly TabsItem[]>()
    expectTypeOf<TabsProps['modelValue']>().toEqualTypeOf<TabsValue | undefined>()
    expectTypeOf<TabsProps['size']>().toEqualTypeOf<TabsSize | undefined>()
    expectTypeOf<TabsProps['variant']>().toEqualTypeOf<TabsVariant | undefined>()
    expectTypeOf<TabsProps['ui']>().toEqualTypeOf<TabsUI | undefined>()
    expectTypeOf<TabsProps['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<TabsProps['aria-label']>().toEqualTypeOf<string | undefined>()
  })

  it('types model updates, slots, global configuration, and defaults', () => {
    expectTypeOf<TabsEmits['update:modelValue']>().toEqualTypeOf<[value: TabsValue]>()
    expectTypeOf<TabsSlotProps>().toEqualTypeOf<{ item: TabsItem; active: boolean }>()
    expectTypeOf<TabsStyleConfig['defaultVariants']>().toEqualTypeOf<
      { variant?: TabsVariant; size?: TabsSize } | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['tabs']>().toEqualTypeOf<
      TabsStyleConfig | undefined
    >()
  })
})
