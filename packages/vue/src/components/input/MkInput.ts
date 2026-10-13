import { defineComponent, h, ref, useId } from 'vue'
import type { PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import type { ModeKitClassValue } from '../../types/classes.js'
import { MkSpinner } from '../spinner/MkSpinner.js'
import { getInputClasses, getInputSlotClasses } from './styles/index.js'
import { inputFloatingPositions, inputSizes, inputVariants } from './types.js'
import type {
  InputFloating,
  InputSize,
  InputSlots,
  InputUI,
  InputValue,
  InputVariant,
} from './types.js'

function callEventHandler(handler: unknown, event: Event): void {
  if (typeof handler === 'function') {
    const callback = handler as (event: Event) => void
    callback(event)
    return
  }

  if (Array.isArray(handler)) {
    for (const candidate of handler as unknown[]) callEventHandler(candidate, event)
  }
}

function hasInvalidState(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== 'false'
}

export const MkInput = defineComponent({
  name: 'MkInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number] as PropType<InputValue>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number] as PropType<InputValue>,
      default: undefined,
    },
    floating: {
      type: String as PropType<InputFloating>,
      default: undefined,
      validator: (value: InputFloating) => inputFloatingPositions.includes(value),
    },
    label: {
      type: String,
      default: undefined,
    },
    size: {
      type: String as PropType<InputSize>,
      default: undefined,
      validator: (value: InputSize) => inputSizes.includes(value),
    },
    variant: {
      type: String as PropType<InputVariant>,
      default: undefined,
      validator: (value: InputVariant) => inputVariants.includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    ui: {
      type: Object as PropType<InputUI>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': (value: unknown): value is string => typeof value === 'string',
  },
  slots: Object as SlotsType<InputSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()
    const generatedId = useId()
    const focused = ref(false)
    const uncontrolledValue = ref<InputValue | undefined>(props.defaultValue)

    return () => {
      const inputConfig = options.ui?.input
      const size = props.size ?? inputConfig?.defaultVariants?.size ?? 'md'
      const variant = props.variant ?? inputConfig?.defaultVariants?.variant ?? 'outline'
      const attributes: Record<string, unknown> = { ...attrs }
      const className = attributes.class as ModeKitClassValue
      const style = attributes.style
      const onInput = attributes.onInput
      const onFocus = attributes.onFocus
      const onBlur = attributes.onBlur
      const attributeValue = attributes.value
      const ariaInvalid = attributes['aria-invalid']
      const ariaBusy = attributes['aria-busy']
      const suppliedId = typeof attributes.id === 'string' ? attributes.id : undefined
      delete attributes.class
      delete attributes.style
      delete attributes.onInput
      delete attributes.onFocus
      delete attributes.onBlur
      delete attributes.value
      delete attributes['aria-invalid']
      delete attributes['aria-busy']

      const fallbackValue =
        typeof attributeValue === 'string' || typeof attributeValue === 'number'
          ? attributeValue
          : undefined
      const value = props.modelValue ?? uncontrolledValue.value ?? fallbackValue
      const hasLeading = props.loading || slots.leading !== undefined
      const hasFloatingLabel =
        props.floating !== undefined && (props.label !== undefined || slots.label !== undefined)
      const floating = hasFloatingLabel ? props.floating : undefined
      const hasTrailing = slots.trailing !== undefined
      const invalid = props.invalid || hasInvalidState(ariaInvalid)
      const floatingActive = hasFloatingLabel && (focused.value || String(value ?? '').length > 0)
      const controlId = suppliedId ?? (hasFloatingLabel ? generatedId : undefined)
      const slotProps = {
        size,
        variant,
        disabled: props.disabled,
        readonly: props.readonly,
        loading: props.loading,
      }
      const slotClassOptions = {
        size,
        leading: hasLeading,
        trailing: hasTrailing,
        floating,
        floatingActive,
        focused: focused.value,
        invalid,
        config: inputConfig,
        ui: props.ui,
      }

      const input = h('input', {
        ...attributes,
        id: controlId,
        value,
        class: getInputSlotClasses({ slot: 'input', ...slotClassOptions }),
        disabled: props.disabled,
        readonly: props.readonly,
        required: props.required,
        'aria-invalid': props.invalid ? 'true' : ariaInvalid,
        'aria-busy': props.loading ? 'true' : ariaBusy,
        onInput: (event: Event) => {
          const nextValue = (event.currentTarget as HTMLInputElement).value
          if (props.modelValue === undefined) uncontrolledValue.value = nextValue
          emit('update:modelValue', nextValue)
          callEventHandler(onInput, event)
        },
        onFocus: (event: FocusEvent) => {
          focused.value = true
          callEventHandler(onFocus, event)
        },
        onBlur: (event: FocusEvent) => {
          focused.value = false
          callEventHandler(onBlur, event)
        },
      })

      const children = [
        hasLeading
          ? h(
              'span',
              {
                class: getInputSlotClasses({ slot: 'leading', ...slotClassOptions }),
              },
              [
                props.loading
                  ? (slots.loader?.(slotProps) ??
                    h(MkSpinner, {
                      size,
                      'aria-hidden': 'true',
                      class: getInputSlotClasses({ slot: 'spinner', ...slotClassOptions }),
                    }))
                  : slots.leading?.(slotProps),
              ],
            )
          : undefined,
        input,
        hasFloatingLabel
          ? h(
              'label',
              {
                for: controlId,
                class: getInputSlotClasses({ slot: 'label', ...slotClassOptions }),
              },
              slots.label?.({ ...slotProps, label: props.label, floating: floating ?? 'border' }) ??
                props.label,
            )
          : undefined,
        hasTrailing
          ? h(
              'span',
              {
                class: getInputSlotClasses({ slot: 'trailing', ...slotClassOptions }),
              },
              [slots.trailing(slotProps)],
            )
          : undefined,
      ]

      return h(
        'div',
        {
          class: getInputClasses({
            size,
            variant,
            config: inputConfig,
            ui: props.ui,
            className,
          }),
          style,
          'data-mk-size': size,
          'data-mk-variant': variant,
          'data-mk-disabled': props.disabled ? '' : undefined,
          'data-mk-readonly': props.readonly ? '' : undefined,
          'data-mk-loading': props.loading ? '' : undefined,
          'data-mk-invalid': invalid ? '' : undefined,
          'data-mk-floating': floating,
          'data-mk-floating-active': floatingActive ? '' : undefined,
        },
        children,
      )
    }
  },
})
