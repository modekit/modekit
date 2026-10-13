import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  AvatarGroupSlot,
  AvatarGroupSpacing,
  AvatarGroupStyleConfig,
  AvatarColor,
  AvatarGroupUI,
  AvatarSize,
} from '../types.js'

const avatarGroupStyles = cva(
  [
    'mk-avatar-group mk:inline-flex mk:isolate mk:items-center mk:align-middle',
    'mk:[&>.mk-avatar]:ring-2 mk:[&>.mk-avatar]:ring-background',
    'mk:[&>.mk-avatar:hover]:z-10 mk:[&>.mk-avatar:focus-visible]:z-10 mk:[&>.mk-avatar:focus-within]:z-10',
  ],
  {
    variants: {
      spacing: {
        tight: 'mk:[&>.mk-avatar:not(:first-child)]:-ml-3',
        normal: 'mk:[&>.mk-avatar:not(:first-child)]:-ml-2',
        loose: 'mk:[&>.mk-avatar:not(:first-child)]:-ml-1',
      },
    },
  },
)

interface AvatarGroupClassOptions {
  size: AvatarSize
  spacing: AvatarGroupSpacing
  config?: AvatarGroupStyleConfig | undefined
  ui?: AvatarGroupUI | undefined
  className?: ModeKitClassValue
}

interface AvatarGroupSlotClassOptions {
  slot: AvatarGroupSlot
  overflowColor: AvatarColor
  config?: AvatarGroupStyleConfig | undefined
  ui?: AvatarGroupUI | undefined
}

export function getAvatarGroupClasses({
  size,
  spacing,
  config,
  ui,
  className,
}: AvatarGroupClassOptions): string {
  return cn(
    avatarGroupStyles({ spacing }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.spacing?.[spacing],
    ui?.base,
    className,
  )
}

export function getAvatarGroupSlotClasses({
  slot,
  overflowColor,
  config,
  ui,
}: AvatarGroupSlotClassOptions): string {
  return cn(
    slot === 'item' ? 'mk-avatar-group__item' : 'mk-avatar-group__overflow',
    slot === 'overflow' ? config?.variants?.overflowColor?.[overflowColor] : undefined,
    config?.slots?.[slot],
    ui?.[slot],
  )
}
