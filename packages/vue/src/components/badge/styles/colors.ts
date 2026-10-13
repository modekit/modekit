import type { BadgeColor, BadgeVariant } from '../types.js'

interface BadgeColorClasses {
  solid: string
  text: string
  outline: string
  soft: string
}

interface BadgeColorCompoundVariant {
  color: BadgeColor
  variant: BadgeVariant | BadgeVariant[]
  class: string
}

export const badgeColorClasses = {
  primary: {
    solid: 'mk:bg-primary mk:text-primary-foreground',
    text: 'mk:text-primary',
    outline: 'mk:border-primary',
    soft: 'mk:bg-primary/15',
  },
  secondary: {
    solid: 'mk:bg-secondary mk:text-secondary-foreground',
    text: 'mk:text-secondary-foreground',
    outline: 'mk:border-border',
    soft: 'mk:bg-secondary/70',
  },
  success: {
    solid: 'mk:bg-success mk:text-success-foreground',
    text: 'mk:text-success',
    outline: 'mk:border-success',
    soft: 'mk:bg-success/15',
  },
  warning: {
    solid: 'mk:bg-warning mk:text-warning-foreground',
    text: 'mk:text-foreground',
    outline: 'mk:border-warning',
    soft: 'mk:bg-warning/25',
  },
  info: {
    solid: 'mk:bg-info mk:text-info-foreground',
    text: 'mk:text-info',
    outline: 'mk:border-info',
    soft: 'mk:bg-info/15',
  },
  destructive: {
    solid: 'mk:bg-destructive mk:text-destructive-foreground',
    text: 'mk:text-destructive',
    outline: 'mk:border-destructive',
    soft: 'mk:bg-destructive/15',
  },
} satisfies Record<BadgeColor, BadgeColorClasses>

function createColorCompoundVariants(
  color: BadgeColor,
  classes: BadgeColorClasses,
): BadgeColorCompoundVariant[] {
  return [
    { color, variant: 'default', class: classes.solid },
    { color, variant: ['soft', 'outline', 'subtle'], class: classes.text },
    { color, variant: ['soft', 'subtle'], class: classes.soft },
    { color, variant: ['outline', 'subtle'], class: classes.outline },
  ]
}

export const badgeColorCompoundVariants = (
  Object.entries(badgeColorClasses) as [BadgeColor, BadgeColorClasses][]
).flatMap(([color, classes]) => createColorCompoundVariants(color, classes))
