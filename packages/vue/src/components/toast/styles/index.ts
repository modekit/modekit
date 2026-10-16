import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  ToastColor,
  ToastCompoundVariant,
  ToastPosition,
  ToastProviderStyleConfig,
  ToastProviderUI,
  ToastSlot,
  ToastStyleConfig,
  ToastUI,
  ToastVariant,
} from '../types.js'

const toastStyles = cva(
  [
    'mk-toast mk:relative mk:box-border mk:grid mk:w-full mk:grid-cols-[minmax(0,1fr)_auto] mk:items-start mk:gap-x-3 mk:overflow-hidden mk:rounded-xl mk:border-solid mk:p-4 mk:shadow-raised-lg mk:outline-none',
    'mk:data-[state=open]:animate-[mk-toast-open_180ms_ease-out] mk:data-[state=closed]:animate-[mk-toast-close_140ms_ease-in]',
    'mk:data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] mk:data-[swipe=move]:translate-y-[var(--reka-toast-swipe-move-y)] mk:data-[swipe=move]:transition-none',
    'mk:data-[swipe=cancel]:translate-x-0 mk:data-[swipe=cancel]:translate-y-0 mk:data-[swipe=cancel]:transition-transform mk:data-[swipe=cancel]:duration-200',
    'mk:data-[swipe=end]:animate-[mk-toast-swipe-end_160ms_ease-out]',
    'mk:motion-reduce:data-[state=open]:animate-none mk:motion-reduce:data-[state=closed]:animate-none mk:motion-reduce:data-[swipe=end]:animate-none',
    'mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary',
  ],
  {
    variants: {
      variant: {
        solid: 'mk:border-0 mk:bg-component mk:text-component-foreground',
        soft: 'mk:border-0 mk:bg-[color-mix(in_oklab,var(--mk-component-color)_15%,white)] mk:text-component mk:dark:bg-[color-mix(in_oklab,var(--mk-component-color)_20%,var(--mk-neutral-900))]',
        outline:
          'mk:border mk:border-component mk:bg-white mk:text-component mk:dark:bg-neutral-900',
      },
    },
  },
)

const toastSlotStyles = {
  body: 'mk-toast__body mk:col-start-1 mk:row-start-1 mk:flex mk:min-w-0 mk:items-start mk:gap-3',
  icon: 'mk-toast__icon mk:mt-0.5 mk:flex mk:size-5 mk:shrink-0 mk:items-center mk:justify-center mk:[&>svg]:size-5',
  content: 'mk-toast__content mk:flex mk:min-w-0 mk:flex-1 mk:flex-col mk:gap-0.5',
  title: 'mk-toast__title mk:m-0 mk:text-sm mk:leading-5 mk:font-semibold',
  description: 'mk-toast__description mk:m-0 mk:text-sm mk:leading-5 mk:opacity-90',
  action: [
    'mk-toast__action mk:mt-2.5 mk:w-fit mk:cursor-pointer mk:rounded-md mk:border mk:border-current/30 mk:bg-transparent mk:px-2.5 mk:py-1.5 mk:text-xs mk:leading-4 mk:font-semibold mk:text-current',
    'mk:transition-colors mk:hover:bg-current/10 mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-current mk:disabled:pointer-events-none mk:disabled:opacity-50',
  ],
  close: [
    'mk-toast__close mk:col-start-2 mk:row-start-1 mk:-mt-1 mk:-mr-1 mk:inline-flex mk:size-7 mk:shrink-0 mk:cursor-pointer mk:items-center mk:justify-center mk:rounded-md mk:border-0 mk:bg-transparent mk:p-0 mk:text-current mk:opacity-70',
    'mk:transition-opacity mk:hover:opacity-100 mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-current mk:disabled:pointer-events-none mk:disabled:opacity-50 mk:[&>svg]:size-4',
  ],
} satisfies Record<ToastSlot, ModeKitClassValue>

const toastViewportStyles = cva(
  [
    'mk-toast-viewport mk:fixed mk:z-[60] mk:m-0 mk:flex mk:max-h-dvh mk:w-[min(100%,26rem)] mk:list-none mk:box-border mk:flex-col mk:gap-3 mk:p-4 mk:outline-none',
    'mk:pointer-events-none mk:[&>.mk-toast]:pointer-events-auto',
  ],
  {
    variants: {
      position: {
        'top-left': 'mk:top-0 mk:left-0',
        'top-right': 'mk:top-0 mk:right-0',
        'bottom-left': 'mk:bottom-0 mk:left-0 mk:flex-col-reverse',
        'bottom-right': 'mk:right-0 mk:bottom-0 mk:flex-col-reverse',
      },
    },
  },
)

function matches<T extends string>(expected: T | readonly T[] | undefined, actual: T): boolean {
  return (
    expected === undefined ||
    (Array.isArray(expected) ? (expected as readonly T[]).includes(actual) : expected === actual)
  )
}

function resolveCompoundClasses(
  compoundVariants: readonly ToastCompoundVariant[] | undefined,
  color: ToastColor,
  variant: ToastVariant,
): ModeKitClassValue[] {
  return (
    compoundVariants
      ?.filter((compound) => matches(compound.color, color) && matches(compound.variant, variant))
      .map((compound) => compound.class) ?? []
  )
}

export function getToastClasses({
  color,
  variant,
  config,
  ui,
  className,
}: {
  color: ToastColor
  variant: ToastVariant
  config?: ToastStyleConfig | undefined
  ui?: ToastUI | undefined
  className?: ModeKitClassValue
}): string {
  return cn(
    toastStyles({ variant }),
    config?.base,
    config?.variants?.color?.[color],
    config?.variants?.variant?.[variant],
    resolveCompoundClasses(config?.compoundVariants, color, variant),
    ui?.base,
    className,
  )
}

export function getToastSlotClasses({
  slot,
  config,
  ui,
}: {
  slot: ToastSlot
  config?: ToastStyleConfig | undefined
  ui?: ToastUI | undefined
}): string {
  return cn(toastSlotStyles[slot], config?.slots?.[slot], ui?.[slot])
}

export function getToastViewportClasses({
  position,
  config,
  ui,
  className,
}: {
  position: ToastPosition
  config?: ToastProviderStyleConfig | undefined
  ui?: ToastProviderUI | undefined
  className?: ModeKitClassValue
}): string {
  return cn(
    toastViewportStyles({ position }),
    config?.base,
    config?.variants?.position?.[position],
    ui?.viewport,
    className,
  )
}
