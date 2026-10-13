import type { AvatarColor } from '../types.js'

interface AvatarColorClasses {
  fallback: string
  badge: string
}

export const avatarColorClasses: Record<AvatarColor, AvatarColorClasses> = {
  primary: {
    fallback: 'mk:bg-primary mk:text-primary-foreground',
    badge: 'mk:bg-primary',
  },
  secondary: {
    fallback: 'mk:bg-secondary mk:text-secondary-foreground',
    badge: 'mk:bg-secondary',
  },
  success: {
    fallback: 'mk:bg-success mk:text-success-foreground',
    badge: 'mk:bg-success',
  },
  warning: {
    fallback: 'mk:bg-warning mk:text-foreground',
    badge: 'mk:bg-warning',
  },
  info: {
    fallback: 'mk:bg-info mk:text-info-foreground',
    badge: 'mk:bg-info',
  },
  destructive: {
    fallback: 'mk:bg-destructive mk:text-destructive-foreground',
    badge: 'mk:bg-destructive',
  },
}
