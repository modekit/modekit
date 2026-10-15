import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { SelectSize, SelectStyleConfig, SelectUI, SelectVariant } from '../types.js'

const animatedFocusRingStyles = [
  "mk:after:pointer-events-none mk:after:absolute mk:after:-inset-1 mk:after:border-2 mk:after:border-solid mk:after:border-transparent mk:after:opacity-0 mk:after:content-['']",
  'mk:after:transition-[opacity,border-color] mk:after:duration-150 mk:after:ease-out',
  'mk:focus-visible:after:border-primary mk:focus-visible:after:opacity-100',
  'mk:data-[mk-invalid]:focus-visible:after:border-red-700 mk:dark:data-[mk-invalid]:focus-visible:after:border-red-400',
  'mk:motion-reduce:after:transition-none',
]

const selectStyles = cva(
  [
    'mk-select mk:group mk:relative mk:box-border mk:inline-flex mk:w-full mk:items-center mk:text-left mk:text-neutral-950 mk:dark:text-neutral-50',
    'mk:border-solid mk:outline-none mk:transition-colors mk:duration-150 mk:ease-out mk:motion-reduce:transition-none',
    'mk:data-[placeholder]:text-neutral-600/70 mk:dark:data-[placeholder]:text-neutral-400/70',
    'mk:data-[disabled]:pointer-events-none mk:data-[disabled]:cursor-not-allowed mk:data-[disabled]:opacity-50',
    'mk:data-[mk-loading]:cursor-progress',
  ],
  {
    variants: {
      variant: {
        outline: [
          'mk:border mk:border-neutral-300 mk:bg-white mk:dark:border-neutral-700 mk:dark:bg-white/10',
          'mk:focus-visible:border-primary',
          'mk:data-[mk-invalid]:border-red-700 mk:dark:data-[mk-invalid]:border-red-400',
          ...animatedFocusRingStyles,
        ],
        soft: [
          'mk:border-0 mk:bg-neutral-100 mk:dark:bg-neutral-800',
          'mk:data-[mk-invalid]:outline-1 mk:data-[mk-invalid]:outline-solid mk:data-[mk-invalid]:outline-red-700 mk:dark:data-[mk-invalid]:outline-red-400',
          ...animatedFocusRingStyles,
        ],
        subtle: [
          'mk:border mk:border-neutral-200 mk:bg-neutral-100/50 mk:dark:border-neutral-800 mk:dark:bg-neutral-800/50',
          'mk:focus-visible:border-primary',
          'mk:data-[mk-invalid]:border-red-700 mk:dark:data-[mk-invalid]:border-red-400',
          ...animatedFocusRingStyles,
        ],
        ghost: [
          'mk:border-0 mk:bg-transparent mk:hover:bg-neutral-100/50 mk:dark:hover:bg-neutral-800/50',
          'mk:focus-visible:bg-neutral-100/50 mk:dark:focus-visible:bg-neutral-800/50',
          'mk:data-[mk-invalid]:outline-1 mk:data-[mk-invalid]:outline-solid mk:data-[mk-invalid]:outline-red-700 mk:dark:data-[mk-invalid]:outline-red-400',
          ...animatedFocusRingStyles,
        ],
        plain:
          'mk:border-0 mk:bg-transparent mk:data-[mk-invalid]:text-red-700 mk:dark:data-[mk-invalid]:text-red-400',
      },
      size: {
        sm: 'mk:h-8 mk:gap-2 mk:rounded-md mk:px-2.5 mk:text-sm mk:leading-4 mk:after:rounded-lg',
        md: 'mk:h-10 mk:gap-2 mk:rounded-lg mk:px-3 mk:text-sm mk:leading-5 mk:after:rounded-xl',
        lg: 'mk:h-12 mk:gap-2.5 mk:rounded-xl mk:px-4 mk:text-base mk:leading-6 mk:after:rounded-2xl',
      },
    },
  },
)

