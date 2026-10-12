import { inject } from 'vue'
import type { InjectionKey } from 'vue'

import type { ModeKitOptions } from './types.js'

const defaultModeKitOptions: Readonly<ModeKitOptions> = Object.freeze({})

export const modeKitOptionsKey: InjectionKey<Readonly<ModeKitOptions>> = Symbol('ModeKitOptions')

export function useModeKitOptions(): Readonly<ModeKitOptions> {
  return inject(modeKitOptionsKey, defaultModeKitOptions)
}
