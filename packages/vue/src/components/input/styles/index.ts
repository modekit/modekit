import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { InputFloating, InputSize, InputStyleConfig, InputUI, InputVariant } from '../types.js'

const animatedFocusRingStyles = [
  "mk:after:pointer-events-none mk:after:absolute mk:after:-inset-1 mk:after:border-2 mk:after:border-solid mk:after:border-transparent mk:after:opacity-0 mk:after:content-['']",
  'mk:after:transition-[opacity,border-color] mk:after:duration-150 mk:after:ease-out',
  'mk:has-focus-visible:after:border-ring mk:has-focus-visible:after:opacity-100',
  'mk:data-[mk-invalid]:has-focus-visible:after:border-red-700 mk:dark:data-[mk-invalid]:has-focus-visible:after:border-red-400',
  'mk:motion-reduce:after:transition-none',
]

const inputStyles = cva(
  [
    'mk-input mk:group mk:relative mk:inline-flex mk:w-full mk:items-center mk:box-border mk:text-foreground',
    'mk:border-solid mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:data-[mk-disabled]:pointer-events-none mk:data-[mk-disabled]:cursor-not-allowed mk:data-[mk-disabled]:opacity-50',
    'mk:data-[mk-loading]:cursor-progress',
  ],
  {
    variants: {
      variant: {
        outline: [
          'mk:border mk:border-input mk:bg-background',
          'mk:has-focus-visible:border-ring',
          'mk:data-[mk-invalid]:border-red-700 mk:dark:data-[mk-invalid]:border-red-400',
          'mk:data-[mk-readonly]:bg-muted/50',
          ...animatedFocusRingStyles,
        ],
        soft: [
          'mk:border-0 mk:bg-muted',
          'mk:data-[mk-invalid]:outline-1 mk:data-[mk-invalid]:outline-solid mk:data-[mk-invalid]:outline-red-700 mk:dark:data-[mk-invalid]:outline-red-400',
          ...animatedFocusRingStyles,
        ],
        subtle: [
          'mk:border mk:border-border mk:bg-muted/50',
          'mk:has-focus-visible:border-ring',
          'mk:data-[mk-invalid]:border-red-700 mk:dark:data-[mk-invalid]:border-red-400',
          ...animatedFocusRingStyles,
        ],
        ghost: [
          'mk:border-0 mk:bg-transparent mk:hover:bg-muted/50',
          'mk:has-focus-visible:bg-muted/50',
          'mk:data-[mk-invalid]:outline-1 mk:data-[mk-invalid]:outline-solid mk:data-[mk-invalid]:outline-red-700 mk:dark:data-[mk-invalid]:outline-red-400',
          'mk:data-[mk-readonly]:bg-muted/50',
          ...animatedFocusRingStyles,
        ],
        plain:
          'mk:border-0 mk:bg-transparent mk:data-[mk-invalid]:text-red-700 mk:dark:data-[mk-invalid]:text-red-400',
      },
      size: {
        sm: 'mk:h-8 mk:rounded-md mk:after:rounded-lg',
        md: 'mk:h-10 mk:rounded-lg mk:after:rounded-xl',
        lg: 'mk:h-12 mk:rounded-xl mk:after:rounded-2xl',
      },
    },
  },
)

const inputControlStyles = cva(
  [
    'mk-input__control mk:peer mk:box-border mk:block mk:h-full mk:w-full mk:min-w-0 mk:appearance-none',
    'mk:border-0 mk:bg-transparent mk:text-foreground mk:outline-none mk:placeholder:text-muted-foreground/60',
    'mk:disabled:cursor-not-allowed mk:read-only:cursor-default',
  ],
  {
    variants: {
      size: {
        sm: 'mk:px-2.5 mk:text-sm mk:leading-4',
        md: 'mk:px-3 mk:text-sm mk:leading-5',
        lg: 'mk:px-4 mk:text-base mk:leading-6',
      },
      leading: {
        false: '',
        true: '',
      },
      trailing: {
        false: '',
        true: '',
      },
      floating: {
        none: '',
        inside: '',
        border: '',
      },
      active: {
        false: '',
        true: '',
      },
    },
    compoundVariants: [
      { size: 'sm', leading: true, class: 'mk:pl-8' },
      { size: 'md', leading: true, class: 'mk:pl-9' },
      { size: 'lg', leading: true, class: 'mk:pl-10' },
      { size: 'sm', trailing: true, class: 'mk:pr-8' },
      { size: 'md', trailing: true, class: 'mk:pr-9' },
      { size: 'lg', trailing: true, class: 'mk:pr-10' },
      { size: 'sm', floating: 'inside', active: true, class: 'mk:pt-3.5 mk:pb-0' },
      { size: 'md', floating: 'inside', active: true, class: 'mk:pt-4 mk:pb-0.5' },
      { size: 'lg', floating: 'inside', active: true, class: 'mk:pt-4.5 mk:pb-0.5' },
    ],
  },
)

