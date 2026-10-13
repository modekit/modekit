import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  AvatarBadgePosition,
  AvatarColor,
  AvatarSize,
  AvatarStyleConfig,
  AvatarUI,
} from '../types.js'
import { avatarColorClasses } from './colors.js'

const avatarStyles = cva(
  'mk-avatar mk:relative mk:inline-flex mk:shrink-0 mk:overflow-visible mk:align-middle',
  {
    variants: {
      size: {
        xs: 'mk:size-6',
        sm: 'mk:size-8',
        md: 'mk:size-10',
        lg: 'mk:size-12',
        xl: 'mk:size-16',
      },
      square: {
        false: 'mk:rounded-full',
        true: '',
      },
    },
    compoundVariants: [
      { square: true, size: ['xs', 'sm'], class: 'mk:rounded-sm' },
      { square: true, size: ['md', 'lg'], class: 'mk:rounded-md' },
      { square: true, size: 'xl', class: 'mk:rounded-lg' },
    ],
  },
)

const avatarSlotStyles = {
  image: cva(
    'mk-avatar__image mk:size-full mk:overflow-hidden mk:rounded-[inherit] mk:object-cover',
  ),
  fallback: cva(
    [
      'mk-avatar__fallback mk:flex mk:size-full mk:select-none mk:items-center mk:justify-center mk:overflow-hidden mk:rounded-[inherit]',
      'mk:font-medium mk:uppercase mk:leading-none mk:[&>svg]:shrink-0',
    ],
    {
      variants: {
        size: {
          xs: 'mk:text-[10px] mk:[&>svg]:size-3',
          sm: 'mk:text-xs mk:[&>svg]:size-4',
          md: 'mk:text-sm mk:[&>svg]:size-5',
          lg: 'mk:text-base mk:[&>svg]:size-6',
          xl: 'mk:text-xl mk:[&>svg]:size-8',
        },
      },
    },
  ),
  badge: cva(
    [
      'mk-avatar__badge mk:absolute mk:z-10 mk:block mk:rounded-full',
      'mk:ring-2 mk:ring-background',
    ],
    {
      variants: {
        size: {
          xs: 'mk:size-1.5',
          sm: 'mk:size-2',
          md: 'mk:size-2.5',
          lg: 'mk:size-3',
          xl: 'mk:size-4',
        },
        badgePosition: {
          'top-left': 'mk:top-0.5 mk:left-0.5',
          'top-right': 'mk:top-0.5 mk:right-0.5',
          'bottom-left': 'mk:bottom-0.5 mk:left-0.5',
          'bottom-right': 'mk:right-0.5 mk:bottom-0.5',
        },
      },
    },
  ),
} as const

interface AvatarClassOptions {
  color: AvatarColor
  size: AvatarSize
  square: boolean
  config?: AvatarStyleConfig | undefined
  ui?: AvatarUI | undefined
  className?: ModeKitClassValue
}

type AvatarSlot = Exclude<keyof AvatarUI, 'base'>

interface AvatarSlotClassOptions {
  slot: AvatarSlot
  color: AvatarColor
  badgeColor: AvatarColor
  size: AvatarSize
  badgePosition: AvatarBadgePosition
  config?: AvatarStyleConfig | undefined
  ui?: AvatarUI | undefined
}

export function getAvatarClasses({
  color,
  size,
  square,
  config,
  ui,
  className,
}: AvatarClassOptions): string {
  return cn(
    avatarStyles({ size, square }),
    config?.base,
    config?.variants?.color?.[color],
    config?.variants?.size?.[size],
    config?.variants?.square?.[String(square) as 'true' | 'false'],
    ui?.base,
    className,
  )
}

export function getAvatarSlotClasses({
  slot,
  color,
  badgeColor,
  size,
  badgePosition,
  config,
  ui,
}: AvatarSlotClassOptions): string {
  return cn(
    avatarSlotStyles[slot]({ size, badgePosition }),
    slot === 'fallback' ? avatarColorClasses[color].fallback : undefined,
    slot === 'badge' ? avatarColorClasses[badgeColor].badge : undefined,
    slot === 'badge' ? config?.variants?.badgeColor?.[badgeColor] : undefined,
    slot === 'badge' ? config?.variants?.badgePosition?.[badgePosition] : undefined,
    config?.slots?.[slot],
    ui?.[slot],
  )
}
