import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { CheckboxSize, CheckboxStyleConfig, CheckboxUI, CheckboxVariant } from '../types.js'

const checkboxStyles = cva(
  'mk-checkbox mk:inline-flex mk:min-w-0 mk:items-start mk:data-[mk-disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        card: [
          'mk:relative mk:flex mk:w-full mk:cursor-pointer mk:border mk:border-solid mk:border-border mk:bg-surface',
          'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
          'mk:hover:bg-muted/50 mk:has-data-[state=checked]:border-primary/50 mk:has-data-[state=checked]:bg-primary/10',
          'mk:has-focus-visible:border-ring mk:has-focus-visible:outline-2 mk:has-focus-visible:outline-solid mk:has-focus-visible:outline-offset-2 mk:has-focus-visible:outline-ring',
          'mk:has-aria-invalid:border-red-700 mk:dark:has-aria-invalid:border-red-400 mk:data-[mk-disabled]:cursor-not-allowed mk:data-[mk-disabled]:pointer-events-none',
        ],
      },
      size: {
        sm: 'mk:gap-2',
        md: 'mk:gap-2.5',
        lg: 'mk:gap-3',
      },
    },
    compoundVariants: [
      { variant: 'card', size: 'sm', class: 'mk:rounded-lg mk:p-3' },
      { variant: 'card', size: 'md', class: 'mk:rounded-xl mk:p-4' },
      { variant: 'card', size: 'lg', class: 'mk:rounded-2xl mk:p-5' },
    ],
  },
)

const checkboxControlStyles = cva(
  [
    'mk-checkbox__control mk:box-border mk:inline-flex mk:shrink-0 mk:appearance-none mk:items-center mk:justify-center',
    'mk:border mk:border-solid mk:border-input mk:bg-background mk:text-primary-foreground',
    'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:data-[state=checked]:border-primary mk:data-[state=checked]:bg-primary',
    'mk:data-[state=indeterminate]:border-primary mk:data-[state=indeterminate]:bg-primary',
    'mk:aria-invalid:border-red-700 mk:dark:aria-invalid:border-red-400 mk:disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default:
          'mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2 mk:focus-visible:outline-ring mk:aria-invalid:focus-visible:outline-red-700 mk:dark:aria-invalid:focus-visible:outline-red-400',
        card: 'mk:focus-visible:outline-none',
      },
      size: {
        sm: 'mk:size-4 mk:rounded-sm',
        md: 'mk:size-5 mk:rounded-md',
        lg: 'mk:size-6 mk:rounded-lg',
      },
    },
  },
)

const checkboxSlotStyles = {
  indicator: cva(
    'mk-checkbox__indicator mk:flex mk:size-full mk:items-center mk:justify-center mk:text-current',
  ),
  icon: cva('mk-checkbox__icon mk:shrink-0', {
    variants: {
      size: {
        sm: 'mk:size-3',
        md: 'mk:size-3.5',
        lg: 'mk:size-4',
      },
    },
  }),
  content: cva('mk-checkbox__content mk:flex mk:min-w-0 mk:flex-col mk:gap-0.5'),
  label: cva(''),
  description: cva('mk-checkbox__description mk:m-0 mk:text-muted-foreground', {
    variants: {
      size: {
        sm: 'mk:text-xs mk:leading-4',
        md: 'mk:text-xs mk:leading-4',
        lg: 'mk:text-sm mk:leading-5',
      },
    },
  }),
} as const

interface CheckboxClassOptions {
  size: CheckboxSize
  variant: CheckboxVariant
  config?: CheckboxStyleConfig | undefined
  ui?: CheckboxUI | undefined
  className?: ModeKitClassValue
}

type CheckboxSlot = Exclude<keyof CheckboxUI, 'base'>

interface CheckboxSlotClassOptions {
  slot: CheckboxSlot
  size: CheckboxSize
  variant: CheckboxVariant
  config?: CheckboxStyleConfig | undefined
  ui?: CheckboxUI | undefined
}

export function getCheckboxClasses({
  size,
  variant,
  config,
  ui,
  className,
}: CheckboxClassOptions): string {
  return cn(
    checkboxStyles({ size, variant }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.variant?.[variant],
    ui?.base,
    className,
  )
}

export function getCheckboxSlotClasses({
  slot,
  size,
  variant,
  config,
  ui,
}: CheckboxSlotClassOptions): string {
  if (slot === 'control') {
    return cn(checkboxControlStyles({ size, variant }), config?.slots?.control, ui?.control)
  }

  return cn(checkboxSlotStyles[slot]({ size }), config?.slots?.[slot], ui?.[slot])
}
