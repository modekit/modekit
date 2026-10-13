import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  ButtonColor,
  ButtonCompoundVariant,
  ButtonSize,
  ButtonStyleConfig,
  ButtonUI,
  ButtonVariant,
} from '../types.js'

const buttonBaseClasses = [
  'mk-button',
  'mk:m-0 mk:inline-flex mk:appearance-none mk:items-center mk:justify-center mk:whitespace-nowrap mk:box-border mk:select-none mk:text-center mk:align-middle mk:font-medium mk:no-underline',
  'mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
  // ModeKit excludes Preflight, so borders and focus outlines must define their styles explicitly.
  'mk:border-solid mk:focus-visible:outline-2 mk:focus-visible:outline-solid mk:focus-visible:outline-offset-2',
  'mk:disabled:pointer-events-none mk:disabled:cursor-not-allowed mk:disabled:opacity-50',
  'mk:data-[mk-loading]:cursor-progress',
]

const buttonStyles = cva(buttonBaseClasses, {
  variants: {
    variant: {
      default: 'mk:border-0',
      outline: 'mk:border mk:bg-transparent',
      soft: 'mk:border-0',
      subtle: 'mk:border',
      ghost: 'mk:border-0 mk:bg-transparent',
      link: 'mk:border-0 mk:bg-transparent mk:underline-offset-4 mk:hover:underline mk:active:opacity-80',
    },
    size: {
      xs: 'mk:h-6 mk:min-w-6 mk:gap-1 mk:rounded-sm mk:px-2 mk:text-xs mk:leading-3 mk:[&>svg]:size-3.5 mk:[&>svg]:shrink-0',
      sm: 'mk:h-8 mk:min-w-8 mk:gap-1.5 mk:rounded-md mk:px-3 mk:text-sm mk:leading-4 mk:[&>svg]:size-4 mk:[&>svg]:shrink-0',
      md: 'mk:h-10 mk:min-w-10 mk:gap-2 mk:rounded-lg mk:px-4 mk:text-sm mk:leading-5 mk:[&>svg]:size-4.5 mk:[&>svg]:shrink-0',
      lg: 'mk:h-12 mk:min-w-12 mk:gap-2.5 mk:rounded-xl mk:px-5 mk:text-base mk:leading-6 mk:[&>svg]:size-5 mk:[&>svg]:shrink-0',
    },
    square: {
      true: 'mk:aspect-square mk:px-0',
      false: '',
    },
  },
})

const buttonColorStyles = cva('mk:focus-visible:outline-component', {
  variants: {
    variant: {
      default:
        'mk:bg-component mk:text-component-foreground mk:hover:bg-component-hover mk:active:bg-component-active',
      outline:
        'mk:border-component mk:text-component mk:hover:bg-component-soft mk:active:bg-component-soft-hover',
      soft: 'mk:bg-component-soft mk:text-component mk:hover:bg-component-soft-hover mk:active:bg-component-soft-active',
      subtle:
        'mk:border-component mk:bg-component-soft mk:text-component mk:hover:bg-component-soft-hover mk:active:bg-component-soft-active',
      ghost: 'mk:text-component mk:hover:bg-component-soft mk:active:bg-component-soft-hover',
      link: 'mk:text-component',
    },
  },
})

interface ButtonClassOptions {
  color: ButtonColor
  variant: ButtonVariant
  size: ButtonSize
  square: boolean
  config?: ButtonStyleConfig | undefined
  ui?: ButtonUI | undefined
  className?: ModeKitClassValue
}

function matches<T extends string>(expected: T | readonly T[] | undefined, actual: T): boolean {
  return (
    expected === undefined ||
    (Array.isArray(expected) ? (expected as readonly T[]).includes(actual) : expected === actual)
  )
}

function resolveCompoundClasses(
  compoundVariants: readonly ButtonCompoundVariant[] | undefined,
  color: ButtonColor,
  variant: ButtonVariant,
  size: ButtonSize,
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

export function getButtonClasses({
  color,
  variant,
  size,
  square,
  config,
  ui,
  className,
}: ButtonClassOptions): string {
  return cn(
    buttonStyles({ variant, size, square }),
    buttonColorStyles({ variant }),
    config?.base,
    config?.variants?.color?.[color],
    config?.variants?.variant?.[variant],
    config?.variants?.size?.[size],
    resolveCompoundClasses(config?.compoundVariants, color, variant, size),
    ui?.base,
    className,
  )
}
