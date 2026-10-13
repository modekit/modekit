import type { CalloutColor, CalloutVariant } from '../types.js'

interface CalloutColorClasses {
  solid: string
  solidText: string
  text: string
  outline: string
  soft: string
}

interface CalloutColorCompoundVariant {
  color: CalloutColor
  variant: CalloutVariant | CalloutVariant[]
  class: string
}

export const calloutColorClasses = {
  primary: {
    solid: 'mk:bg-primary',
    solidText: 'mk:text-primary-foreground',
    text: 'mk:text-primary',
    outline: 'mk:border-primary',
    soft: 'mk:bg-primary/15',
  },
  secondary: {
    solid: 'mk:bg-secondary',
    solidText: 'mk:text-secondary-foreground',
    text: 'mk:text-secondary-foreground',
    outline: 'mk:border-border',
    soft: 'mk:bg-secondary/70',
  },
  muted: {
    solid: 'mk:bg-muted',
    solidText: 'mk:text-muted-foreground',
    text: 'mk:text-muted-foreground',
    outline: 'mk:border-border',
    soft: 'mk:bg-muted/50',
  },
  success: {
    solid: 'mk:bg-success',
    solidText: 'mk:text-success-foreground',
    text: 'mk:text-success',
    outline: 'mk:border-success',
    soft: 'mk:bg-success/15',
  },
  warning: {
    solid: 'mk:bg-warning',
    solidText: 'mk:text-warning-foreground',
    text: 'mk:text-foreground',
    outline: 'mk:border-warning',
    soft: 'mk:bg-warning/25',
  },
  info: {
    solid: 'mk:bg-info',
    solidText: 'mk:text-info-foreground',
    text: 'mk:text-info',
    outline: 'mk:border-info',
    soft: 'mk:bg-info/15',
  },
  destructive: {
    solid: 'mk:bg-destructive',
    solidText: 'mk:text-destructive-foreground',
    text: 'mk:text-destructive',
    outline: 'mk:border-destructive',
    soft: 'mk:bg-destructive/15',
  },
} satisfies Record<CalloutColor, CalloutColorClasses>

function createColorCompoundVariants(
  color: CalloutColor,
  classes: CalloutColorClasses,
): CalloutColorCompoundVariant[] {
  return [
    {
      color,
      variant: 'solid',
      class: `${classes.solid} ${classes.solidText}`,
    },
    {
      color,
      variant: ['soft', 'outline'],
      class: classes.text,
    },
    {
      color,
      variant: 'soft',
      class: classes.soft,
    },
    {
      color,
      variant: 'outline',
      class: classes.outline,
    },
  ]
}

export const calloutColorCompoundVariants = (
  Object.entries(calloutColorClasses) as [CalloutColor, CalloutColorClasses][]
).flatMap(([color, classes]) => createColorCompoundVariants(color, classes))
