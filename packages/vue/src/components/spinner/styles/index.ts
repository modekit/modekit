import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { SpinnerSize, SpinnerStyleConfig, SpinnerUI } from '../types.js'

const spinnerStyles = cva(
  [
    'mk-spinner inline-block shrink-0 rounded-full',
    'animate-spin motion-reduce:animate-none',
    // ModeKit excludes Preflight, so the border style must be explicit.
    'border-2 border-solid border-current border-r-transparent',
  ],
  {
    variants: {
      size: {
        xs: 'size-3',
        sm: 'size-3.5',
        md: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

interface SpinnerClassOptions {
  size: SpinnerSize
  config?: SpinnerStyleConfig | undefined
  ui?: SpinnerUI | undefined
  className?: ModeKitClassValue
}

export function getSpinnerClasses({ size, config, ui, className }: SpinnerClassOptions): string {
  return cn(
    spinnerStyles({ size }),
    config?.base,
    config?.variants?.size?.[size],
    ui?.base,
    className,
  )
}
