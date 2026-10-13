import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { LabelSize, LabelStyleConfig, LabelUI } from '../types.js'

const labelStyles = cva(
  'mk-label mk:cursor-pointer mk:font-medium mk:text-foreground mk:data-[disabled]:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'mk:text-xs mk:leading-4',
        md: 'mk:text-sm mk:leading-5',
        lg: 'mk:text-base mk:leading-6',
      },
    },
  },
)

const requiredIndicatorStyles = 'mk-label__required mk:ml-0.5 mk:text-red-700 mk:dark:text-red-400'

interface LabelClassOptions {
  size: LabelSize
  config?: LabelStyleConfig | undefined
  ui?: LabelUI | undefined
  className?: ModeKitClassValue
}

interface LabelRequiredIndicatorClassOptions {
  config?: LabelStyleConfig | undefined
  ui?: LabelUI | undefined
}

export function getLabelClasses({ size, config, ui, className }: LabelClassOptions): string {
  return cn(
    labelStyles({ size }),
    config?.base,
    config?.variants?.size?.[size],
    ui?.base,
    className,
  )
}

export function getLabelRequiredIndicatorClasses({
  config,
  ui,
}: LabelRequiredIndicatorClassOptions): string {
  return cn(requiredIndicatorStyles, config?.slots?.requiredIndicator, ui?.requiredIndicator)
}
