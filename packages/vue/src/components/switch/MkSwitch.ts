import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { defineComponent, h, useId } from 'vue'
import type { ButtonHTMLAttributes, PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkLabel } from '../label/MkLabel.js'
import { getLabelRequiredIndicatorClasses } from '../label/styles/index.js'
import { MkSpinner } from '../spinner/MkSpinner.js'
import { getSwitchClasses, getSwitchSlotClasses } from './styles/index.js'
import { switchAlignments, switchSizes, switchVariants } from './types.js'
import type {
  SwitchAlignment,
  SwitchSize,
  SwitchSlots,
  SwitchThumbSlotProps,
  SwitchUI,
  SwitchVariant,
} from './types.js'

export const MkSwitch = defineComponent({
  name: 'MkSwitch',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: undefined,
    },
    defaultValue: {
      type: Boolean,
      default: undefined,
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
      type: String as PropType<SwitchSize>,
      default: undefined,
      validator: (value: SwitchSize) => switchSizes.includes(value),
    },
    variant: {
      type: String as PropType<SwitchVariant>,
      default: undefined,
      validator: (value: SwitchVariant) => switchVariants.includes(value),
    },
    align: {
      type: String as PropType<SwitchAlignment>,
      default: undefined,
      validator: (value: SwitchAlignment) => switchAlignments.includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
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
      type: String,
      default: 'on',
    },
    ui: {
      type: Object as PropType<SwitchUI>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': (value: unknown): value is boolean => typeof value === 'boolean',
  },
  slots: Object as SlotsType<SwitchSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()
    const generatedId = useId()

    return () => {
      const switchConfig = options.ui?.switch
      const labelConfig = options.ui?.label
      const size = props.size ?? switchConfig?.defaultVariants?.size ?? 'md'
      const variant = props.variant ?? switchConfig?.defaultVariants?.variant ?? 'default'
      const align = props.align ?? switchConfig?.defaultVariants?.align ?? 'right'
      const controlId = typeof attrs.id === 'string' ? attrs.id : generatedId
      const labelId = `${controlId}-label`
      const descriptionId = `${controlId}-description`
      const hasLabel = props.label !== undefined || slots.label !== undefined
      const hasDescription = props.description !== undefined || slots.description !== undefined
      const interactionDisabled = props.disabled || props.loading
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
        disabled: interactionDisabled,
        required: props.required,
        value: props.value,
        class: getSwitchSlotClasses({
          slot: 'control',
          size,
          variant,
          config: switchConfig,
          ui: props.ui,
        }),
        'aria-busy': props.loading ? 'true' : controlAttributes['aria-busy'],
        'aria-labelledby':
          hasLabel && !hasExplicitAccessibleName ? labelId : controlAttributes['aria-labelledby'],
        'aria-describedby': describedBy || undefined,
        'data-mk-loading': props.loading ? '' : undefined,
        'onUpdate:modelValue': (value: boolean) => {
          emit('update:modelValue', value)
        },
      }

      if (props.modelValue !== undefined) controlProps.modelValue = props.modelValue
      if (props.defaultValue !== undefined) controlProps.defaultValue = props.defaultValue
      if (props.name !== undefined) controlProps.name = props.name

      const rootProps = {
        class: getSwitchClasses({
          size,
          variant,
          align,
          config: switchConfig,
          ui: props.ui,
          className,
        }),
        style,
        'data-mk-size': size,
        'data-mk-variant': variant,
        'data-mk-align': align,
        'data-mk-disabled': props.disabled ? '' : undefined,
        'data-mk-loading': props.loading ? '' : undefined,
      }
      const content =
        hasLabel || hasDescription
          ? h(
              'div',
              {
                class: getSwitchSlotClasses({
                  slot: 'content',
                  size,
                  variant,
                  config: switchConfig,
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
                        class: getSwitchSlotClasses({
                          slot: 'label',
                          size,
                          variant,
                          config: switchConfig,
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
                        class: getSwitchSlotClasses({
                          slot: 'label',
                          size,
                          variant,
                          config: switchConfig,
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
                        class: getSwitchSlotClasses({
                          slot: 'description',
                          size,
                          variant,
                          config: switchConfig,
                          ui: props.ui,
                        }),
                        'data-disabled': props.disabled ? '' : undefined,
                      },
                      slots.description?.({ description: props.description }) ?? props.description,
                    )
                  : undefined,
              ],
            )
          : undefined
      const control = h(SwitchRoot, controlProps, {
        default: ({ checked, modelValue }: { checked: boolean; modelValue: boolean }) => {
          const slotProps: SwitchThumbSlotProps = {
            checked,
            modelValue,
            loading: props.loading,
            disabled: props.disabled,
            size,
          }
          let thumbContent

          if (props.loading) {
            thumbContent = h(
              'span',
              {
                'aria-hidden': 'true',
                class: getSwitchSlotClasses({
                  slot: 'loader',
                  size,
                  variant,
                  config: switchConfig,
                  ui: props.ui,
                }),
              },
              slots.loader?.(slotProps) ??
                h(MkSpinner, { class: 'mk:size-full', 'aria-hidden': 'true' }),
            )
          } else if (slots.thumb) {
            thumbContent = slots.thumb(slotProps)
          } else {
            const stateIcon = checked ? slots['checked-icon'] : slots['unchecked-icon']
            thumbContent = stateIcon
              ? h(
                  'span',
                  {
                    'aria-hidden': 'true',
                    class: getSwitchSlotClasses({
                      slot: 'icon',
                      size,
                      variant,
                      config: switchConfig,
                      ui: props.ui,
                    }),
                  },
                  [stateIcon(slotProps)],
                )
              : undefined
          }

          return h(
            SwitchThumb,
            {
              class: getSwitchSlotClasses({
                slot: 'thumb',
                size,
                variant,
                config: switchConfig,
                ui: props.ui,
              }),
            },
            { default: () => thumbContent },
          )
        },
      })
      const children = [content, control]

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
