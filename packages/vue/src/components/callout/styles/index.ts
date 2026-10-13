import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  CalloutColor,
  CalloutCompoundVariant,
  CalloutSize,
  CalloutSlot,
  CalloutStyleConfig,
  CalloutUI,
  CalloutVariant,
} from '../types.js'
import { calloutColorCompoundVariants } from './colors.js'

const calloutStyles = cva(
  ['mk-callout', 'mk:relative mk:box-border mk:flex mk:min-w-0 mk:items-start mk:border-solid'],
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        muted: '',
        success: '',
        warning: '',
        info: '',
        destructive: '',
      },
      variant: {
        solid: 'mk:border-0',
        soft: 'mk:border-0',
        outline: 'mk:border mk:bg-surface',
      },
      size: {
        sm: 'mk:gap-2.5 mk:rounded-lg mk:p-3',
        md: 'mk:gap-3 mk:rounded-xl mk:p-4',
        lg: 'mk:gap-3.5 mk:rounded-xl mk:p-5',
      },
    },
    compoundVariants: calloutColorCompoundVariants,
  },
)

const calloutSlotStyles = {
  icon: cva('mk-callout__icon mk:mt-0.5 mk:flex mk:shrink-0 mk:items-center mk:justify-center', {
    variants: {
      size: {
        sm: 'mk:size-4 mk:[&>svg]:size-4',
        md: 'mk:size-5 mk:[&>svg]:size-5',
        lg: 'mk:size-6 mk:[&>svg]:size-6',
      },
    },
  }),
  content: cva('mk-callout__content mk:flex mk:min-w-0 mk:flex-1 mk:flex-col', {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
  }),
  title: cva('mk-callout__title mk:font-semibold', {
    variants: {
      size: {
        sm: 'mk:text-sm mk:leading-5',
        md: 'mk:text-sm mk:leading-5',
        lg: 'mk:text-base mk:leading-6',
      },
    },
  }),
  description: cva('mk-callout__description mk:opacity-90', {
    variants: {
      size: {
        sm: 'mk:text-xs mk:leading-4',
        md: 'mk:text-sm mk:leading-5',
        lg: 'mk:text-sm mk:leading-5',
      },
    },
  }),
  actions: cva('mk-callout__actions mk:flex mk:flex-wrap mk:items-center', {
    variants: {
      size: {
        sm: 'mk:mt-2 mk:gap-2',
        md: 'mk:mt-3 mk:gap-2',
        lg: 'mk:mt-4 mk:gap-3',
      },
    },
  }),
  close: cva(
    [
      'mk-callout__close',
      'mk:-m-1 mk:inline-flex mk:shrink-0 mk:cursor-pointer mk:items-center mk:justify-center mk:rounded-md mk:border-0 mk:bg-transparent mk:p-1 mk:text-current mk:opacity-70 mk:transition-opacity',
      'mk:hover:opacity-100 mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-current mk:disabled:pointer-events-none mk:disabled:opacity-50',
    ],
    {
      variants: {
        size: {
          sm: 'mk:size-6 mk:[&>svg]:size-3.5',
          md: 'mk:size-7 mk:[&>svg]:size-4',
          lg: 'mk:size-8 mk:[&>svg]:size-4.5',
        },
      },
    },
  ),
} satisfies Record<CalloutSlot, (options: { size: CalloutSize }) => string>

interface CalloutClassOptions {
  color: CalloutColor
  variant: CalloutVariant
  size: CalloutSize
  config?: CalloutStyleConfig | undefined
  ui?: CalloutUI | undefined
  className?: ModeKitClassValue
}

function matches<T extends string>(expected: T | readonly T[] | undefined, actual: T): boolean {
  return (
    expected === undefined ||
    (Array.isArray(expected) ? (expected as readonly T[]).includes(actual) : expected === actual)
  )
}

function resolveCompoundClasses(
  compoundVariants: readonly CalloutCompoundVariant[] | undefined,
  color: CalloutColor,
  variant: CalloutVariant,
  size: CalloutSize,
): ModeKitClassValue[] {
  return (
    compoundVariants
      ?.filter(
        (compound) =>
          matches(compound.color, color) &&
          matches(compound.variant, variant) &&
          matches(compound.size, size),
      )
      .map((compound) => compound.class) ?? []
  )
}

export function getCalloutClasses({
  color,
  variant,
  size,
  config,
  ui,
  className,
}: CalloutClassOptions): string {
  return cn(
    calloutStyles({ color, variant, size }),
    config?.base,
    config?.variants?.color?.[color],
    config?.variants?.variant?.[variant],
    config?.variants?.size?.[size],
    resolveCompoundClasses(config?.compoundVariants, color, variant, size),
    ui?.base,
    className,
  )
}

interface CalloutSlotClassOptions {
  slot: CalloutSlot
  size: CalloutSize
  config?: CalloutStyleConfig | undefined
  ui?: CalloutUI | undefined
}

export function getCalloutSlotClasses({ slot, size, config, ui }: CalloutSlotClassOptions): string {
  return cn(calloutSlotStyles[slot]({ size }), config?.slots?.[slot], ui?.[slot])
}
