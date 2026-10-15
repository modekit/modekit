import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ButtonColor, ButtonVariant } from '../button/types.js'
import type { DialogAnimation, DialogPortalTarget, DialogSize } from '../dialog/types.js'
import type { ModeKitClassValue } from '../../types/classes.js'

export type AlertDialogAs = NonNullable<PrimitiveProps['as']>
export type AlertDialogSize = DialogSize
export type AlertDialogAnimation = DialogAnimation
export type AlertDialogPortalTarget = DialogPortalTarget

export interface AlertDialogUI {
  base?: ModeKitClassValue
  overlay?: ModeKitClassValue
  header?: ModeKitClassValue
  title?: ModeKitClassValue
  description?: ModeKitClassValue
  body?: ModeKitClassValue
  footer?: ModeKitClassValue
  cancel?: ModeKitClassValue
  action?: ModeKitClassValue
}

export interface AlertDialogStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    size?: Partial<Record<AlertDialogSize, ModeKitClassValue>>
    animation?: Partial<Record<AlertDialogAnimation, ModeKitClassValue>>
  }
  slots?: Omit<AlertDialogUI, 'base'>
  defaultVariants?: {
    size?: AlertDialogSize
    animation?: AlertDialogAnimation
  }
}

export interface AlertDialogOptions {
  as?: AlertDialogAs
  title?: string
  description?: string
  open?: boolean
  defaultOpen?: boolean
  unmountOnHide?: boolean
  size?: AlertDialogSize
  animation?: AlertDialogAnimation
  cancelLabel?: string
  actionLabel?: string
  actionColor?: ButtonColor
  actionVariant?: ButtonVariant
  portal?: AlertDialogPortalTarget
  ui?: AlertDialogUI
}

export type AlertDialogProps = Omit<HTMLAttributes, keyof AlertDialogOptions> & AlertDialogOptions

export interface AlertDialogEmits {
  'update:open': [value: boolean]
  action: [event: MouseEvent]
  cancel: [event: MouseEvent]
  openAutoFocus: [event: Event]
  closeAutoFocus: [event: Event]
}

export interface AlertDialogSlotProps {
  open: boolean
  close: () => void
}

export interface AlertDialogTitleSlotProps extends AlertDialogSlotProps {
  title: string | undefined
}

export interface AlertDialogDescriptionSlotProps extends AlertDialogSlotProps {
  description: string | undefined
}

export interface AlertDialogSlots {
  default?(): VNodeChild
  title?(props: AlertDialogTitleSlotProps): VNodeChild
  description?(props: AlertDialogDescriptionSlotProps): VNodeChild
  content?(props: AlertDialogSlotProps): VNodeChild
  cancel?(props: AlertDialogSlotProps): VNodeChild
  action?(props: AlertDialogSlotProps): VNodeChild
}
