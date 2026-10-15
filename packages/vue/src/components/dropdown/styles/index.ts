import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { DropdownSize, DropdownStyleConfig, DropdownUI } from '../types.js'

const contentBase = [
  'mk:z-50 mk:box-border mk:max-h-[var(--reka-dropdown-menu-content-available-height)] mk:max-w-[min(20rem,calc(100vw-2rem))] mk:overflow-x-hidden mk:overflow-y-auto mk:rounded-lg mk:border mk:border-solid mk:border-neutral-200 mk:bg-white mk:p-1 mk:text-neutral-950 mk:shadow-raised-lg',
  'mk:origin-[var(--reka-dropdown-menu-content-transform-origin)] mk:outline-none mk:data-[state=open]:animate-[mk-popover-open_120ms_ease-out] mk:data-[state=closed]:animate-[mk-popover-close_90ms_ease-in] mk:motion-reduce:animate-none',
  'mk:dark:border-white/10 mk:dark:bg-neutral-900 mk:dark:text-neutral-50',
] as const

const dropdownContentStyles = cva(['mk-dropdown', ...contentBase], {
  variants: {
    size: {
      sm: 'mk:min-w-40',
      md: 'mk:min-w-44',
      lg: 'mk:min-w-52',
    },
  },
})

const dropdownSubContentStyles = cva(['mk-dropdown__sub-content', ...contentBase], {
  variants: {
    size: {
      sm: 'mk:min-w-36',
      md: 'mk:min-w-40',
      lg: 'mk:min-w-48',
    },
  },
})

const dropdownItemStyles = cva(
  [
    'mk-dropdown__item mk:relative mk:box-border mk:flex mk:w-full mk:cursor-default mk:select-none mk:items-center mk:rounded-md mk:outline-none',
    'mk:text-component mk:data-[highlighted]:bg-component-soft mk:data-[highlighted]:text-component mk:data-[disabled]:pointer-events-none mk:data-[disabled]:opacity-50',
    'mk:[&>svg]:shrink-0 mk:[&>svg]:text-current mk:[&>svg]:opacity-70',
  ],
  {
    variants: {
      size: {
        sm: 'mk:min-h-7 mk:gap-2 mk:px-2 mk:py-1 mk:text-xs mk:leading-4 mk:[&>svg]:size-3.5',
        md: 'mk:min-h-8 mk:gap-2 mk:px-2 mk:py-1.5 mk:text-sm mk:leading-5 mk:[&>svg]:size-4',
        lg: 'mk:min-h-10 mk:gap-2.5 mk:px-3 mk:py-2 mk:text-base mk:leading-6 mk:[&>svg]:size-5',
      },
      inset: {
        true: '',
        false: '',
      },
      checkable: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', inset: true, class: 'mk:pl-7' },
      { size: 'md', inset: true, class: 'mk:pl-8' },
      { size: 'lg', inset: true, class: 'mk:pl-10' },
      { size: 'sm', checkable: true, class: 'mk:pl-7' },
      { size: 'md', checkable: true, class: 'mk:pl-8' },
      { size: 'lg', checkable: true, class: 'mk:pl-10' },
    ],
  },
)

const dropdownLabelStyles = cva(
  'mk-dropdown__label mk:box-border mk:font-semibold mk:text-neutral-500 mk:dark:text-neutral-400',
  {
    variants: {
      size: {
        sm: 'mk:px-2 mk:py-1 mk:text-[0.6875rem] mk:leading-4',
        md: 'mk:px-2 mk:py-1.5 mk:text-xs mk:leading-4',
        lg: 'mk:px-3 mk:py-2 mk:text-sm mk:leading-5',
      },
      inset: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', inset: true, class: 'mk:pl-7' },
      { size: 'md', inset: true, class: 'mk:pl-8' },
      { size: 'lg', inset: true, class: 'mk:pl-10' },
    ],
  },
)

const dropdownSeparatorStyles = cva(
  'mk-dropdown__separator mk:box-border mk:-mx-1 mk:my-1 mk:h-px mk:border-0 mk:bg-neutral-200 mk:dark:bg-white/10',
)

