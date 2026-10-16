import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { defineComponent, h, onBeforeUnmount, onMounted, onUpdated, toRaw, useId } from 'vue'
import type { ComponentPublicInstance, HTMLAttributes, PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getLabelRequiredIndicatorClasses } from '../label/styles/index.js'
import { getRadioGroupClasses, getRadioGroupSlotClasses } from './styles/index.js'
import { radioGroupOrientations, radioGroupSizes, radioGroupVariants } from './types.js'
import type {
  RadioGroupItem as RadioGroupItemDefinition,
  RadioGroupItemSlotProps,
  RadioGroupOrientation,
  RadioGroupSize,
  RadioGroupSlots,
  RadioGroupUI,
  RadioGroupValue,
  RadioGroupVariant,
} from './types.js'

function isRadioGroupValue(value: unknown): value is RadioGroupValue {
  return typeof value === 'string' || typeof value === 'number'
}

export const MkRadioGroup = defineComponent({
  name: 'MkRadioGroup',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number] as PropType<RadioGroupValue>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number] as PropType<RadioGroupValue>,
      default: undefined,
    },
    items: {
      type: Array as PropType<readonly RadioGroupItemDefinition[]>,
      required: true,
    },
    label: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      default: undefined,
    },
    size: {
      type: String as PropType<RadioGroupSize>,
      default: undefined,
      validator: (value: RadioGroupSize) => radioGroupSizes.includes(value),
    },
    variant: {
      type: String as PropType<RadioGroupVariant>,
      default: undefined,
      validator: (value: RadioGroupVariant) => radioGroupVariants.includes(value),
    },
    orientation: {
      type: String as PropType<RadioGroupOrientation>,
      default: undefined,
      validator: (value: RadioGroupOrientation) => radioGroupOrientations.includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: undefined,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    ui: {
      type: Object as PropType<RadioGroupUI>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': isRadioGroupValue,
  },
  slots: Object as SlotsType<RadioGroupSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()
    const generatedId = useId()
    let optionsElement: HTMLElement | undefined
    let animationFrame: number | undefined
    let resizeObserver: ResizeObserver | undefined
    let indicatorEnabled = false

    const updateIndicator = () => {
      if (!optionsElement) return
      if (!indicatorEnabled) {
        optionsElement.removeAttribute('data-mk-indicator-ready')
        optionsElement.style.removeProperty('--mk-radio-group-indicator-x')
        optionsElement.style.removeProperty('--mk-radio-group-indicator-y')
        optionsElement.style.removeProperty('--mk-radio-group-indicator-width')
        optionsElement.style.removeProperty('--mk-radio-group-indicator-height')
        return
      }

      const checkedControl = optionsElement.querySelector<HTMLElement>(
        '.mk-radio-group__control[data-state="checked"]',
      )
      const checkedItem = checkedControl?.closest<HTMLElement>('.mk-radio-group__item')
      if (!checkedItem) {
        optionsElement.removeAttribute('data-mk-indicator-ready')
        return
      }

      const optionsRect = optionsElement.getBoundingClientRect()
      const itemRect = checkedItem.getBoundingClientRect()
      const offsetX = itemRect.left - optionsRect.left + optionsElement.scrollLeft
      const offsetY = itemRect.top - optionsRect.top + optionsElement.scrollTop

      optionsElement.style.setProperty('--mk-radio-group-indicator-x', `${String(offsetX)}px`)
      optionsElement.style.setProperty('--mk-radio-group-indicator-y', `${String(offsetY)}px`)
      optionsElement.style.setProperty(
        '--mk-radio-group-indicator-width',
        `${String(itemRect.width)}px`,
      )
      optionsElement.style.setProperty(
        '--mk-radio-group-indicator-height',
        `${String(itemRect.height)}px`,
      )
      optionsElement.setAttribute('data-mk-indicator-ready', '')
    }

    const scheduleIndicatorUpdate = () => {
      if (typeof requestAnimationFrame === 'undefined') return
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)

      animationFrame = requestAnimationFrame(() => {
        animationFrame = undefined
        updateIndicator()
      })
    }

    const observeOptions = () => {
      resizeObserver?.disconnect()
      if (!optionsElement || !indicatorEnabled || typeof ResizeObserver === 'undefined') return

      resizeObserver = new ResizeObserver(scheduleIndicatorUpdate)
      resizeObserver.observe(optionsElement)
      optionsElement
        .querySelectorAll<HTMLElement>('.mk-radio-group__item')
        .forEach((item) => resizeObserver?.observe(item))
    }

    const setOptionsElement = (value: Element | ComponentPublicInstance | null) => {
      let element: unknown = value
      if (!(typeof Element !== 'undefined' && value instanceof Element)) {
        element = value && '$el' in value ? value.$el : undefined
      }

      optionsElement =
        typeof HTMLElement !== 'undefined' && element instanceof HTMLElement ? element : undefined
      observeOptions()
      scheduleIndicatorUpdate()
    }

    onMounted(() => {
      observeOptions()
      scheduleIndicatorUpdate()
    })
    onUpdated(() => {
      observeOptions()
      scheduleIndicatorUpdate()
    })
    onBeforeUnmount(() => {
      resizeObserver?.disconnect()
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
    })

    return () => {
      const radioGroupConfig = options.ui?.radioGroup
      const labelConfig = options.ui?.label
      const size = props.size ?? radioGroupConfig?.defaultVariants?.size ?? 'md'
      const variant = props.variant ?? radioGroupConfig?.defaultVariants?.variant ?? 'default'
      const orientation =
        props.orientation ?? radioGroupConfig?.defaultVariants?.orientation ?? 'vertical'
      indicatorEnabled = variant === 'segmented'
      const groupId = typeof attrs.id === 'string' ? attrs.id : generatedId
      const labelId = `${groupId}-label`
      const descriptionId = `${groupId}-description`
      const hasLabel = props.label !== undefined || slots.label !== undefined
      const hasDescription = props.description !== undefined || slots.description !== undefined
      const {
        class: className,
        style,
        'aria-describedby': ariaDescribedby,
        ...groupAttributes
      } = attrs as HTMLAttributes
      const describedBy = [ariaDescribedby, hasDescription ? descriptionId : undefined]
        .filter(Boolean)
        .join(' ')
      const hasExplicitAccessibleName = Boolean(
        groupAttributes['aria-label'] ?? groupAttributes['aria-labelledby'],
      )
      const sharedSlotOptions = {
        size,
        variant,
        orientation,
        config: radioGroupConfig,
        ui: props.ui,
      }
      const rootProps: Record<string, unknown> = {
        ...groupAttributes,
        ref: setOptionsElement,
        id: groupId,
        disabled: props.disabled,
        required: props.required,
        orientation,
        loop: props.loop,
        class: getRadioGroupSlotClasses({ slot: 'options', ...sharedSlotOptions }),
        'aria-labelledby':
          hasLabel && !hasExplicitAccessibleName ? labelId : groupAttributes['aria-labelledby'],
        'aria-describedby': describedBy || undefined,
        'onUpdate:modelValue': (value: unknown) => {
          if (isRadioGroupValue(value)) emit('update:modelValue', value)
          scheduleIndicatorUpdate()
        },
      }

      if (props.modelValue !== undefined) rootProps.modelValue = props.modelValue
      if (props.defaultValue !== undefined) rootProps.defaultValue = props.defaultValue
      if (props.name !== undefined) rootProps.name = props.name

      const header =
        hasLabel || hasDescription
          ? h(
              'div',
              {
                class: getRadioGroupSlotClasses({ slot: 'header', ...sharedSlotOptions }),
              },
              [
                hasLabel
                  ? h(
                      'span',
                      {
                        id: labelId,
                        class: getRadioGroupSlotClasses({ slot: 'label', ...sharedSlotOptions }),
                      },
                      [
                        slots.label?.({ label: props.label }) ?? props.label,
                        props.required
                          ? h(
                              'span',
                              {
                                'aria-hidden': 'true',
                                class: getLabelRequiredIndicatorClasses({ config: labelConfig }),
                              },
                              '*',
                            )
                          : undefined,
                      ],
                    )
                  : undefined,
                hasDescription
                  ? h(
                      'p',
                      {
                        id: descriptionId,
                        class: getRadioGroupSlotClasses({
                          slot: 'description',
                          ...sharedSlotOptions,
                        }),
                      },
                      slots.description?.({ description: props.description }) ?? props.description,
                    )
                  : undefined,
              ],
            )
          : undefined

      const group = h(RadioGroupRoot, rootProps, {
        default: ({ modelValue }: { modelValue: unknown }) =>
          props.items.map((item, index) => {
            const itemId = `${groupId}-${String(index)}`
            const itemLabelId = `${itemId}-label`
            const itemDescriptionId = `${itemId}-description`
            const disabled = props.disabled || item.disabled === true
            const checked = modelValue === item.value
            const slotProps: RadioGroupItemSlotProps = {
              item,
              index,
              checked,
              disabled,
              size,
            }
            const hasIcon = slots.icon !== undefined || item.icon !== undefined
            const hidesRadioIndicator = hasIcon || variant === 'segmented' || variant === 'pills'
            const itemSlotOptions = { ...sharedSlotOptions, icon: hasIcon }
            const itemProps: Record<string, unknown> = {
              id: itemId,
              value: item.value,
              class: getRadioGroupSlotClasses({ slot: 'control', ...itemSlotOptions }),
              'aria-labelledby': itemLabelId,
            }
            if (groupAttributes['aria-invalid'] !== undefined) {
              itemProps['aria-invalid'] = groupAttributes['aria-invalid']
            }
            if (item.disabled !== undefined) itemProps.disabled = item.disabled
            if (item.description) itemProps['aria-describedby'] = itemDescriptionId

            const control = h(
              RadioGroupItem,
              itemProps,
              hidesRadioIndicator
                ? undefined
                : {
                    default: () =>
                      h(
                        RadioGroupIndicator,
                        {
                          class: getRadioGroupSlotClasses({
                            slot: 'indicator',
                            ...itemSlotOptions,
                          }),
                        },
                        {
                          default: () => slots.indicator?.(slotProps),
                        },
                      ),
                  },
            )
            const icon = hasIcon
              ? h(
                  'span',
                  {
                    'aria-hidden': 'true',
                    class: getRadioGroupSlotClasses({ slot: 'icon', ...itemSlotOptions }),
                  },
                  slots.icon?.(slotProps) ?? (item.icon ? h(toRaw(item.icon)) : undefined),
                )
              : undefined
            const content = h(
              'span',
              {
                class: getRadioGroupSlotClasses({ slot: 'content', ...sharedSlotOptions }),
              },
              [
                h(
                  'span',
                  {
                    id: itemLabelId,
                    class: getRadioGroupSlotClasses({ slot: 'itemLabel', ...sharedSlotOptions }),
                  },
                  slots['item-label']?.(slotProps) ?? item.label,
                ),
                item.description
                  ? h(
                      'span',
                      {
                        id: itemDescriptionId,
                        class: getRadioGroupSlotClasses({
                          slot: 'itemDescription',
                          ...sharedSlotOptions,
                        }),
                      },
                      slots['item-description']?.(slotProps) ?? item.description,
                    )
                  : undefined,
              ],
            )

            return h(
              'label',
              {
                for: itemId,
                class: getRadioGroupSlotClasses({ slot: 'item', ...sharedSlotOptions }),
                'data-mk-disabled': disabled ? '' : undefined,
                'data-mk-checked': checked ? '' : undefined,
              },
              [control, icon, content],
            )
          }),
      })

      return h(
        'div',
        {
          class: getRadioGroupClasses({
            size,
            variant,
            orientation,
            config: radioGroupConfig,
            ui: props.ui,
            className,
          }),
          style,
          'data-mk-size': size,
          'data-mk-variant': variant,
          'data-mk-orientation': orientation,
          'data-mk-disabled': props.disabled ? '' : undefined,
        },
        [header, group],
      )
    }
  },
})