const selectLeadingStyles = cva(
  'mk-select__leading mk:flex mk:shrink-0 mk:items-center mk:justify-center mk:text-neutral-600 mk:dark:text-neutral-400 mk:[&>svg]:size-full',
  {
    variants: {
      size: {
        sm: 'mk:size-3.5',
        md: 'mk:size-4',
        lg: 'mk:size-5',
      },
    },
  },
)
const selectValueStyles = cva('mk-select__value mk:min-w-0 mk:flex-1 mk:truncate')
const selectPlaceholderStyles = cva(
  'mk-select__placeholder mk:min-w-0 mk:flex-1 mk:truncate mk:text-neutral-600/70 mk:dark:text-neutral-400/70',
)
const selectTrailingStyles = cva(
  'mk-select__trailing mk:ml-auto mk:flex mk:shrink-0 mk:items-center mk:justify-center mk:text-neutral-500 mk:dark:text-neutral-400 mk:[&>svg]:size-full',
  {
    variants: {
      size: {
        sm: 'mk:size-3.5',
        md: 'mk:size-4',
        lg: 'mk:size-5',
      },
    },
  },
)
const selectTriggerIconStyles = cva(
  'mk-select__trigger-icon mk:size-full mk:shrink-0 mk:transition-transform mk:duration-150 mk:group-data-[state=open]:rotate-180 mk:motion-reduce:transition-none',
)
const selectSpinnerStyles = cva('mk-select__spinner mk:shrink-0')

const selectContentStyles = cva(
  [
    'mk-select__content mk:z-50 mk:box-border mk:min-w-[var(--reka-select-trigger-width)] mk:max-w-[min(24rem,calc(100vw-2rem))] mk:max-h-[var(--reka-select-content-available-height)]',
    'mk:overflow-hidden mk:rounded-lg mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:text-neutral-950 mk:shadow-raised-lg mk:outline-none',
    'mk:origin-[var(--reka-select-content-transform-origin)] mk:data-[state=open]:animate-[mk-popover-open_120ms_ease-out] mk:data-[state=closed]:animate-[mk-popover-close_90ms_ease-in] mk:motion-reduce:animate-none',
    'mk:dark:border-white/10 mk:dark:bg-neutral-900 mk:dark:text-neutral-50',
  ],
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
  },
)
const selectViewportStyles = cva('mk-select__viewport mk:box-border mk:w-full mk:p-1')
const selectScrollButtonStyles = cva(
  'mk-select__scroll-button mk:flex mk:h-7 mk:cursor-default mk:items-center mk:justify-center mk:bg-white mk:text-neutral-500 mk:dark:bg-neutral-900 mk:dark:text-neutral-400 mk:[&>svg]:size-4',
)
const selectGroupStyles = cva('mk-select__group')
const selectLabelStyles = cva(
  'mk-select__label mk:box-border mk:font-semibold mk:text-neutral-500 mk:dark:text-neutral-400',
  {
    variants: {
      size: {
        sm: 'mk:px-2 mk:py-1 mk:text-[0.6875rem] mk:leading-4',
        md: 'mk:px-2 mk:py-1.5 mk:text-xs mk:leading-4',
        lg: 'mk:px-3 mk:py-2 mk:text-sm mk:leading-5',
      },
    },
  },
)
const selectSeparatorStyles = cva(
  'mk-select__separator mk:box-border mk:-mx-1 mk:my-1 mk:h-px mk:border-0 mk:bg-neutral-200 mk:dark:bg-white/10',
)
const selectItemStyles = cva(
  [
    'mk-select__item mk:relative mk:box-border mk:flex mk:w-full mk:cursor-default mk:select-none mk:items-center mk:rounded-md mk:outline-none',
    'mk:data-[highlighted]:bg-neutral-100 mk:data-[highlighted]:text-neutral-950 mk:data-[state=checked]:text-primary',
    'mk:data-[disabled]:pointer-events-none mk:data-[disabled]:opacity-50 mk:dark:data-[highlighted]:bg-neutral-800 mk:dark:data-[highlighted]:text-neutral-50',
  ],
  {
    variants: {
      size: {
        sm: 'mk:min-h-7 mk:gap-2 mk:py-1 mk:pr-2 mk:pl-7 mk:text-xs mk:leading-4',
        md: 'mk:min-h-8 mk:gap-2 mk:py-1.5 mk:pr-2 mk:pl-8 mk:text-sm mk:leading-5',
        lg: 'mk:min-h-10 mk:gap-2.5 mk:py-2 mk:pr-3 mk:pl-10 mk:text-base mk:leading-6',
      },
    },
  },
)
const selectItemLeadingStyles = cva(
  'mk-select__item-leading mk:flex mk:shrink-0 mk:items-center mk:text-neutral-500 mk:dark:text-neutral-400 mk:[&>svg]:size-full',
  {
    variants: {
      size: {
        sm: 'mk:size-3.5',
        md: 'mk:size-4',
        lg: 'mk:size-5',
      },
    },
  },
)
const selectItemTextStyles = cva('mk-select__item-text mk:min-w-0 mk:flex-1')
const selectItemLabelStyles = cva('mk-select__item-label mk:block mk:truncate')
const selectItemDescriptionStyles = cva(
  'mk-select__item-description mk:mt-0.5 mk:block mk:truncate mk:text-[0.85em] mk:text-neutral-500 mk:dark:text-neutral-400',
)
const selectItemTrailingStyles = cva(
  'mk-select__item-trailing mk:ml-auto mk:flex mk:shrink-0 mk:items-center mk:text-neutral-400 mk:dark:text-neutral-500 mk:[&>svg]:size-full',
  {
    variants: {
      size: {
        sm: 'mk:size-3.5',
        md: 'mk:size-4',
        lg: 'mk:size-5',
      },
    },
  },
)
const selectIndicatorStyles = cva(
  'mk-select__indicator mk:absolute mk:left-2 mk:flex mk:size-4 mk:items-center mk:justify-center mk:text-primary',
)
const selectIndicatorIconStyles = cva('mk-select__indicator-icon mk:size-3.5 mk:shrink-0')
const selectEmptyStyles = cva(
  'mk-select__empty mk:box-border mk:px-3 mk:py-6 mk:text-center mk:text-sm mk:text-neutral-500 mk:dark:text-neutral-400',
)
const selectArrowStyles = cva(
  'mk-select__arrow mk:-translate-y-px mk:fill-white mk:stroke-neutral-200 mk:stroke-1 mk:dark:fill-neutral-900 mk:dark:stroke-neutral-700',
)

