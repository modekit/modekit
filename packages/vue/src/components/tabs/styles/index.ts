import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { TabsSize, TabsStyleConfig, TabsUI, TabsVariant } from '../types.js'

const tabsStyles = cva('mk-tabs mk:flex mk:min-w-0 mk:flex-col', {
  variants: {
    variant: {
      line: '',
      segmented: '',
      pill: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
})

const tabsIndicatorStyles = [
  "mk:after:pointer-events-none mk:after:absolute mk:after:left-0 mk:after:w-[var(--mk-tabs-indicator-width,0px)] mk:after:content-['']",
  'mk:after:opacity-0 mk:data-[mk-indicator-ready]:after:opacity-100',
  'mk:after:[transform:translate3d(var(--mk-tabs-indicator-x,0px),0,0)]',
  'mk:after:transition-[width,transform,opacity] mk:after:duration-200 mk:after:ease-out mk:motion-reduce:after:transition-none',
] as const

const tabsListStyles = cva(
  [
    'mk-tabs__list mk:relative mk:box-border mk:flex mk:max-w-full mk:min-w-0 mk:items-center mk:overflow-x-auto mk:overscroll-x-contain',
    'mk:[scrollbar-width:none] mk:[&::-webkit-scrollbar]:hidden',
  ],
  {
    variants: {
      variant: {
        line: [
          ...tabsIndicatorStyles,
          'mk:border-0 mk:border-b mk:border-solid mk:border-neutral-200 mk:dark:border-neutral-800',
          'mk:after:bottom-0 mk:after:h-0.5 mk:after:bg-primary',
          "mk:data-[mk-indicator-ready]:[&_[role='tab'][data-state='active']]:border-b-transparent",
        ],
        segmented: [
          ...tabsIndicatorStyles,
          'mk:w-fit mk:gap-1 mk:rounded-xl mk:bg-neutral-100 mk:p-1 mk:dark:bg-neutral-800',
          'mk:after:inset-y-1 mk:after:bg-white mk:after:shadow-raised mk:dark:after:bg-white/10',
          "mk:data-[mk-indicator-ready]:[&_[role='tab'][data-state='active']]:bg-transparent",
          "mk:data-[mk-indicator-ready]:[&_[role='tab'][data-state='active']]:shadow-none",
        ],
        pill: 'mk:w-fit mk:gap-2',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    compoundVariants: [
      { variant: 'segmented', size: 'sm', class: 'mk:after:rounded-md' },
      { variant: 'segmented', size: 'md', class: 'mk:after:rounded-lg' },
      { variant: 'segmented', size: 'lg', class: 'mk:after:rounded-xl' },
    ],
  },
)

const tabsTriggerStyles = cva(
  [
    'mk-tabs__trigger mk:relative mk:z-1 mk:box-border mk:inline-flex mk:shrink-0 mk:appearance-none mk:items-center mk:justify-center mk:whitespace-nowrap mk:font-medium',
    'mk:border-solid mk:bg-transparent mk:text-neutral-600 mk:dark:text-neutral-400',
    'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:focus-visible:z-10 mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary',
    'mk:disabled:pointer-events-none mk:disabled:cursor-not-allowed mk:disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        line: [
          'mk:-mb-px mk:rounded-none mk:border-0 mk:border-b-2 mk:border-transparent',
          'mk:hover:text-neutral-950 mk:data-[state=active]:border-primary mk:data-[state=active]:text-neutral-950 mk:dark:hover:text-neutral-50 mk:dark:data-[state=active]:text-neutral-50',
        ],
        segmented: [
          'mk:border-0',
          'mk:data-[state=active]:bg-white mk:data-[state=active]:text-neutral-950 mk:data-[state=active]:shadow-raised mk:dark:data-[state=active]:bg-white/10 mk:dark:data-[state=active]:text-neutral-50',
        ],
        pill: [
          'mk:rounded-full mk:border-0 mk:bg-neutral-100 mk:dark:bg-neutral-800',
          'mk:data-[state=active]:bg-primary mk:data-[state=active]:text-primary-foreground',
        ],
      },
      size: {
        sm: 'mk:h-8 mk:gap-1.5 mk:px-3 mk:text-xs mk:leading-4',
        md: 'mk:h-10 mk:gap-2 mk:px-4 mk:text-sm mk:leading-5',
        lg: 'mk:h-12 mk:gap-2.5 mk:px-5 mk:text-base mk:leading-6',
      },
    },
    compoundVariants: [
      { variant: 'segmented', size: 'sm', class: 'mk:rounded-md' },
      { variant: 'segmented', size: 'md', class: 'mk:rounded-lg' },
      { variant: 'segmented', size: 'lg', class: 'mk:rounded-xl' },
    ],
  },
)

const tabsSlotStyles = {
  label: cva('mk-tabs__label'),
  leading: cva('mk-tabs__leading mk:flex mk:shrink-0 mk:items-center'),
  trailing: cva('mk-tabs__trailing mk:flex mk:shrink-0 mk:items-center'),
  content: cva(
    'mk-tabs__content mk:min-w-0 mk:pt-4 mk:text-neutral-950 mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary mk:dark:text-neutral-50',
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
