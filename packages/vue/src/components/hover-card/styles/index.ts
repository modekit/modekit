import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { HoverCardStyleConfig, HoverCardUI } from '../types.js'

const hoverCardClasses = [
  'mk-hover-card',
  'mk:z-50 mk:box-border mk:w-80 mk:max-w-[min(20rem,calc(100vw-2rem))] mk:rounded-xl mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:p-4 mk:text-neutral-950 mk:shadow-raised-lg',
  'mk:origin-[var(--reka-hover-card-content-transform-origin)] mk:outline-none mk:data-[state=open]:animate-[mk-popover-open_120ms_ease-out] mk:data-[state=closed]:animate-[mk-popover-close_90ms_ease-in] mk:motion-reduce:animate-none',
  'mk:dark:border-white/10 mk:dark:bg-neutral-900 mk:dark:text-neutral-50',
]

const hoverCardArrowClasses = [
  'mk-hover-card__arrow',
  'mk:-translate-y-px mk:fill-white mk:stroke-neutral-200 mk:stroke-1 mk:dark:fill-neutral-900 mk:dark:stroke-neutral-700',
]

interface HoverCardClassOptions {
  config?: HoverCardStyleConfig | undefined
  ui?: HoverCardUI | undefined
  className?: ModeKitClassValue
}

export function getHoverCardClasses({ config, ui, className }: HoverCardClassOptions): string {
  return cn(hoverCardClasses, config?.base, ui?.base, className)
}

interface HoverCardArrowClassOptions {
  config?: HoverCardStyleConfig | undefined
  ui?: HoverCardUI | undefined
}

export function getHoverCardArrowClasses({ config, ui }: HoverCardArrowClassOptions): string {
  return cn(hoverCardArrowClasses, config?.slots?.arrow, ui?.arrow)
}
