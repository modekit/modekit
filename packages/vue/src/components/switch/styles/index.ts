import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  SwitchAlignment,
  SwitchSize,
  SwitchStyleConfig,
  SwitchUI,
  SwitchVariant,
} from '../types.js'

const switchStyles = cva(
  'mk-switch mk:inline-flex mk:min-w-0 mk:items-start mk:data-[mk-disabled]:opacity-50 mk:data-[mk-loading]:cursor-progress',
  {
    variants: {
      variant: {
        default: '',
        card: [
          'mk:relative mk:flex mk:w-full mk:cursor-pointer mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:dark:border-neutral-800 mk:dark:bg-white/10',
          'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
          'mk:hover:bg-neutral-100/50 mk:dark:hover:bg-neutral-800/50 mk:has-data-[state=checked]:border-primary/50 mk:has-data-[state=checked]:bg-primary/10',
          'mk:has-focus-visible:border-primary mk:has-focus-visible:outline-2 mk:has-focus-visible:outline-solid mk:has-focus-visible:outline-offset-2 mk:has-focus-visible:outline-primary',
          'mk:has-aria-invalid:border-red-700 mk:dark:has-aria-invalid:border-red-400 mk:data-[mk-disabled]:cursor-not-allowed mk:data-[mk-disabled]:pointer-events-none',
        ],
      },
      size: {
        sm: 'mk:gap-2',
        md: 'mk:gap-2.5',
        lg: 'mk:gap-3',
      },
      align: {
        left: 'mk:flex-row-reverse',
        right: 'mk:flex-row',
      },
    },
    compoundVariants: [
      { variant: 'card', size: 'sm', class: 'mk:rounded-lg mk:p-3' },
      { variant: 'card', size: 'md', class: 'mk:rounded-xl mk:p-4' },
      { variant: 'card', size: 'lg', class: 'mk:rounded-2xl mk:p-5' },
    ],
  },
)

const switchControlStyles = cva(
  [
    'mk-switch__control mk:box-border mk:inline-flex mk:shrink-0 mk:appearance-none mk:items-center mk:rounded-full mk:border-0 mk:bg-neutral-300 mk:p-0.5 mk:dark:bg-neutral-700',
    'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:data-[state=checked]:bg-primary mk:aria-invalid:ring-1 mk:aria-invalid:ring-red-700 mk:dark:aria-invalid:ring-red-400 mk:disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default:
          'mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary mk:aria-invalid:focus-visible:outline-red-700 mk:dark:aria-invalid:focus-visible:outline-red-400',
        card: 'mk:focus-visible:outline-none',
      },
      size: {
        sm: 'mk:h-5 mk:w-9',
        md: 'mk:h-6 mk:w-11',
        lg: 'mk:h-7 mk:w-13',
      },
    },
  },
)

const switchSlotStyles = {
  thumb: cva(
    [
      'mk-switch__thumb mk:pointer-events-none mk:flex mk:translate-x-0 mk:items-center mk:justify-center mk:rounded-full mk:bg-white mk:text-neutral-700 mk:shadow-sm mk:dark:text-neutral-900',
      'mk:transition-transform mk:duration-150 mk:ease-out mk:will-change-transform mk:motion-reduce:transition-none',
    ],
    {
      variants: {
        size: {
          sm: 'mk:size-4 mk:data-[state=checked]:translate-x-4 mk:[&>svg]:size-2.5',
          md: 'mk:size-5 mk:data-[state=checked]:translate-x-5 mk:[&>svg]:size-3',
          lg: 'mk:size-6 mk:data-[state=checked]:translate-x-6 mk:[&>svg]:size-3.5',
        },
      },
    },
  ),
  icon: cva(
    'mk-switch__icon mk:flex mk:shrink-0 mk:items-center mk:justify-center mk:[&>svg]:size-full mk:[&>svg]:shrink-0',
    {
      variants: {
        size: {
          sm: 'mk:size-2.5',
          md: 'mk:size-3',
          lg: 'mk:size-3.5',
        },
      },
    },
  ),
  loader: cva(
    'mk-switch__loader mk:flex mk:shrink-0 mk:items-center mk:justify-center mk:leading-none',
    {
      variants: {
        size: {
          sm: 'mk:size-2.5',
          md: 'mk:size-3',
          lg: 'mk:size-3.5',
        },
      },
    },
  ),
  content: cva('mk-switch__content mk:flex mk:min-w-0 mk:flex-1 mk:flex-col mk:gap-0.5'),
  label: cva(''),
  description: cva('mk-switch__description mk:m-0 mk:text-neutral-600 mk:dark:text-neutral-400', {
    variants: {
      size: {
        sm: 'mk:text-xs mk:leading-4',
        md: 'mk:text-xs mk:leading-4',
        lg: 'mk:text-sm mk:leading-5',
      },
    },
  }),
} as const

interface SwitchClassOptions {
  size: SwitchSize
  variant: SwitchVariant
  align: SwitchAlignment
  config?: SwitchStyleConfig | undefined
  ui?: SwitchUI | undefined
  className?: ModeKitClassValue
}

type SwitchSlot = Exclude<keyof SwitchUI, 'base'>

interface SwitchSlotClassOptions {
  slot: SwitchSlot
  size: SwitchSize
  variant: SwitchVariant
  config?: SwitchStyleConfig | undefined
  ui?: SwitchUI | undefined
}

export function getSwitchClasses({
  size,
  variant,
  align,
  config,
  ui,
  className,
}: SwitchClassOptions): string {
  return cn(
    switchStyles({ size, variant, align }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.variant?.[variant],
    config?.variants?.align?.[align],
    ui?.base,
    className,
  )
}

export function getSwitchSlotClasses({
  slot,
  size,
  variant,
  config,
  ui,
}: SwitchSlotClassOptions): string {
  if (slot === 'control') {
    return cn(switchControlStyles({ size, variant }), config?.slots?.control, ui?.control)
  }

  return cn(switchSlotStyles[slot]({ size }), config?.slots?.[slot], ui?.[slot])
}
