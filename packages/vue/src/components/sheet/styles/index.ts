import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { SheetSide, SheetSize, SheetStyleConfig, SheetUI, SheetVariant } from '../types.js'

const sheetStyles = cva(
  [
    'mk-sheet mk:fixed mk:z-[51] mk:box-border mk:flex mk:max-h-dvh mk:max-w-full mk:flex-col mk:overflow-hidden',
    'mk:border-neutral-200 mk:bg-white mk:text-neutral-950 mk:shadow-raised-xl mk:outline-none',
    'mk:transition-transform mk:duration-[calc(360ms*var(--drawer-swipe-strength,1))] mk:ease-[cubic-bezier(0.32,0.72,0,1)]',
    'mk:data-[swiping]:duration-0 mk:motion-reduce:animate-none mk:motion-reduce:transition-none',
    'mk:focus-visible:outline-2 mk:focus-visible:outline-offset-[-2px] mk:focus-visible:outline-primary',
    'mk:dark:border-white/10 mk:dark:bg-neutral-900 mk:dark:text-neutral-50',
  ],
  {
    variants: {
      side: {
        top: [
          'mk:inset-x-0 mk:top-0 mk:w-full',
          'mk:[transform:translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))]',
          'mk:data-[state=open]:animate-[mk-sheet-top-open_240ms_cubic-bezier(0.32,0.72,0,1)] mk:data-[state=closed]:animate-[mk-sheet-top-close_200ms_ease-in]',
        ],
        right: [
          'mk:inset-y-0 mk:right-0 mk:h-dvh',
          'mk:[transform:translateX(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-x,0px)))]',
          'mk:data-[state=open]:animate-[mk-sheet-right-open_240ms_cubic-bezier(0.32,0.72,0,1)] mk:data-[state=closed]:animate-[mk-sheet-right-close_200ms_ease-in]',
        ],
        bottom: [
          'mk:inset-x-0 mk:bottom-0 mk:w-full',
          'mk:[transform:translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))]',
          'mk:data-[state=open]:animate-[mk-sheet-bottom-open_240ms_cubic-bezier(0.32,0.72,0,1)] mk:data-[state=closed]:animate-[mk-sheet-bottom-close_200ms_ease-in]',
        ],
        left: [
          'mk:inset-y-0 mk:left-0 mk:h-dvh',
          'mk:[transform:translateX(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-x,0px)))]',
          'mk:data-[state=open]:animate-[mk-sheet-left-open_240ms_cubic-bezier(0.32,0.72,0,1)] mk:data-[state=closed]:animate-[mk-sheet-left-close_200ms_ease-in]',
        ],
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
      variant: {
        edge: '',
        inset: '',
      },
    },
    compoundVariants: [
      {
        side: 'top',
        variant: 'edge',
        class:
          'mk:max-h-[calc(100dvh-1rem)] mk:rounded-b-xl mk:border-x-0 mk:border-t-0 mk:border-b mk:border-solid',
      },
      {
        side: 'right',
        variant: 'edge',
        class:
          'mk:max-w-[calc(100vw-1rem)] mk:rounded-l-xl mk:border-y-0 mk:border-r-0 mk:border-l mk:border-solid',
      },
      {
        side: 'bottom',
        variant: 'edge',
        class:
          'mk:max-h-[calc(100dvh-1rem)] mk:rounded-t-xl mk:border-x-0 mk:border-b-0 mk:border-t mk:border-solid',
      },
      {
        side: 'left',
        variant: 'edge',
        class:
          'mk:max-w-[calc(100vw-1rem)] mk:rounded-r-xl mk:border-y-0 mk:border-r mk:border-l-0 mk:border-solid',
      },
      {
        side: 'top',
        variant: 'inset',
        class:
          'mk:inset-x-4 mk:top-4 mk:w-auto mk:max-h-[calc(100dvh-2rem)] mk:rounded-xl mk:border mk:border-solid',
      },
      {
        side: 'right',
        variant: 'inset',
        class:
          'mk:inset-y-4 mk:right-4 mk:h-auto mk:max-w-[calc(100vw-2rem)] mk:rounded-xl mk:border mk:border-solid',
      },
      {
        side: 'bottom',
        variant: 'inset',
        class:
          'mk:inset-x-4 mk:bottom-4 mk:w-auto mk:max-h-[calc(100dvh-2rem)] mk:rounded-xl mk:border mk:border-solid',
      },
      {
        side: 'left',
        variant: 'inset',
        class:
          'mk:inset-y-4 mk:left-4 mk:h-auto mk:max-w-[calc(100vw-2rem)] mk:rounded-xl mk:border mk:border-solid',
      },
      { side: ['left', 'right'], size: 'sm', class: 'mk:w-80' },
      { side: ['left', 'right'], size: 'md', class: 'mk:w-96' },
      { side: ['left', 'right'], size: 'lg', class: 'mk:w-lg' },
      { side: ['left', 'right'], size: 'xl', class: 'mk:w-2xl' },
      { side: ['top', 'bottom'], size: 'sm', class: 'mk:max-h-[40dvh]' },
      { side: ['top', 'bottom'], size: 'md', class: 'mk:max-h-[60dvh]' },
      { side: ['top', 'bottom'], size: 'lg', class: 'mk:max-h-[75dvh]' },
      { side: ['top', 'bottom'], size: 'xl', class: 'mk:max-h-[90dvh]' },
    ],
  },
)

const sheetSlotClasses = {
  overlay: [
    'mk-sheet__overlay mk:fixed mk:inset-0 mk:z-50 mk:bg-black/50 mk:backdrop-blur-[2px]',
    'mk:data-[state=open]:animate-[mk-dialog-overlay-open_160ms_ease-out] mk:data-[state=closed]:animate-[mk-dialog-overlay-close_120ms_ease-in] mk:motion-reduce:animate-none',
  ],
  handle: [
    'mk-sheet__handle mk:absolute mk:z-10 mk:rounded-full mk:bg-neutral-300 mk:dark:bg-neutral-600',
    'mk:data-[side=top]:right-1/2 mk:data-[side=top]:bottom-2 mk:data-[side=top]:h-1 mk:data-[side=top]:w-10 mk:data-[side=top]:translate-x-1/2',
    'mk:data-[side=bottom]:top-2 mk:data-[side=bottom]:right-1/2 mk:data-[side=bottom]:h-1 mk:data-[side=bottom]:w-10 mk:data-[side=bottom]:translate-x-1/2',
    'mk:data-[side=left]:top-1/2 mk:data-[side=left]:right-2 mk:data-[side=left]:h-10 mk:data-[side=left]:w-1 mk:data-[side=left]:-translate-y-1/2',
    'mk:data-[side=right]:top-1/2 mk:data-[side=right]:left-2 mk:data-[side=right]:h-10 mk:data-[side=right]:w-1 mk:data-[side=right]:-translate-y-1/2',
  ],
  container: 'mk-sheet__container mk:flex mk:min-h-0 mk:w-full mk:flex-1 mk:flex-col',
  header: 'mk-sheet__header mk:flex mk:min-w-0 mk:items-start mk:gap-4 mk:px-6 mk:pt-6 mk:pr-14',
  wrapper: 'mk-sheet__wrapper mk:min-w-0 mk:flex-1',
  title:
    'mk-sheet__title mk:m-0 mk:text-lg mk:leading-6 mk:font-semibold mk:text-neutral-950 mk:dark:text-neutral-50',
  description:
    'mk-sheet__description mk:mt-1.5 mk:mb-0 mk:text-sm mk:leading-5 mk:text-neutral-600 mk:dark:text-neutral-400',
  actions: 'mk-sheet__actions mk:flex mk:shrink-0 mk:items-center mk:gap-2',
  body: 'mk-sheet__body mk:min-h-0 mk:min-w-0 mk:flex-1 mk:overflow-y-auto mk:px-6 mk:py-5',
  footer:
    'mk-sheet__footer mk:flex mk:min-w-0 mk:flex-wrap mk:items-center mk:justify-end mk:gap-2 mk:px-6 mk:pb-6',
  close: [
    'mk-sheet__close mk:absolute mk:top-4 mk:right-4 mk:box-border mk:inline-flex mk:size-8 mk:items-center mk:justify-center mk:rounded-md mk:border-0 mk:bg-transparent mk:p-0 mk:text-neutral-500',
    'mk:cursor-pointer mk:transition-colors mk:hover:bg-neutral-100 mk:hover:text-neutral-950 mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-primary mk:disabled:pointer-events-none mk:disabled:opacity-50',
    'mk:dark:text-neutral-400 mk:dark:hover:bg-white/10 mk:dark:hover:text-neutral-50 mk:[&>svg]:size-4',
  ],
} as const

interface SheetClassOptions {
  side: SheetSide
  size: SheetSize
  variant: SheetVariant
  config?: SheetStyleConfig | undefined
  ui?: SheetUI | undefined
  className?: ModeKitClassValue
}

export function getSheetClasses({
  side,
  size,
  variant,
  config,
  ui,
  className,
}: SheetClassOptions): string {
  return cn(
    sheetStyles({ side, size, variant }),
    config?.base,
    config?.variants?.side?.[side],
    config?.variants?.size?.[size],
    config?.variants?.variant?.[variant],
    ui?.base,
    className,
  )
}

interface SheetSlotClassOptions {
  slot: Exclude<keyof SheetUI, 'base'>
  config?: SheetStyleConfig | undefined
  ui?: SheetUI | undefined
}

export function getSheetSlotClasses({ slot, config, ui }: SheetSlotClassOptions): string {
  return cn(sheetSlotClasses[slot], config?.slots?.[slot], ui?.[slot])
}
