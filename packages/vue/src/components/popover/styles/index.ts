import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { PopoverStyleConfig, PopoverUI } from '../types.js'

const popoverClasses = [
  'mk-popover',
  'mk:z-50 mk:box-border mk:min-w-48 mk:max-w-[min(24rem,calc(100vw-2rem))] mk:rounded-xl mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:p-4 mk:text-neutral-950 mk:shadow-raised-lg',
  'mk:origin-[var(--reka-popover-content-transform-origin)] mk:outline-none mk:data-[state=open]:animate-[mk-popover-open_120ms_ease-out] mk:data-[state=closed]:animate-[mk-popover-close_90ms_ease-in] mk:motion-reduce:animate-none',
  'mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary',
  'mk:dark:border-white/10 mk:dark:bg-neutral-900 mk:dark:text-neutral-50',
]

const popoverArrowClasses = [
  'mk-popover__arrow',
  'mk:fill-white mk:stroke-neutral-200 mk:stroke-1 mk:dark:fill-neutral-900 mk:dark:stroke-neutral-700',
]

interface PopoverClassOptions {
  config?: PopoverStyleConfig | undefined
  ui?: PopoverUI | undefined
  className?: ModeKitClassValue
}

export function getPopoverClasses({ config, ui, className }: PopoverClassOptions): string {
  return cn(popoverClasses, config?.base, ui?.base, className)
}

interface PopoverArrowClassOptions {
  config?: PopoverStyleConfig | undefined
  ui?: PopoverUI | undefined
}

export function getPopoverArrowClasses({ config, ui }: PopoverArrowClassOptions): string {
  return cn(popoverArrowClasses, config?.slots?.arrow, ui?.arrow)
}
