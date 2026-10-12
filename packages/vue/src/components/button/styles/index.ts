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
import { buttonColorClasses, buttonColorCompoundVariants } from './colors.js'

const buttonBaseClasses = [
  'mk-button',
  'm-0 inline-flex appearance-none items-center justify-center whitespace-nowrap box-border select-none text-center align-middle font-medium no-underline',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  // ModeKit excludes Preflight, so borders and focus outlines must define their styles explicitly.
  'border-solid focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'data-[mk-loading]:cursor-progress',
]

const buttonStyles = cva(buttonBaseClasses, {
  variants: {
    color: {
      primary: buttonColorClasses.primary.focus,
      destructive: buttonColorClasses.destructive.focus,
    },
    variant: {
      default: 'border-0',
      outline: 'border bg-transparent',
      soft: 'border-0',
      subtle: 'border',
      ghost: 'border-0 bg-transparent',
      link: 'border-0 bg-transparent underline-offset-4 hover:underline active:opacity-80',
    },
    size: {
      xs: 'h-6 min-w-6 gap-1 rounded px-2 text-xs leading-3',
      sm: 'h-8 min-w-8 gap-1.5 rounded-md px-3 text-sm leading-4',
      md: 'h-10 min-w-10 gap-2 rounded-lg px-4 text-sm leading-5',
      lg: 'h-12 min-w-12 gap-2.5 rounded-xl px-5 text-base leading-6',
    },
  },
  compoundVariants: buttonColorCompoundVariants,
  defaultVariants: {
    color: 'primary',
    variant: 'default',
    size: 'md',
  },
})

interface ButtonClassOptions {
  color: ButtonColor
  variant: ButtonVariant
  size: ButtonSize
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
  config,
  ui,
  className,
}: ButtonClassOptions): string {
  return cn(
    buttonStyles({ color, variant, size }),
    config?.base,
    config?.variants?.color?.[color],
    config?.variants?.variant?.[variant],
    config?.variants?.size?.[size],
    resolveCompoundClasses(config?.compoundVariants, color, variant, size),
    ui?.base,
    className,
  )
}
