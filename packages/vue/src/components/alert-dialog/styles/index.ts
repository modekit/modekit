import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  AlertDialogAnimation,
  AlertDialogSize,
  AlertDialogStyleConfig,
  AlertDialogUI,
} from '../types.js'

const alertDialogStyles = cva(
  [
    'mk-alert-dialog mk:fixed mk:top-1/2 mk:left-1/2 mk:z-[51] mk:box-border mk:flex mk:max-h-[calc(100dvh-2rem)] mk:w-[calc(100%-2rem)] mk:-translate-x-1/2 mk:-translate-y-1/2 mk:flex-col mk:overflow-hidden',
    'mk:origin-center mk:rounded-xl mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:text-neutral-950 mk:shadow-raised-xl mk:outline-none mk:motion-reduce:animate-none',
    'mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary',
    'mk:dark:border-white/10 mk:dark:bg-neutral-900 mk:dark:text-neutral-50',
  ],
  {
    variants: {
      size: {
        sm: 'mk:max-w-sm',
        md: 'mk:max-w-lg',
        lg: 'mk:max-w-2xl',
        xl: 'mk:max-w-4xl',
      },
      animation: {
        scale:
          'mk:data-[state=open]:animate-[mk-dialog-scale-open_160ms_ease-out] mk:data-[state=closed]:animate-[mk-dialog-scale-close_120ms_ease-in]',
        fade: 'mk:data-[state=open]:animate-[mk-dialog-fade-open_160ms_ease-out] mk:data-[state=closed]:animate-[mk-dialog-fade-close_120ms_ease-in]',
        'slide-up':
          'mk:data-[state=open]:animate-[mk-dialog-slide-up-open_180ms_ease-out] mk:data-[state=closed]:animate-[mk-dialog-slide-up-close_140ms_ease-in]',
        'slide-down':
          'mk:data-[state=open]:animate-[mk-dialog-slide-down-open_180ms_ease-out] mk:data-[state=closed]:animate-[mk-dialog-slide-down-close_140ms_ease-in]',
        none: 'mk:animate-none',
      },
    },
  },
)

const slotClasses = {
  overlay: [
    'mk-alert-dialog__overlay mk:fixed mk:inset-0 mk:z-50 mk:bg-black/50 mk:backdrop-blur-[2px]',
    'mk:motion-reduce:animate-none',
  ],
  header: 'mk-alert-dialog__header mk:flex mk:min-w-0 mk:flex-col mk:gap-2 mk:px-6 mk:pt-6',
  title:
    'mk-alert-dialog__title mk:m-0 mk:text-lg mk:leading-6 mk:font-semibold mk:text-neutral-950 mk:dark:text-neutral-50',
  description:
    'mk-alert-dialog__description mk:m-0 mk:text-sm mk:leading-5 mk:text-neutral-600 mk:dark:text-neutral-400',
  body: 'mk-alert-dialog__body mk:min-h-0 mk:min-w-0 mk:overflow-y-auto mk:px-6 mk:py-5',
  footer:
    'mk-alert-dialog__footer mk:flex mk:min-w-0 mk:flex-wrap mk:items-center mk:justify-end mk:gap-2 mk:px-6 mk:pb-6',
  cancel: 'mk-alert-dialog__cancel',
  action: 'mk-alert-dialog__action',
} as const

interface ClassOptions {
  size: AlertDialogSize
  animation: AlertDialogAnimation
  config?: AlertDialogStyleConfig | undefined
  ui?: AlertDialogUI | undefined
  className?: ModeKitClassValue
}

export function getAlertDialogClasses({ size, animation, config, ui, className }: ClassOptions) {
  return cn(
    alertDialogStyles({ size, animation }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.animation?.[animation],
    ui?.base,
    className,
  )
}

interface OverlayOptions {
  animation: AlertDialogAnimation
  config?: AlertDialogStyleConfig | undefined
  ui?: AlertDialogUI | undefined
}

export function getAlertDialogOverlayClasses({ animation, config, ui }: OverlayOptions) {
  return cn(
    slotClasses.overlay,
    animation === 'none'
      ? 'mk:animate-none'
      : 'mk:data-[state=open]:animate-[mk-dialog-overlay-open_160ms_ease-out] mk:data-[state=closed]:animate-[mk-dialog-overlay-close_120ms_ease-in]',
    config?.slots?.overlay,
    ui?.overlay,
  )
}

interface SlotOptions {
  slot: keyof typeof slotClasses
  config?: AlertDialogStyleConfig | undefined
  ui?: AlertDialogUI | undefined
}

export function getAlertDialogSlotClasses({ slot, config, ui }: SlotOptions) {
  return cn(slotClasses[slot], config?.slots?.[slot], ui?.[slot])
}
