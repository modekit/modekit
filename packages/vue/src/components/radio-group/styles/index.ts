import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  RadioGroupOrientation,
  RadioGroupSize,
  RadioGroupStyleConfig,
  RadioGroupUI,
  RadioGroupVariant,
} from '../types.js'

const radioGroupStyles = cva('mk-radio-group mk:flex mk:min-w-0 mk:flex-col', {
  variants: {
    size: {
      sm: 'mk:gap-2',
      md: 'mk:gap-2.5',
      lg: 'mk:gap-3',
    },
    variant: {
      default: '',
      card: '',
      table: '',
      segmented: '',
      pills: '',
    },
    orientation: {
      vertical: '',
      horizontal: '',
    },
  },
})

const radioGroupIndicatorStyles = [
  "mk:after:pointer-events-none mk:after:absolute mk:after:left-0 mk:after:top-0 mk:after:z-0 mk:after:h-[var(--mk-radio-group-indicator-height,0px)] mk:after:w-[var(--mk-radio-group-indicator-width,0px)] mk:after:content-['']",
  'mk:after:opacity-0 mk:data-[mk-indicator-ready]:after:opacity-100',
  'mk:after:[transform:translate3d(var(--mk-radio-group-indicator-x,0px),var(--mk-radio-group-indicator-y,0px),0)]',
  'mk:after:transition-[width,height,transform,opacity] mk:after:duration-200 mk:after:ease-out mk:motion-reduce:after:transition-none',
] as const

const radioGroupOptionStyles = cva('mk-radio-group__options mk:relative mk:flex mk:min-w-0', {
  variants: {
    size: {
      sm: 'mk:gap-2',
      md: 'mk:gap-2.5',
      lg: 'mk:gap-3',
    },
    variant: {
      default: '',
      card: '',
      table:
        'mk:gap-0 mk:overflow-hidden mk:rounded-xl mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:dark:border-neutral-800 mk:dark:bg-white/5',
      segmented: [
        ...radioGroupIndicatorStyles,
        'mk:w-fit mk:gap-1 mk:rounded-xl mk:bg-neutral-100 mk:p-1 mk:dark:bg-neutral-800',
        'mk:after:bg-white mk:after:shadow-raised mk:dark:after:bg-white/10',
        'mk:data-[mk-indicator-ready]:[&_[data-mk-checked]]:bg-transparent mk:data-[mk-indicator-ready]:[&_[data-mk-checked]]:shadow-none',
      ],
      pills: 'mk:w-fit mk:gap-2',
    },
    orientation: {
      vertical: 'mk:flex-col',
      horizontal: 'mk:flex-row mk:flex-wrap',
    },
  },
  compoundVariants: [
    {
      variant: 'table',
      orientation: 'horizontal',
      class: 'mk:flex-nowrap mk:overflow-x-auto mk:overscroll-x-contain',
    },
    {
      variant: 'segmented',
      orientation: 'horizontal',
      class: 'mk:flex-nowrap mk:overflow-x-auto mk:overscroll-x-contain',
    },
    { variant: 'segmented', size: 'sm', class: 'mk:after:rounded-md' },
    { variant: 'segmented', size: 'md', class: 'mk:after:rounded-lg' },
    { variant: 'segmented', size: 'lg', class: 'mk:after:rounded-xl' },
  ],
})

