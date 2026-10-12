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
    focus: 'focus-visible:outline-primary',
    solid: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    text: 'text-primary',
    outline: 'border-primary hover:bg-primary/10 active:bg-primary/15',
    soft: 'bg-primary/15 hover:bg-primary/20 active:bg-primary/25',
    subtle: 'border-primary',
    ghost: 'hover:bg-primary/10 active:bg-primary/15',
  },
  destructive: {
    focus: 'focus-visible:outline-destructive',
    solid:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
    text: 'text-destructive',
    outline: 'border-destructive hover:bg-destructive/10 active:bg-destructive/15',
    soft: 'bg-destructive/15 hover:bg-destructive/20 active:bg-destructive/25',
    subtle: 'border-destructive',
    ghost: 'hover:bg-destructive/10 active:bg-destructive/15',
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
