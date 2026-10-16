import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  TextareaResize,
  TextareaSize,
  TextareaStyleConfig,
  TextareaUI,
  TextareaVariant,
} from '../types.js'

const animatedFocusRingStyles = [
  'mk:outline-2 mk:outline-solid mk:outline-offset-2 mk:outline-transparent',
  'mk:transition-[border-color,outline-color] mk:duration-150 mk:ease-out',
  'mk:has-focus-visible:outline-primary',
  'mk:data-[mk-invalid]:has-focus-visible:outline-red-700 mk:dark:data-[mk-invalid]:has-focus-visible:outline-red-400',
  'mk:motion-reduce:transition-none',
]

const textareaStyles = cva(
  [
    'mk-textarea mk:group mk:relative mk:inline-grid mk:w-full mk:min-w-0 mk:box-border mk:text-neutral-950 mk:dark:text-neutral-50',
    'mk:border-solid mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:data-[mk-disabled]:pointer-events-none mk:data-[mk-disabled]:cursor-not-allowed mk:data-[mk-disabled]:opacity-50',
  ],
  {
    variants: {
      variant: {
        outline: [
          'mk:border mk:border-neutral-300 mk:bg-white mk:dark:border-neutral-700 mk:dark:bg-white/10',
          'mk:has-focus-visible:border-primary',
          'mk:data-[mk-invalid]:border-red-700 mk:dark:data-[mk-invalid]:border-red-400',
          'mk:data-[mk-readonly]:bg-neutral-100/50 mk:dark:data-[mk-readonly]:bg-neutral-800/50',
          ...animatedFocusRingStyles,
        ],
        soft: [
          'mk:border-0 mk:bg-neutral-100 mk:dark:bg-neutral-800',
          'mk:data-[mk-invalid]:outline-1 mk:data-[mk-invalid]:outline-solid mk:data-[mk-invalid]:outline-red-700 mk:dark:data-[mk-invalid]:outline-red-400',
          ...animatedFocusRingStyles,
        ],
        subtle: [
          'mk:border mk:border-neutral-200 mk:bg-neutral-100/50 mk:dark:border-neutral-800 mk:dark:bg-neutral-800/50',
          'mk:has-focus-visible:border-primary',
          'mk:data-[mk-invalid]:border-red-700 mk:dark:data-[mk-invalid]:border-red-400',
          ...animatedFocusRingStyles,
        ],
        ghost: [
          'mk:border-0 mk:bg-transparent mk:hover:bg-neutral-100/50 mk:dark:hover:bg-neutral-800/50',
          'mk:has-focus-visible:bg-neutral-100/50 mk:dark:has-focus-visible:bg-neutral-800/50',
          'mk:data-[mk-invalid]:outline-1 mk:data-[mk-invalid]:outline-solid mk:data-[mk-invalid]:outline-red-700 mk:dark:data-[mk-invalid]:outline-red-400',
          'mk:data-[mk-readonly]:bg-neutral-100/50 mk:dark:data-[mk-readonly]:bg-neutral-800/50',
          ...animatedFocusRingStyles,
        ],
        plain:
          'mk:border-0 mk:bg-transparent mk:data-[mk-invalid]:text-red-700 mk:dark:data-[mk-invalid]:text-red-400',
      },
      size: {
        sm: 'mk:rounded-md',
        md: 'mk:rounded-lg',
        lg: 'mk:rounded-xl',
      },
      resize: {
        none: 'mk:resize-none',
        vertical: 'mk:resize-y mk:overflow-hidden',
        horizontal: 'mk:resize-x mk:overflow-hidden',
        both: 'mk:resize mk:overflow-hidden',
      },
    },
  },
)

const textareaControlStyles = cva(
  [
    'mk-textarea__control mk:box-border mk:block mk:w-full mk:min-w-0 mk:appearance-none',
    'mk:border-0 mk:bg-transparent mk:text-neutral-950 mk:outline-none mk:placeholder:text-neutral-600/60 mk:dark:text-neutral-50 mk:dark:placeholder:text-neutral-400/60',
    'mk:resize-none mk:disabled:cursor-not-allowed mk:read-only:cursor-default',
  ],
  {
    variants: {
      size: {
        sm: 'mk:px-2.5 mk:py-2 mk:text-sm mk:leading-5',
        md: 'mk:px-3 mk:py-2.5 mk:text-sm mk:leading-5',
        lg: 'mk:px-4 mk:py-3 mk:text-base mk:leading-6',
      },
    },
  },
)

interface TextareaClassOptions {
  size: TextareaSize
  variant: TextareaVariant
  resize: TextareaResize
  config?: TextareaStyleConfig | undefined
  ui?: TextareaUI | undefined
  className?: ModeKitClassValue
}

export function getTextareaClasses({
  size,
  variant,
  resize,
  config,
  ui,
  className,
}: TextareaClassOptions): string {
  return cn(
    textareaStyles({ size, variant, resize }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.variant?.[variant],
    config?.variants?.resize?.[resize],
    ui?.base,
    className,
  )
}

export function getTextareaControlClasses({
  size,
  config,
  ui,
}: Omit<TextareaClassOptions, 'variant' | 'className'>): string {
  return cn(textareaControlStyles({ size }), config?.slots?.textarea, ui?.textarea)
}