const dropdownGroupStyles = cva('mk-dropdown__group')
const dropdownItemLeadingStyles = cva(
  'mk-dropdown__item-leading mk:flex mk:shrink-0 mk:items-center mk:[&>svg]:size-full',
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
const dropdownItemLabelStyles = cva('mk-dropdown__item-label mk:min-w-0 mk:flex-1 mk:truncate')
const dropdownItemTrailingStyles = cva(
  'mk-dropdown__item-trailing mk:ml-auto mk:flex mk:shrink-0 mk:items-center mk:pl-3 mk:text-[0.6875rem] mk:tracking-wider mk:text-neutral-400 mk:dark:text-neutral-500 mk:[&>svg]:size-full',
  {
    variants: {
      size: {
        sm: 'mk:min-h-3.5 mk:[&>svg]:size-3.5',
        md: 'mk:min-h-4 mk:[&>svg]:size-4',
        lg: 'mk:min-h-5 mk:[&>svg]:size-5',
      },
    },
  },
)
const dropdownIndicatorStyles = cva(
  'mk-dropdown__indicator mk:absolute mk:left-2 mk:flex mk:size-4 mk:items-center mk:justify-center mk:text-current',
)
const dropdownIndicatorIconStyles = cva('mk-dropdown__indicator-icon mk:size-3.5 mk:shrink-0')
const dropdownFilterStyles = cva(
  [
    'mk-dropdown__filter mk:box-border mk:w-full mk:appearance-none mk:border-0 mk:border-b mk:border-solid mk:border-neutral-200 mk:bg-transparent mk:text-neutral-950 mk:outline-none mk:placeholder:text-neutral-400',
    'mk:focus:border-primary mk:disabled:cursor-not-allowed mk:disabled:opacity-50',
    'mk:dark:border-white/10 mk:dark:text-neutral-50 mk:dark:placeholder:text-neutral-500',
  ],
  {
    variants: {
      size: {
        sm: 'mk:h-8 mk:px-2 mk:text-xs',
        md: 'mk:h-9 mk:px-2 mk:text-sm',
        lg: 'mk:h-11 mk:px-3 mk:text-base',
      },
    },
  },
)
const dropdownSubIndicatorStyles = cva(
  'mk-dropdown__sub-indicator mk:ml-auto mk:size-4 mk:shrink-0 mk:text-neutral-400 mk:dark:text-neutral-500',
)
const dropdownArrowStyles = cva(
  'mk-dropdown__arrow mk:-translate-y-px mk:fill-white mk:stroke-neutral-200 mk:stroke-1 mk:dark:fill-neutral-900 mk:dark:stroke-neutral-700',
)

type DropdownSlot = Exclude<keyof DropdownUI, 'base'>

interface DropdownClassOptions {
  size: DropdownSize
  config?: DropdownStyleConfig | undefined
  ui?: DropdownUI | undefined
  className?: ModeKitClassValue
}

export function getDropdownClasses({ size, config, ui, className }: DropdownClassOptions): string {
  return cn(dropdownContentStyles({ size }), config?.base, ui?.base, className)
}

interface DropdownSlotClassOptions extends DropdownClassOptions {
  slot: DropdownSlot
  inset?: boolean | undefined
  checkable?: boolean | undefined
}

export function getDropdownSlotClasses({
  slot,
  size,
  inset = false,
  checkable = false,
  config,
  ui,
  className,
}: DropdownSlotClassOptions): string {
  const builtIn =
    slot === 'item'
      ? dropdownItemStyles({ size, inset, checkable })
      : slot === 'subTrigger'
        ? dropdownItemStyles({ size, inset, checkable: false }).replace(
            'mk-dropdown__item',
            'mk-dropdown__sub-trigger',
          )
        : slot === 'subContent'
          ? dropdownSubContentStyles({ size })
          : slot === 'label'
            ? dropdownLabelStyles({ size, inset })
            : slot === 'separator'
              ? dropdownSeparatorStyles({})
              : slot === 'group'
                ? dropdownGroupStyles({})
                : slot === 'itemLeading'
                  ? dropdownItemLeadingStyles({ size })
                  : slot === 'itemLabel'
                    ? dropdownItemLabelStyles({})
                    : slot === 'itemTrailing'
                      ? dropdownItemTrailingStyles({ size })
                      : slot === 'indicator'
                        ? dropdownIndicatorStyles({})
                        : slot === 'indicatorIcon'
                          ? dropdownIndicatorIconStyles({})
                          : slot === 'filter'
                            ? dropdownFilterStyles({ size })
                            : slot === 'subIndicator'
                              ? dropdownSubIndicatorStyles({})
                              : dropdownArrowStyles({})

  return cn(builtIn, config?.slots?.[slot], ui?.[slot], className)
}
