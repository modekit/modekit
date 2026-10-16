import { computed, inject, type ComputedRef, type InjectionKey, type Ref } from 'vue'

import type { ToastData, ToastId, ToastInstance, ToastState } from './types.js'

export interface ToastContext {
  toasts: Ref<ToastState[]>
  add(toast: ToastData): ToastInstance
  update(id: ToastId, toast: Partial<ToastData>): ToastInstance | undefined
  remove(id: ToastId): void
  clear(): void
}

export interface ToastApi {
  toasts: ComputedRef<readonly ToastState[]>
  add(toast: ToastData): ToastInstance
  update(id: ToastId, toast: Partial<ToastData>): ToastInstance | undefined
  remove(id: ToastId): void
  clear(): void
}

export const toastContextKey: InjectionKey<ToastContext> = Symbol('ModeKitToastContext')

export function useToast(): ToastApi {
  const context = inject(toastContextKey, null)

  if (!context) {
    throw new Error('useToast must be called within MkToastProvider.')
  }

  return {
    toasts: computed(() => context.toasts.value),
    add: (toast) => context.add(toast),
    update: (id, toast) => context.update(id, toast),
    remove: (id) => {
      context.remove(id)
    },
    clear: () => {
      context.clear()
    },
  }
}
