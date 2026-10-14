import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  CardBodyTreatment,
  CardEdgeStyleConfig,
  CardEdgeUI,
  CardSize,
  CardStyleConfig,
  CardUI,
  CardVariant,
} from '../types.js'

const cardStyles = cva(
  'mk-card mk:box-border mk:min-w-0 mk:text-neutral-950 mk:dark:text-neutral-50',
  {
    variants: {
      variant: {
        shadow: 'mk:bg-white mk:shadow-raised mk:dark:bg-white/10',
        muted: 'mk:bg-neutral-100 mk:dark:bg-neutral-800',
        // ModeKit excludes Preflight, so the border style must be explicit.
        outline:
          'mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:dark:border-neutral-800 mk:dark:bg-white/10',
        plain: 'mk:bg-white mk:dark:bg-white/10',
      },
      size: {
        sm: 'mk:rounded-lg mk:p-4',
        md: 'mk:rounded-xl mk:p-6',
        lg: 'mk:rounded-2xl mk:p-8',
      },
    },
  },
)

const cardBodyStyles = cva(
  'mk-card__body mk:min-w-0 mk:[--mk-card-edge-inline:var(--mk-card-root-padding)] mk:[--mk-card-edge-block-start:0px] mk:[--mk-card-edge-block-end:0px] mk:[--mk-card-edge-radius-start:0px] mk:[--mk-card-edge-radius-end:0px] mk:first:[--mk-card-edge-block-start:var(--mk-card-root-padding)] mk:first:[--mk-card-edge-radius-start:var(--mk-card-root-radius)] mk:last:[--mk-card-edge-block-end:var(--mk-card-root-padding)] mk:last:[--mk-card-edge-radius-end:var(--mk-card-root-radius)]',
  {
    variants: {
      treatment: {
        seamless: '',
        inset: 'mk:border mk:border-solid mk:border-neutral-200 mk:dark:border-neutral-700',
        flush: 'mk:border mk:border-solid mk:border-neutral-200 mk:dark:border-neutral-700',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      variant: {
        shadow: '',
        muted: '',
        outline: '',
        plain: '',
      },
    },
    compoundVariants: [
      {
        treatment: 'inset',
        size: 'sm',
        class: 'mk:-mx-3 mk:rounded-md mk:p-4 mk:first:-mt-3 mk:last:-mb-3',
      },
      {
        treatment: 'inset',
        size: 'md',
        class: 'mk:-mx-5 mk:rounded-lg mk:p-5 mk:first:-mt-5 mk:last:-mb-5',
      },
      {
        treatment: 'inset',
        size: 'lg',
        class: 'mk:-mx-7 mk:rounded-xl mk:p-6 mk:first:-mt-7 mk:last:-mb-7',
      },
      {
        treatment: 'flush',
        size: 'sm',
        class: 'mk:-mx-4 mk:rounded-lg mk:p-4 mk:first:-mt-4 mk:last:-mb-4',
      },
      {
        treatment: 'flush',
        size: 'md',
        class: 'mk:-mx-6 mk:rounded-xl mk:p-5 mk:first:-mt-6 mk:last:-mb-6',
      },
      {
        treatment: 'flush',
        size: 'lg',
        class: 'mk:-mx-8 mk:rounded-2xl mk:p-6 mk:first:-mt-8 mk:last:-mb-8',
      },
      {
        treatment: ['inset', 'flush'],
        variant: 'muted',
        class: 'mk:bg-white mk:shadow-sm mk:dark:bg-neutral-900',
      },
      {
        treatment: ['inset', 'flush'],
        variant: 'shadow',
        class: 'mk:bg-neutral-50 mk:shadow-inner mk:dark:bg-black/20',
      },
      {
        treatment: ['inset', 'flush'],
        variant: 'outline',
        class: 'mk:bg-neutral-50 mk:shadow-inner mk:dark:bg-black/20',
      },
      {
        treatment: ['inset', 'flush'],
        variant: 'plain',
        class: 'mk:bg-neutral-50 mk:shadow-inner mk:dark:bg-black/20',
      },
    ],
  },
)

const cardEdgeStyles = cva(
  'mk-card-edge mk:box-border mk:block mk:min-w-0 mk:overflow-hidden mk:-mx-[var(--mk-card-edge-inline)] mk:first:-mt-[var(--mk-card-edge-block-start)] mk:first:rounded-t-[var(--mk-card-edge-radius-start)] mk:last:-mb-[var(--mk-card-edge-block-end)] mk:last:rounded-b-[var(--mk-card-edge-radius-end)]',
)

const cardSlotClasses = {
  header: 'mk-card__header mk:flex mk:min-w-0 mk:items-start mk:justify-between mk:gap-3',
  headerContent: 'mk-card__header-content mk:flex mk:min-w-0 mk:flex-1 mk:flex-col mk:gap-1',
  headerActions: 'mk-card__header-actions mk:ml-auto mk:flex mk:shrink-0 mk:items-center mk:gap-2',
  footer: 'mk-card__footer mk:flex mk:min-w-0 mk:items-center',
} as const

interface CardClassOptions {
  variant: CardVariant
  size: CardSize
  config?: CardStyleConfig | undefined
  ui?: CardUI | undefined
  className?: ModeKitClassValue
}

export function getCardClasses({ variant, size, config, ui, className }: CardClassOptions): string {
  return cn(
    cardStyles({ variant, size }),
    config?.base,
    config?.variants?.variant?.[variant],
    config?.variants?.size?.[size],
    ui?.base,
    className,
  )
}

interface CardSlotClassOptions {
  slot: Exclude<keyof CardUI, 'base'>
  body: CardBodyTreatment
  size: CardSize
  variant: CardVariant
  config?: CardStyleConfig | undefined
  ui?: CardUI | undefined
}

export function getCardSlotClasses({
  slot,
  body,
  size,
  variant,
  config,
  ui,
}: CardSlotClassOptions): string {
  const builtIn =
    slot === 'body' ? cardBodyStyles({ treatment: body, size, variant }) : cardSlotClasses[slot]

  return cn(
    builtIn,
    slot === 'body' ? config?.variants?.body?.[body] : undefined,
    config?.slots?.[slot],
    ui?.[slot],
  )
}

interface CardEdgeClassOptions {
  config?: CardEdgeStyleConfig | undefined
  ui?: CardEdgeUI | undefined
  className?: ModeKitClassValue
}

export function getCardEdgeClasses({ config, ui, className }: CardEdgeClassOptions): string {
  return cn(cardEdgeStyles(), config?.base, ui?.base, className)
}
