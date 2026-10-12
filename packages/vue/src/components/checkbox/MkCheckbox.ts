import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { defineComponent, h, useId } from 'vue'
import type { ButtonHTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkLabel } from '../label/MkLabel.js'
import { getLabelRequiredIndicatorClasses } from '../label/styles/index.js'
import { getCheckboxClasses, getCheckboxSlotClasses } from './styles/index.js'
import { checkboxSizes, checkboxVariants } from './types.js'
import type {
  CheckboxSize,
  CheckboxSlots,
  CheckboxState,
  CheckboxUI,
  CheckboxVariant,
} from './types.js'

function renderIndicatorIcon(state: CheckboxState, className: string): VNodeChild {
  const path =
    state === 'indeterminate' ? h('path', { d: 'M3 8h10' }) : h('path', { d: 'm3 8 3 3 7-7' })

  return h(
    'svg',
    {
      'aria-hidden': 'true',
      class: className,
      fill: 'none',
      viewBox: '0 0 16 16',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
    },
    [path],
  )
}

export const MkCheckbox = defineComponent({
  name: 'MkCheckbox',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Boolean, String] as PropType<CheckboxState>,
      default: undefined,
      validator: (value: unknown): value is CheckboxState =>
        typeof value === 'boolean' || value === 'indeterminate',
    },
    defaultValue: {
      type: [Boolean, String] as PropType<CheckboxState>,
      default: undefined,
      validator: (value: unknown): value is CheckboxState =>
        typeof value === 'boolean' || value === 'indeterminate',
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
      type: String as PropType<CheckboxSize>,
      default: undefined,
      validator: (value: CheckboxSize) => checkboxSizes.includes(value),
    },
    variant: {
      type: String as PropType<CheckboxVariant>,
      default: undefined,
      validator: (value: CheckboxVariant) => checkboxVariants.includes(value),
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
    value: {
      type: [String, Number],
      default: 'on',
    },
    ui: {
      type: Object as PropType<CheckboxUI>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': (value: unknown): value is CheckboxState =>
      typeof value === 'boolean' || value === 'indeterminate',
  },
  slots: Object as SlotsType<CheckboxSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()
    const generatedId = useId()

    return () => {
      const checkboxConfig = options.ui?.checkbox
      const labelConfig = options.ui?.label
      const size = props.size ?? checkboxConfig?.defaultVariants?.size ?? 'md'
      const variant = props.variant ?? checkboxConfig?.defaultVariants?.variant ?? 'default'
      const controlId = typeof attrs.id === 'string' ? attrs.id : generatedId
      const labelId = `${controlId}-label`
      const descriptionId = `${controlId}-description`
      const hasLabel = props.label !== undefined || slots.label !== undefined
      const hasDescription = props.description !== undefined || slots.description !== undefined
      const {
        class: className,
        style,
        'aria-describedby': ariaDescribedby,
      } = attrs as ButtonHTMLAttributes
      const controlAttributes: Record<string, unknown> = { ...attrs }
      delete controlAttributes.class
      delete controlAttributes.style
      delete controlAttributes.id
      delete controlAttributes['aria-describedby']
      const describedBy = [ariaDescribedby, hasDescription ? descriptionId : undefined]
        .filter(Boolean)
        .join(' ')
      const hasExplicitAccessibleName = Boolean(
        controlAttributes['aria-label'] ?? controlAttributes['aria-labelledby'],
      )
      const controlProps: Record<string, unknown> = {
        ...controlAttributes,
        id: controlId,
        disabled: props.disabled,
        required: props.required,
        value: props.value,
        class: getCheckboxSlotClasses({
          slot: 'control',
          size,
          variant,
          config: checkboxConfig,
          ui: props.ui,
        }),
        'aria-labelledby':
          hasLabel && !hasExplicitAccessibleName ? labelId : controlAttributes['aria-labelledby'],
        'aria-describedby': describedBy || undefined,
        'onUpdate:modelValue': (value: CheckboxState) => {
          emit('update:modelValue', value)
        },
      }

      if (props.modelValue !== undefined) controlProps.modelValue = props.modelValue
      if (props.defaultValue !== undefined) controlProps.defaultValue = props.defaultValue
      if (props.name !== undefined) controlProps.name = props.name

      const rootProps = {
        class: getCheckboxClasses({
          size,
          variant,
          config: checkboxConfig,
          ui: props.ui,
          className,
        }),
        style,
        'data-mk-size': size,
        'data-mk-variant': variant,
        'data-mk-disabled': props.disabled ? '' : undefined,
      }
      const children = [
        h(CheckboxRoot, controlProps, {
          default: ({ state }: { state: CheckboxState }) =>
            h(
              CheckboxIndicator,
              {
                class: getCheckboxSlotClasses({
                  slot: 'indicator',
                  size,
                  variant,
                  config: checkboxConfig,
                  ui: props.ui,
                }),
              },
              {
                default: () =>
                  slots.indicator?.({ state }) ??
                  renderIndicatorIcon(
                    state,
                    getCheckboxSlotClasses({
                      slot: 'icon',
                      size,
                      variant,
                      config: checkboxConfig,
                      ui: props.ui,
                    }),
                  ),
              },
            ),
        }),
        hasLabel || hasDescription
          ? h(
              'div',
              {
                class: getCheckboxSlotClasses({
                  slot: 'content',
                  size,
                  variant,
                  config: checkboxConfig,
                  ui: props.ui,
                }),
              },
              [
                hasLabel && variant === 'default'
                  ? h(
                      MkLabel,
                      {
                        id: labelId,
                        for: controlId,
                        size,
                        required: props.required,
                        disabled: props.disabled,
                        class: getCheckboxSlotClasses({
                          slot: 'label',
                          size,
                          variant,
                          config: checkboxConfig,
                          ui: props.ui,
                        }),
                      },
                      {
                        default: () => slots.label?.({ label: props.label }) ?? props.label,
                      },
                    )
                  : undefined,
                hasLabel && variant === 'card'
                  ? h(
                      'span',
                      {
                        id: labelId,
                        class: getCheckboxSlotClasses({
                          slot: 'label',
                          size,
                          variant,
                          config: checkboxConfig,
                          ui: props.ui,
                        }),
                      },
                      [
                        slots.label?.({ label: props.label }) ?? props.label,
                        props.required
                          ? h(
                              'span',
                              {
                                'aria-hidden': 'true',
                                class: getLabelRequiredIndicatorClasses({
                                  config: labelConfig,
                                }),
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
                        class: getCheckboxSlotClasses({
                          slot: 'description',
                          size,
                          variant,
                          config: checkboxConfig,
                          ui: props.ui,
                        }),
                        'data-disabled': props.disabled ? '' : undefined,
                      },
                      slots.description?.({ description: props.description }) ?? props.description,
                    )
                  : undefined,
              ],
            )
          : undefined,
      ]

      if (variant === 'card') {
        return h(
          MkLabel,
          {
            ...rootProps,
            for: controlId,
            size,
            disabled: props.disabled,
          },
          { default: () => children },
        )
      }

      return h('div', rootProps, children)
    }
  },
})
