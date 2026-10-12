import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { CardBody, CardSize, CardStyleConfig, CardUI, CardVariant } from '../types.js'

const shadowFoundation =
  '[--tw-inset-shadow:0_0_#0000] [--tw-inset-ring-shadow:0_0_#0000] [--tw-ring-offset-shadow:0_0_#0000] [--tw-ring-shadow:0_0_#0000]'

const cardStyles = cva(
  [
    'mk-card box-border flex min-w-0 flex-col',
    // ModeKit excludes Preflight, so borders and shadow variables are explicit.
    'border-solid',
    shadowFoundation,
  ],
  {
    variants: {
      variant: {
        default: 'border border-current/10 bg-transparent shadow-sm',
        muted: 'border border-current/10 bg-muted',
        outline: 'border border-current/20 bg-transparent',
      },
      size: {
        sm: 'gap-3 rounded-xl p-4',
        md: 'gap-4 rounded-2xl p-6',
        lg: 'gap-6 rounded-2xl p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

const cardBodyStyles = cva(['mk-card__body min-w-0', shadowFoundation], {
  variants: {
    body: {
      seamless: '',
      inset: 'border border-solid border-current/10',
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
    { body: 'inset', size: 'sm', class: '-mx-3 rounded-lg p-4' },
    { body: 'inset', size: 'md', class: '-mx-5 rounded-xl p-5' },
    { body: 'inset', size: 'lg', class: '-mx-7 rounded-xl p-6' },
    {
      body: 'inset',
      variant: 'muted',
      class: 'bg-white shadow-sm dark:bg-neutral-950',
    },
    {
      body: 'inset',
      variant: ['default', 'outline'],
      class: 'bg-muted shadow-inner',
    },
  ],
})

const cardSlotClasses = {
  header: 'mk-card__header flex min-w-0 flex-col gap-1',
  footer: 'mk-card__footer flex min-w-0 items-center',
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
