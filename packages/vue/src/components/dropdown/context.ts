import type { ComputedRef, InjectionKey } from 'vue'
import { inject, provide } from 'vue'

import type {
  DropdownPortalTarget,
  DropdownSize,
  DropdownStyleConfig,
  DropdownUI,
} from './types.js'

export interface DropdownContextValue {
  size: ComputedRef<DropdownSize>
  portal: ComputedRef<DropdownPortalTarget>
  config: ComputedRef<DropdownStyleConfig | undefined>
  ui: ComputedRef<DropdownUI | undefined>
}

const dropdownContextKey: InjectionKey<DropdownContextValue> = Symbol('MkDropdown')

export function provideDropdownContext(value: DropdownContextValue): void {
  provide(dropdownContextKey, value)
}

export function useDropdownContext(): DropdownContextValue {
  const context = inject(dropdownContextKey)

  if (!context) {
    throw new Error('Dropdown parts must be used inside MkDropdown')
  }

  return context
}
