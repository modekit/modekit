import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { CardSize, CardStyleConfig, CardUI, CardVariant } from '../types.js'

const cardStyles = cva(
  [
    'mk-card mk:box-border mk:flex mk:min-w-0 mk:flex-col mk:text-surface-foreground',
    // ModeKit excludes Preflight, so the border style must be explicit.
    'mk:border-solid',
  ],
  {
    variants: {
      variant: {
        default:
          'mk:border mk:border-border mk:bg-surface mk:[box-shadow:var(--mk-elevation-raised)]',
        muted: 'mk:border mk:border-border mk:bg-muted',
        outline: 'mk:border mk:border-border mk:bg-transparent',
      },
      size: {
        sm: 'mk:gap-3 mk:rounded-lg mk:p-4',
        md: 'mk:gap-4 mk:rounded-xl mk:p-6',
        lg: 'mk:gap-6 mk:rounded-2xl mk:p-8',
      },
    },
  },
)

const cardSlotClasses = {
  header: 'mk-card__header mk:flex mk:min-w-0 mk:flex-col mk:gap-1',
  body: 'mk-card__body mk:min-w-0',
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
  slot: 'header' | 'body' | 'footer'
  config?: CardStyleConfig | undefined
  ui?: CardUI | undefined
}

export function getCardSlotClasses({ slot, config, ui }: CardSlotClassOptions): string {
  return cn(cardSlotClasses[slot], config?.slots?.[slot], ui?.[slot])
}