const inputAffixStyles = {
  leading: cva(
    'mk-input__leading mk:pointer-events-none mk:absolute mk:inset-y-0 mk:left-0 mk:flex mk:items-center mk:justify-center mk:text-muted-foreground',
    {
      variants: {
        size: {
          sm: 'mk:w-8 mk:text-xs',
          md: 'mk:w-9 mk:text-sm',
          lg: 'mk:w-10 mk:text-base',
        },
      },
    },
  ),
  trailing: cva(
    'mk-input__trailing mk:pointer-events-none mk:absolute mk:inset-y-0 mk:right-0 mk:flex mk:items-center mk:justify-center mk:text-muted-foreground',
    {
      variants: {
        size: {
          sm: 'mk:w-8 mk:text-xs',
          md: 'mk:w-9 mk:text-sm',
          lg: 'mk:w-10 mk:text-base',
        },
      },
    },
  ),
} as const

const inputLabelStyles = cva(
  [
    'mk-input__label mk:pointer-events-none mk:absolute mk:z-10 mk:max-w-[calc(100%-1rem)] mk:origin-left mk:truncate',
    'mk:transition-all mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        sm: 'mk:left-2.5 mk:text-sm mk:leading-4',
        md: 'mk:left-3 mk:text-sm mk:leading-5',
        lg: 'mk:left-4 mk:text-base mk:leading-6',
      },
      active: {
        false: 'mk:top-1/2 mk:-translate-y-1/2 mk:scale-100',
        true: 'mk:scale-75',
      },
      floating: {
        inside: '',
        border: '',
      },
      leading: {
        false: '',
        true: '',
      },
      focused: {
        false: 'mk:text-muted-foreground',
        true: 'mk:text-foreground',
      },
      invalid: {
        false: '',
        true: 'mk:text-red-700 mk:dark:text-red-400',
      },
    },
    compoundVariants: [
      { size: 'sm', leading: true, class: 'mk:left-8' },
      { size: 'md', leading: true, class: 'mk:left-9' },
      { size: 'lg', leading: true, class: 'mk:left-10' },
      {
        floating: 'border',
        active: true,
        class: 'mk:top-0 mk:-ml-1 mk:-translate-y-1/2 mk:bg-inherit mk:px-1',
      },
      { floating: 'inside', active: true, class: 'mk:origin-top-left' },
      { size: 'sm', floating: 'inside', active: true, class: 'mk:top-0.5' },
      { size: 'md', floating: 'inside', active: true, class: 'mk:top-1' },
      { size: 'lg', floating: 'inside', active: true, class: 'mk:top-1.5' },
    ],
  },
)

const inputSpinnerStyles = 'mk-input__spinner mk:shrink-0'

interface InputClassOptions {
  size: InputSize
  variant: InputVariant
  config?: InputStyleConfig | undefined
  ui?: InputUI | undefined
  className?: ModeKitClassValue
}

type InputSlot = Exclude<keyof InputUI, 'base'>

interface InputSlotClassOptions {
  slot: InputSlot
  size: InputSize
  leading: boolean
  trailing: boolean
  floating: InputFloating | undefined
  floatingActive: boolean
  focused: boolean
  invalid: boolean
  config?: InputStyleConfig | undefined
  ui?: InputUI | undefined
}

export function getInputClasses({
  size,
  variant,
  config,
  ui,
  className,
}: InputClassOptions): string {
  return cn(
    inputStyles({ size, variant }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.variant?.[variant],
    ui?.base,
    className,
  )
}

export function getInputSlotClasses({
  slot,
  size,
  leading,
  trailing,
  floating,
  floatingActive,
  focused,
  invalid,
  config,
  ui,
}: InputSlotClassOptions): string {
  let builtIn: ModeKitClassValue

  if (slot === 'input') {
    builtIn = inputControlStyles({
      size,
      leading,
      trailing,
      floating: floating ?? 'none',
      active: floatingActive,
    })
  } else if (slot === 'label') {
    builtIn = inputLabelStyles({
      size,
      active: floatingActive,
      floating: floating ?? 'border',
      leading,
      focused,
      invalid,
    })
  } else if (slot === 'spinner') {
    builtIn = inputSpinnerStyles
  } else {
    builtIn = inputAffixStyles[slot]({ size })
  }

  return cn(builtIn, config?.slots?.[slot], ui?.[slot])
}
