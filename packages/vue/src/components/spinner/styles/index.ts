import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { SpinnerSize, SpinnerStyleConfig, SpinnerUI } from '../types.js'

const spinnerStyles = cva(
  [
    'mk-spinner mk:inline-block mk:shrink-0 mk:rounded-full',
    'mk:animate-spin mk:motion-reduce:animate-none',
    // ModeKit excludes Preflight, so the border style must be explicit.
    'mk:border-2 mk:border-solid mk:border-current mk:border-r-transparent',
  ],
  {
    variants: {
      size: {
        xs: 'mk:size-3',
        sm: 'mk:size-3.5',
        md: 'mk:size-4',
        lg: 'mk:size-5',
      },
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
