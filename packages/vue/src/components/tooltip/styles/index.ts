import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { TooltipStyleConfig, TooltipUI } from '../types.js'

const tooltipClasses = [
  'mk-tooltip',
  'mk:z-50 mk:box-border mk:max-w-[min(20rem,calc(100vw-2rem))] mk:rounded-md mk:bg-neutral-950 mk:px-2.5 mk:py-1.5 mk:text-xs mk:leading-4 mk:text-white mk:shadow-raised',
  'mk:origin-[var(--reka-tooltip-content-transform-origin)] mk:outline-none mk:data-[state=delayed-open]:animate-[mk-tooltip-open_120ms_ease-out] mk:data-[state=instant-open]:animate-[mk-tooltip-open_90ms_ease-out] mk:data-[state=closed]:animate-[mk-tooltip-close_75ms_ease-in] mk:motion-reduce:animate-none',
  'mk:dark:bg-neutral-50 mk:dark:text-neutral-950',
]

const tooltipArrowClasses = [
  'mk-tooltip__arrow',
  'mk:-translate-y-px mk:fill-neutral-950 mk:dark:fill-neutral-50',
]

interface TooltipClassOptions {
  config?: TooltipStyleConfig | undefined
  ui?: TooltipUI | undefined
  className?: ModeKitClassValue
}

export function getTooltipClasses({ config, ui, className }: TooltipClassOptions): string {
  return cn(tooltipClasses, config?.base, ui?.base, className)
}

interface TooltipArrowClassOptions {
  config?: TooltipStyleConfig | undefined
  ui?: TooltipUI | undefined
}

export function getTooltipArrowClasses({ config, ui }: TooltipArrowClassOptions): string {
  return cn(tooltipArrowClasses, config?.slots?.arrow, ui?.arrow)
}
