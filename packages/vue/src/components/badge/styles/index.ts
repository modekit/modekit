import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  BadgeColor,
  BadgeCompoundVariant,
  BadgeSize,
  BadgeStyleConfig,
  BadgeUI,
  BadgeVariant,
} from '../types.js'

const badgeStyles = cva(
  [
    'mk-badge',
    'mk:inline-flex mk:box-border mk:shrink-0 mk:items-center mk:justify-center mk:whitespace-nowrap mk:align-middle mk:font-medium mk:leading-none',
    'mk:border-solid mk:[&>svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'mk:border-0',
        soft: 'mk:border-0',
        outline: 'mk:border mk:bg-transparent',
        subtle: 'mk:border',
      },
      size: {
        sm: 'mk:py-1 mk:gap-0.5 mk:rounded-sm mk:px-1.5 mk:text-xs mk:[&>svg]:size-3.5',
        md: 'mk:py-1 mk:gap-1 mk:rounded-md mk:px-2 mk:text-sm mk:[&>svg]:size-4',
        lg: 'mk:py-1.5 mk:gap-1 mk:rounded-md mk:px-2 mk:text-sm mk:[&>svg]:size-4.5',
      },
      rounded: {
        true: 'mk:rounded-full',
        false: '',
      },
    },
  },
)

const badgeColorStyles = cva('', {
  variants: {
    variant: {
      default: 'mk:bg-component mk:text-component-foreground',
      soft: 'mk:bg-component-soft mk:text-component',
      outline: 'mk:border-component mk:text-component',
      subtle: 'mk:border-component mk:bg-component-soft mk:text-component',
    },
  },
})

interface BadgeClassOptions {
  color: BadgeColor
  variant: BadgeVariant
  size: BadgeSize
  rounded: boolean
  config?: BadgeStyleConfig | undefined
  ui?: BadgeUI | undefined
  className?: ModeKitClassValue
}

function matches<T extends string | boolean>(
  expected: T | readonly T[] | undefined,
  actual: T,
): boolean {
  return (
    expected === undefined ||
    (Array.isArray(expected) ? (expected as readonly T[]).includes(actual) : expected === actual)
  )
}

function resolveCompoundClasses(
  compoundVariants: readonly BadgeCompoundVariant[] | undefined,
  color: BadgeColor,
  variant: BadgeVariant,
  size: BadgeSize,
  rounded: boolean,
): ModeKitClassValue[] {
  return (
    compoundVariants
      ?.filter(
        (compound) =>
          matches(compound.color, color) &&
          matches(compound.variant, variant) &&
          matches(compound.size, size) &&
          matches(compound.rounded, rounded),
      )
      .map((compound) => compound.class) ?? []
  )
}

export function getBadgeClasses({
  color,
  variant,
  size,
  rounded,
  config,
  ui,
  className,
}: BadgeClassOptions): string {
  return cn(
    badgeStyles({ variant, size, rounded }),
    badgeColorStyles({ variant }),
    config?.base,
    config?.variants?.color?.[color],
    config?.variants?.variant?.[variant],
    config?.variants?.size?.[size],
    config?.variants?.rounded?.[rounded ? 'true' : 'false'],
    resolveCompoundClasses(config?.compoundVariants, color, variant, size, rounded),
    ui?.base,
    className,
  )
}
