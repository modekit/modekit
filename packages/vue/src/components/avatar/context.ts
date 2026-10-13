import type { ComputedRef, InjectionKey } from 'vue'

import type { AvatarSize } from './types.js'

export interface AvatarGroupContext {
  size: ComputedRef<AvatarSize>
}

export const avatarGroupContextKey: InjectionKey<AvatarGroupContext> = Symbol('avatar-group')
