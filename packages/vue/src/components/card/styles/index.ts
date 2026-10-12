import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { CardBody, CardSize, CardStyleConfig, CardUI, CardVariant } from '../types.js'

const cardStyles = cva(
  [
    'mk-card mk:box-border mk:flex mk:min-w-0 mk:flex-col mk:text-surface-foreground',
    // ModeKit excludes Preflight, so the border style must be explicit.
    'mk:border-solid',
  ],
  {
    variants: {
      variant: {
        default: 'mk:border mk:border-border mk:bg-surface mk:shadow-sm',
        muted: 'mk:border mk:border-border mk:bg-muted',
        outline: 'mk:border mk:border-border mk:bg-transparent',
      },
      size: {
        sm: 'mk:gap-3 mk:rounded-xl mk:p-4',
        md: 'mk:gap-4 mk:rounded-2xl mk:p-6',
        lg: 'mk:gap-6 mk:rounded-2xl mk:p-8',
      },
    },
  },
)

const cardBodyStyles = cva('mk-card__body mk:min-w-0', {
  variants: {
    body: {
      seamless: '',
      inset: 'mk:border mk:border-solid mk:border-border',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    variant: {
      default: '',
      muted: '',
      outline: '',
    },
  },
  compoundVariants: [
    { body: 'inset', size: 'sm', class: 'mk:-mx-3 mk:rounded-lg mk:p-4' },
    { body: 'inset', size: 'md', class: 'mk:-mx-5 mk:rounded-xl mk:p-5' },
    { body: 'inset', size: 'lg', class: 'mk:-mx-7 mk:rounded-xl mk:p-6' },
    {
      body: 'inset',
      variant: 'muted',
      class: 'mk:bg-surface mk:text-surface-foreground mk:shadow-sm',
    },
    {
      body: 'inset',
      variant: ['default', 'outline'],
      class: 'mk:bg-muted mk:shadow-inner',
    },
  ],
})

const cardSlotClasses = {
  header: 'mk-card__header mk:flex mk:min-w-0 mk:flex-col mk:gap-1',
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
  body: CardBody
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
  if (slot === 'body') {
    return cn(
      cardBodyStyles({ body, size, variant }),
      config?.variants?.body?.[body],
      config?.slots?.body,
      ui?.body,
    )
  }

  return cn(cardSlotClasses[slot], config?.slots?.[slot], ui?.[slot])
}
