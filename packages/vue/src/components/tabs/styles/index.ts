import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { TabsSize, TabsStyleConfig, TabsUI, TabsVariant } from '../types.js'

const tabsStyles = cva('mk-tabs mk:flex mk:min-w-0 mk:flex-col', {
  variants: {
    variant: {
      line: '',
      pill: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
})

const tabsListStyles = cva(
  [
    'mk-tabs__list mk:box-border mk:flex mk:max-w-full mk:min-w-0 mk:items-center mk:overflow-x-auto mk:overscroll-x-contain',
    'mk:[scrollbar-width:none] mk:[&::-webkit-scrollbar]:hidden',
  ],
  {
    variants: {
      variant: {
        line: 'mk:border-0 mk:border-b mk:border-solid mk:border-border',
        pill: 'mk:w-fit mk:gap-1 mk:rounded-xl mk:bg-muted mk:p-1',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
  },
)

const tabsTriggerStyles = cva(
  [
    'mk-tabs__trigger mk:box-border mk:inline-flex mk:shrink-0 mk:appearance-none mk:items-center mk:justify-center mk:whitespace-nowrap mk:font-medium',
    'mk:border-solid mk:bg-transparent mk:text-muted-foreground',
    'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:hover:text-foreground mk:focus-visible:z-10 mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2 mk:focus-visible:outline-ring',
    'mk:disabled:pointer-events-none mk:disabled:cursor-not-allowed mk:disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        line: [
          'mk:-mb-px mk:rounded-none mk:border-0 mk:border-b-2 mk:border-transparent',
          'mk:hover:bg-muted/50 mk:data-[state=active]:border-primary mk:data-[state=active]:text-foreground',
        ],
        pill: [
          'mk:border-0',
          'mk:hover:bg-background/60 mk:data-[state=active]:bg-surface mk:data-[state=active]:text-surface-foreground mk:data-[state=active]:[box-shadow:var(--mk-elevation-raised)]',
        ],
      },
      size: {
        sm: 'mk:h-8 mk:gap-1.5 mk:px-3 mk:text-xs mk:leading-4',
        md: 'mk:h-10 mk:gap-2 mk:px-4 mk:text-sm mk:leading-5',
        lg: 'mk:h-12 mk:gap-2.5 mk:px-5 mk:text-base mk:leading-6',
      },
    },
    compoundVariants: [
      { variant: 'pill', size: 'sm', class: 'mk:rounded-md' },
      { variant: 'pill', size: 'md', class: 'mk:rounded-lg' },
      { variant: 'pill', size: 'lg', class: 'mk:rounded-xl' },
    ],
  },
)

const tabsSlotStyles = {
  label: cva('mk-tabs__label'),
  leading: cva('mk-tabs__leading mk:flex mk:shrink-0 mk:items-center'),
  trailing: cva('mk-tabs__trailing mk:flex mk:shrink-0 mk:items-center'),
  content: cva(
    'mk-tabs__content mk:min-w-0 mk:pt-4 mk:text-foreground mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2 mk:focus-visible:outline-ring',
  ),
} as const

interface TabsClassOptions {
  variant: TabsVariant
  size: TabsSize
  config?: TabsStyleConfig | undefined
  ui?: TabsUI | undefined
  className?: ModeKitClassValue
}

export function getTabsClasses({ variant, size, config, ui, className }: TabsClassOptions): string {
  return cn(
    tabsStyles({ variant, size }),
    config?.base,
    config?.variants?.variant?.[variant],
    config?.variants?.size?.[size],
    ui?.base,
    className,
  )
}

type TabsSlot = Exclude<keyof TabsUI, 'base'>

interface TabsSlotClassOptions {
  slot: TabsSlot
  variant: TabsVariant
  size: TabsSize
  config?: TabsStyleConfig | undefined
  ui?: TabsUI | undefined
}

export function getTabsSlotClasses({
  slot,
  variant,
  size,
  config,
  ui,
}: TabsSlotClassOptions): string {
  const builtIn =
    slot === 'list'
      ? tabsListStyles({ variant, size })
      : slot === 'trigger'
        ? tabsTriggerStyles({ variant, size })
        : tabsSlotStyles[slot]({})

  return cn(builtIn, config?.slots?.[slot], ui?.[slot])
}