const radioGroupItemStyles = cva(
  [
    'mk-radio-group__item mk:relative mk:inline-flex mk:min-w-0 mk:cursor-pointer mk:items-start',
    'mk:data-[mk-disabled]:cursor-not-allowed mk:data-[mk-disabled]:opacity-50',
    'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        sm: 'mk:gap-2',
        md: 'mk:gap-2.5',
        lg: 'mk:gap-3',
      },
      variant: {
        default: '',
        card: [
          'mk:flex-1 mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:dark:border-neutral-800 mk:dark:bg-white/10',
          'mk:hover:bg-neutral-100/50 mk:dark:hover:bg-neutral-800/50 mk:has-data-[state=checked]:border-primary/50 mk:has-data-[state=checked]:bg-primary/10',
          'mk:has-focus-visible:border-primary mk:has-focus-visible:outline-2 mk:has-focus-visible:outline-solid mk:has-focus-visible:outline-offset-2 mk:has-focus-visible:outline-primary',
          'mk:has-aria-invalid:border-red-700 mk:dark:has-aria-invalid:border-red-400',
        ],
        table: [
          'mk:box-border mk:w-full mk:border-0 mk:border-neutral-200 mk:bg-transparent mk:dark:border-neutral-800',
          'mk:hover:bg-neutral-100/60 mk:dark:hover:bg-neutral-800/50',
          'mk:has-data-[state=checked]:z-1 mk:has-data-[state=checked]:bg-primary/10 mk:has-data-[state=checked]:ring-1 mk:has-data-[state=checked]:ring-inset mk:has-data-[state=checked]:ring-primary/60',
          'mk:has-focus-visible:z-2 mk:has-focus-visible:outline-2 mk:has-focus-visible:outline-solid mk:has-focus-visible:-outline-offset-2 mk:has-focus-visible:outline-primary',
        ],
        segmented: [
          'mk:z-1 mk:items-center mk:justify-center mk:border-0 mk:bg-transparent mk:text-neutral-600 mk:dark:text-neutral-400',
          'mk:hover:text-neutral-950 mk:dark:hover:text-neutral-50',
          'mk:has-data-[state=checked]:bg-white mk:has-data-[state=checked]:text-neutral-950 mk:has-data-[state=checked]:shadow-raised mk:dark:has-data-[state=checked]:bg-white/10 mk:dark:has-data-[state=checked]:text-neutral-50',
          'mk:has-focus-visible:z-10 mk:has-focus-visible:outline-2 mk:has-focus-visible:outline-solid mk:has-focus-visible:outline-offset-2 mk:has-focus-visible:outline-primary',
        ],
        pills: [
          'mk:items-center mk:justify-center mk:rounded-full mk:border-0 mk:bg-neutral-100 mk:text-neutral-700 mk:dark:bg-neutral-800 mk:dark:text-neutral-300',
          'mk:hover:text-neutral-950 mk:dark:hover:text-neutral-50',
          'mk:has-data-[state=checked]:bg-primary mk:has-data-[state=checked]:text-primary-foreground',
          'mk:has-focus-visible:z-10 mk:has-focus-visible:outline-2 mk:has-focus-visible:outline-solid mk:has-focus-visible:outline-offset-2 mk:has-focus-visible:outline-primary',
        ],
      },
      orientation: {
        vertical: '',
        horizontal: '',
      },
    },
    compoundVariants: [
      { variant: 'card', size: 'sm', class: 'mk:rounded-lg mk:p-3' },
      { variant: 'card', size: 'md', class: 'mk:rounded-xl mk:p-4' },
      { variant: 'card', size: 'lg', class: 'mk:rounded-2xl mk:p-5' },
      { variant: 'table', size: 'sm', class: 'mk:p-3' },
      { variant: 'table', size: 'md', class: 'mk:p-4' },
      { variant: 'table', size: 'lg', class: 'mk:p-5' },
      {
        variant: 'table',
        orientation: 'vertical',
        class: 'mk:[&:not(:last-child)]:border-b mk:first:rounded-t-xl mk:last:rounded-b-xl',
      },
      {
        variant: 'table',
        orientation: 'horizontal',
        class:
          'mk:w-auto mk:flex-1 mk:[&:not(:last-child)]:border-r mk:first:rounded-l-xl mk:last:rounded-r-xl',
      },
      {
        variant: 'segmented',
        size: 'sm',
        class: 'mk:min-h-7 mk:rounded-md mk:px-2.5 mk:py-1.5',
      },
      {
        variant: 'segmented',
        size: 'md',
        class: 'mk:min-h-8 mk:rounded-lg mk:px-3 mk:py-1.5',
      },
      {
        variant: 'segmented',
        size: 'lg',
        class: 'mk:min-h-10 mk:rounded-xl mk:px-4 mk:py-2',
      },
      { variant: 'pills', size: 'sm', class: 'mk:min-h-7 mk:px-2.5 mk:py-1.5' },
      { variant: 'pills', size: 'md', class: 'mk:min-h-8 mk:px-3 mk:py-1.5' },
      { variant: 'pills', size: 'lg', class: 'mk:min-h-10 mk:px-4 mk:py-2' },
    ],
  },
)

const radioGroupControlStyles = cva(
  [
    'mk-radio-group__control mk:box-border mk:inline-flex mk:shrink-0 mk:appearance-none mk:items-center mk:justify-center',
    'mk:border mk:border-solid mk:border-neutral-300 mk:bg-white mk:text-primary mk:dark:border-neutral-700 mk:dark:bg-white/10',
    'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:data-[state=checked]:border-primary mk:aria-invalid:border-red-700 mk:dark:aria-invalid:border-red-400 mk:disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default:
          'mk:rounded-full mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary mk:aria-invalid:focus-visible:outline-red-700 mk:dark:aria-invalid:focus-visible:outline-red-400',
        card: 'mk:rounded-full mk:focus-visible:outline-none',
        table: 'mk:rounded-full mk:focus-visible:outline-none',
        segmented: 'mk:absolute mk:size-px mk:overflow-hidden mk:border-0 mk:p-0 mk:opacity-0',
        pills: 'mk:absolute mk:size-px mk:overflow-hidden mk:border-0 mk:p-0 mk:opacity-0',
      },
      size: {
        sm: 'mk:size-4',
        md: 'mk:size-5',
        lg: 'mk:size-6',
      },
      icon: {
        false: '',
        true: 'mk:absolute mk:size-px mk:overflow-hidden mk:border-0 mk:p-0 mk:opacity-0',
      },
    },
  },
)