interface SelectClassOptions {
  size: SelectSize
  variant: SelectVariant
  config?: SelectStyleConfig | undefined
  ui?: SelectUI | undefined
  className?: ModeKitClassValue
}

type SelectSlot = Exclude<keyof SelectUI, 'base'>

export function getSelectClasses({
  size,
  variant,
  config,
  ui,
  className,
}: SelectClassOptions): string {
  return cn(
    selectStyles({ size, variant }),
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.variant?.[variant],
    ui?.base,
    className,
  )
}

interface SelectSlotClassOptions extends Omit<SelectClassOptions, 'variant'> {
  slot: SelectSlot
}

export function getSelectSlotClasses({
  slot,
  size,
  config,
  ui,
  className,
}: SelectSlotClassOptions): string {
  const builtIn =
    slot === 'leading'
      ? selectLeadingStyles({ size })
      : slot === 'value'
        ? selectValueStyles({})
        : slot === 'placeholder'
          ? selectPlaceholderStyles({})
          : slot === 'trailing'
            ? selectTrailingStyles({ size })
            : slot === 'triggerIcon'
              ? selectTriggerIconStyles({})
              : slot === 'spinner'
                ? selectSpinnerStyles({})
                : slot === 'content'
                  ? selectContentStyles({ size })
                  : slot === 'viewport'
                    ? selectViewportStyles({})
                    : slot === 'scrollButton'
                      ? selectScrollButtonStyles({})
                      : slot === 'group'
                        ? selectGroupStyles({})
                        : slot === 'label'
                          ? selectLabelStyles({ size })
                          : slot === 'separator'
                            ? selectSeparatorStyles({})
                            : slot === 'item'
                              ? selectItemStyles({ size })
                              : slot === 'itemLeading'
                                ? selectItemLeadingStyles({ size })
                                : slot === 'itemText'
                                  ? selectItemTextStyles({})
                                  : slot === 'itemLabel'
                                    ? selectItemLabelStyles({})
                                    : slot === 'itemDescription'
                                      ? selectItemDescriptionStyles({})
                                      : slot === 'itemTrailing'
                                        ? selectItemTrailingStyles({ size })
                                        : slot === 'indicator'
                                          ? selectIndicatorStyles({})
                                          : slot === 'indicatorIcon'
                                            ? selectIndicatorIconStyles({})
                                            : slot === 'empty'
                                              ? selectEmptyStyles({})
                                              : selectArrowStyles({})

  return cn(builtIn, config?.slots?.[slot], ui?.[slot], className)
}
