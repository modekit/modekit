import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { ButtonGroupOrientation, ButtonGroupStyleConfig, ButtonGroupUI } from '../types.js'

const buttonGroupStyles = cva(
  [
    'mk-button-group mk:inline-flex mk:isolate mk:w-fit mk:align-middle',
    'mk:[&>.mk-button]:relative',
    'mk:[&>.mk-button:hover]:z-10 mk:[&>.mk-button:focus-visible]:z-20',
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          'mk:flex-row',
          'mk:[&>.mk-button:not(:first-child)]:-ml-px',
          'mk:[&>.mk-button:not(:first-child)]:rounded-l-none',
          'mk:[&>.mk-button:not(:last-child)]:rounded-r-none',
        ],
        vertical: [
          'mk:flex-col',
          'mk:[&>.mk-button:not(:first-child)]:-mt-px',
          'mk:[&>.mk-button:not(:first-child)]:rounded-t-none',
          'mk:[&>.mk-button:not(:last-child)]:rounded-b-none',
        ],
      },
    },
  },
)

interface ButtonGroupClassOptions {
  orientation: ButtonGroupOrientation
  config?: ButtonGroupStyleConfig | undefined
  ui?: ButtonGroupUI | undefined
  className?: ModeKitClassValue
}

export function getButtonGroupClasses({
  orientation,
  config,
  ui,
  className,
}: ButtonGroupClassOptions): string {
  return cn(
    buttonGroupStyles({ orientation }),
    config?.base,
    config?.variants?.orientation?.[orientation],
    ui?.base,
    className,
  )
}