const radioGroupSlotStyles = {
  header: cva('mk-radio-group__header mk:flex mk:min-w-0 mk:flex-col mk:gap-0.5'),
  label: cva('mk-radio-group__label mk:font-medium mk:text-neutral-950 mk:dark:text-neutral-50', {
    variants: {
      size: {
        sm: 'mk:text-xs mk:leading-4',
        md: 'mk:text-sm mk:leading-5',
        lg: 'mk:text-base mk:leading-6',
      },
    },
  }),
  description: cva(
    'mk-radio-group__description mk:m-0 mk:text-neutral-600 mk:dark:text-neutral-400',
    {
      variants: {
        size: {
          sm: 'mk:text-xs mk:leading-4',
          md: 'mk:text-xs mk:leading-4',
          lg: 'mk:text-sm mk:leading-5',
        },
      },
    },
  ),
  indicator: cva(
    'mk-radio-group__indicator mk:block mk:aspect-square mk:rounded-full mk:bg-primary',
    {
      variants: {
        size: {
          sm: 'mk:size-1.5',
          md: 'mk:size-2',
          lg: 'mk:size-2.5',
        },
      },
    },
  ),
  icon: cva(
    'mk-radio-group__icon mk:flex mk:shrink-0 mk:items-center mk:justify-center mk:[&>svg]:size-full',
    {
      variants: {
        size: {
          sm: 'mk:size-3.5',
          md: 'mk:size-4',
          lg: 'mk:size-5',
        },
      },
    },
  ),
  content: cva('mk-radio-group__content mk:flex mk:min-w-0 mk:gap-0.5', {
    variants: {
      variant: {
        default: 'mk:flex-col',
        card: 'mk:flex-col',
        table: 'mk:flex-col',
        segmented: 'mk:flex-row mk:items-center',
        pills: 'mk:flex-row mk:items-center',
      },
    },
  }),
  itemLabel: cva('mk-radio-group__item-label mk:font-medium', {
    variants: {
      variant: {
        default: 'mk:text-neutral-950 mk:dark:text-neutral-50',
        card: 'mk:text-neutral-950 mk:dark:text-neutral-50',
        table: 'mk:text-neutral-950 mk:dark:text-neutral-50',
        segmented: 'mk:text-inherit',
        pills: 'mk:text-inherit',
      },
      size: {
        sm: 'mk:text-xs mk:leading-4',
        md: 'mk:text-sm mk:leading-5',
        lg: 'mk:text-base mk:leading-6',
      },
    },
  }),
  itemDescription: cva('mk-radio-group__item-description', {
    variants: {
      variant: {
        default: 'mk:text-neutral-600 mk:dark:text-neutral-400',
        card: 'mk:text-neutral-600 mk:dark:text-neutral-400',
        table: 'mk:text-neutral-600 mk:dark:text-neutral-400',
        segmented: 'mk:text-inherit mk:opacity-70',
        pills: 'mk:text-inherit mk:opacity-70',
      },
      size: {
        sm: 'mk:text-xs mk:leading-4',
        md: 'mk:text-xs mk:leading-4',
        lg: 'mk:text-sm mk:leading-5',
      },
    },
  }),
} as const

interface RadioGroupClassOptions {
  size: RadioGroupSize
  variant: RadioGroupVariant
  orientation: RadioGroupOrientation
  config?: RadioGroupStyleConfig | undefined
  ui?: RadioGroupUI | undefined
  className?: ModeKitClassValue
}

type RadioGroupSlot = Exclude<keyof RadioGroupUI, 'base'>

interface RadioGroupSlotClassOptions {
  slot: RadioGroupSlot
  size: RadioGroupSize
  variant: RadioGroupVariant
  orientation: RadioGroupOrientation
  icon?: boolean
  config?: RadioGroupStyleConfig | undefined
  ui?: RadioGroupUI | undefined
}

export function getRadioGroupClasses({
  size,
  variant,
  orientation,
  config,
  ui,
  className,
}: RadioGroupClassOptions): string {
  return cn(
    radioGroupStyles({ size, variant, orientation }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.variant?.[variant],
    config?.variants?.orientation?.[orientation],
    ui?.base,
    className,
  )
}

export function getRadioGroupSlotClasses({
  slot,
  size,
  variant,
  orientation,
  icon = false,
  config,
  ui,
}: RadioGroupSlotClassOptions): string {
  let builtIn: string

  if (slot === 'options') builtIn = radioGroupOptionStyles({ size, variant, orientation })
  else if (slot === 'item') builtIn = radioGroupItemStyles({ size, variant, orientation })
  else if (slot === 'control') builtIn = radioGroupControlStyles({ size, variant, icon })
  else if (slot === 'content') builtIn = radioGroupSlotStyles.content({ variant })
  else if (slot === 'itemLabel') builtIn = radioGroupSlotStyles.itemLabel({ size, variant })
  else if (slot === 'itemDescription') {
    builtIn = radioGroupSlotStyles.itemDescription({ size, variant })
  } else builtIn = radioGroupSlotStyles[slot]({ size })

  return cn(builtIn, config?.slots?.[slot], ui?.[slot])
}
