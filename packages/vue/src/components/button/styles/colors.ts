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
  secondary: {
    focus: 'mk:focus-visible:outline-secondary-foreground',
    solid:
      'mk:bg-secondary mk:text-secondary-foreground mk:hover:bg-secondary/80 mk:active:bg-secondary/70',
    text: 'mk:text-secondary-foreground',
    outline: 'mk:border-border mk:hover:bg-secondary/70 mk:active:bg-secondary',
    soft: 'mk:bg-secondary/70 mk:hover:bg-secondary mk:active:bg-secondary/80',
    subtle: 'mk:border-border',
    ghost: 'mk:hover:bg-secondary/70 mk:active:bg-secondary',
  },
  muted: {
    focus: 'mk:focus-visible:outline-muted-foreground',
    solid: 'mk:bg-muted mk:text-muted-foreground mk:hover:bg-muted/80 mk:active:bg-muted/70',
    text: 'mk:text-muted-foreground',
    outline: 'mk:border-border mk:hover:bg-muted/60 mk:active:bg-muted',
    soft: 'mk:bg-muted/50 mk:hover:bg-muted/70 mk:active:bg-muted',
    subtle: 'mk:border-border',
    ghost: 'mk:hover:bg-muted/60 mk:active:bg-muted',
  },
  success: {
    focus: 'mk:focus-visible:outline-success',
    solid:
      'mk:bg-success mk:text-success-foreground mk:hover:bg-success/90 mk:active:bg-success/80',
    text: 'mk:text-success',
    outline: 'mk:border-success mk:hover:bg-success/10 mk:active:bg-success/15',
    soft: 'mk:bg-success/15 mk:hover:bg-success/20 mk:active:bg-success/25',
    subtle: 'mk:border-success',
    ghost: 'mk:hover:bg-success/10 mk:active:bg-success/15',
  },
  warning: {
    focus: 'mk:focus-visible:outline-warning',
    solid:
      'mk:bg-warning mk:text-warning-foreground mk:hover:bg-warning/90 mk:active:bg-warning/80',
    text: 'mk:text-foreground',
    outline: 'mk:border-warning mk:hover:bg-warning/20 mk:active:bg-warning/30',
    soft: 'mk:bg-warning/25 mk:hover:bg-warning/35 mk:active:bg-warning/45',
    subtle: 'mk:border-warning',
    ghost: 'mk:hover:bg-warning/20 mk:active:bg-warning/30',
  },
  info: {
    focus: 'mk:focus-visible:outline-info',
    solid: 'mk:bg-info mk:text-info-foreground mk:hover:bg-info/90 mk:active:bg-info/80',
    text: 'mk:text-info',
    outline: 'mk:border-info mk:hover:bg-info/10 mk:active:bg-info/15',
    soft: 'mk:bg-info/15 mk:hover:bg-info/20 mk:active:bg-info/25',
    subtle: 'mk:border-info',
    ghost: 'mk:hover:bg-info/10 mk:active:bg-info/15',
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
