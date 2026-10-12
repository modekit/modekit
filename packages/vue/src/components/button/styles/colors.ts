import type { ButtonColor, ButtonVariant } from '../types.js'

interface ButtonColorClasses {
  focus: string
  solid: string
  text: string
  outline: string
  soft: string
  subtle: string
  ghost: string
}

interface ButtonColorCompoundVariant {
  color: ButtonColor
  variant: ButtonVariant | ButtonVariant[]
  class: string
}

export const buttonColorClasses = {
  primary: {
    focus: 'mk:focus-visible:outline-primary',
    solid:
      'mk:bg-primary mk:text-primary-foreground mk:hover:bg-primary/90 mk:active:bg-primary/80',
    text: 'mk:text-primary',
    outline: 'mk:border-primary mk:hover:bg-primary/10 mk:active:bg-primary/15',
    soft: 'mk:bg-primary/15 mk:hover:bg-primary/20 mk:active:bg-primary/25',
    subtle: 'mk:border-primary',
    ghost: 'mk:hover:bg-primary/10 mk:active:bg-primary/15',
  },
  destructive: {
    focus: 'mk:focus-visible:outline-destructive',
    solid:
      'mk:bg-destructive mk:text-destructive-foreground mk:hover:bg-destructive/90 mk:active:bg-destructive/80',
    text: 'mk:text-destructive',
    outline: 'mk:border-destructive mk:hover:bg-destructive/10 mk:active:bg-destructive/15',
    soft: 'mk:bg-destructive/15 mk:hover:bg-destructive/20 mk:active:bg-destructive/25',
    subtle: 'mk:border-destructive',
    ghost: 'mk:hover:bg-destructive/10 mk:active:bg-destructive/15',
  },
} satisfies Record<ButtonColor, ButtonColorClasses>

function createColorCompoundVariants(
  color: ButtonColor,
  classes: ButtonColorClasses,
): ButtonColorCompoundVariant[] {
  return [
    { color, variant: 'default', class: classes.solid },
    {
      color,
      variant: ['outline', 'soft', 'subtle', 'ghost', 'link'],
      class: classes.text,
    },
    { color, variant: 'outline', class: classes.outline },
    { color, variant: ['soft', 'subtle'], class: classes.soft },
    { color, variant: 'subtle', class: classes.subtle },
    { color, variant: 'ghost', class: classes.ghost },
  ]
}

export const buttonColorCompoundVariants = (
  Object.entries(buttonColorClasses) as [ButtonColor, ButtonColorClasses][]
).flatMap(([color, classes]) => createColorCompoundVariants(color, classes))
