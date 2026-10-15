import { inject } from 'vue'
import type { InjectionKey } from 'vue'

export const previewPortalTargetKey: InjectionKey<HTMLElement> = Symbol(
  'ModeKitDocsPreviewPortalTarget',
)

export function usePreviewPortalTarget(): HTMLElement {
  const target = inject(previewPortalTargetKey, undefined)

  if (!target) {
    throw new Error('This preview requires an isolated portal target.')
  }

  return target
}
