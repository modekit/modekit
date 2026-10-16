import { defineComponent, h, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
import type { PropType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import type { ModeKitClassValue } from '../../types/classes.js'
import { getTextareaClasses, getTextareaControlClasses } from './styles/index.js'
import { textareaResizeModes, textareaSizes, textareaVariants } from './types.js'
import type {
  TextareaResize,
  TextareaSize,
  TextareaUI,
  TextareaValue,
  TextareaVariant,
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

export const MkTextarea = defineComponent({
  name: 'MkTextarea',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number] as PropType<TextareaValue>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number] as PropType<TextareaValue>,
      default: undefined,
    },
    size: {
      type: String as PropType<TextareaSize>,
      default: undefined,
      validator: (value: TextareaSize) => textareaSizes.includes(value),
    },
    variant: {
      type: String as PropType<TextareaVariant>,
      default: undefined,
      validator: (value: TextareaVariant) => textareaVariants.includes(value),
    },
    resize: {
      type: String as PropType<TextareaResize>,
      default: undefined,
      validator: (value: TextareaResize) => textareaResizeModes.includes(value),
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
    ui: {
      type: Object as PropType<TextareaUI>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': (value: unknown): value is string => typeof value === 'string',
  },
  setup(props, { attrs, emit }) {
    const options = useModeKitOptions()
    const uncontrolledValue = ref<TextareaValue | undefined>(props.defaultValue)
    const textareaElement = ref<HTMLTextAreaElement>()
    let formElement: HTMLFormElement | null = null
    let composing = false

    const getInitialValue = (): TextareaValue | undefined => {
      const attributeValue = attrs.value
      const fallbackValue =
        typeof attributeValue === 'string' || typeof attributeValue === 'number'
          ? attributeValue
          : undefined

      return props.defaultValue ?? fallbackValue
    }

    const handleFormReset = () => {
      if (props.modelValue === undefined) uncontrolledValue.value = getInitialValue()
    }

    const syncFormResetListener = () => {
      const nextFormElement = textareaElement.value?.form ?? null
      if (nextFormElement === formElement) return

      formElement?.removeEventListener('reset', handleFormReset)
      formElement = nextFormElement
      formElement?.addEventListener('reset', handleFormReset)
    }

    onMounted(syncFormResetListener)
    onUpdated(syncFormResetListener)
    onBeforeUnmount(() => {
      formElement?.removeEventListener('reset', handleFormReset)
    })

    return () => {
      const textareaConfig = options.ui?.textarea
      const size = props.size ?? textareaConfig?.defaultVariants?.size ?? 'md'
      const variant = props.variant ?? textareaConfig?.defaultVariants?.variant ?? 'outline'
      const resize = props.resize ?? textareaConfig?.defaultVariants?.resize ?? 'vertical'
      const attributes: Record<string, unknown> = { ...attrs }
      const className = attributes.class as ModeKitClassValue
      const style = attributes.style
      const onInput = attributes.onInput
      const onCompositionstart = attributes.onCompositionstart
      const onCompositionend = attributes.onCompositionend
      const attributeValue = attributes.value
      const ariaInvalid = attributes['aria-invalid']
      delete attributes.class
      delete attributes.style
      delete attributes.onInput
      delete attributes.onCompositionstart
      delete attributes.onCompositionend
      delete attributes.value
      delete attributes['aria-invalid']

      const fallbackValue =
        typeof attributeValue === 'string' || typeof attributeValue === 'number'
          ? attributeValue
          : undefined
      const value = props.modelValue ?? uncontrolledValue.value ?? fallbackValue
      const invalid = props.invalid || hasInvalidState(ariaInvalid)

      const textarea = h('textarea', {
        ...attributes,
        ref: textareaElement,
        value,
        class: getTextareaControlClasses({ size, resize, config: textareaConfig, ui: props.ui }),
        disabled: props.disabled,
        readonly: props.readonly,
        required: props.required,
        'aria-invalid': props.invalid ? 'true' : ariaInvalid,
        onInput: (event: Event) => {
          const inputEvent = event as InputEvent
          if (!composing && !inputEvent.isComposing) {
            const nextValue = (event.currentTarget as HTMLTextAreaElement).value
            if (props.modelValue === undefined) uncontrolledValue.value = nextValue
            emit('update:modelValue', nextValue)
          }
          callEventHandler(onInput, event)
        },
        onCompositionstart: (event: CompositionEvent) => {
          composing = true
          callEventHandler(onCompositionstart, event)
        },
        onCompositionend: (event: CompositionEvent) => {
          composing = false
          const nextValue = (event.currentTarget as HTMLTextAreaElement).value
          if (props.modelValue === undefined) uncontrolledValue.value = nextValue
          emit('update:modelValue', nextValue)
          callEventHandler(onCompositionend, event)
        },
      })

      return h(
        'div',
        {
          class: getTextareaClasses({
            size,
            variant,
            resize,
            config: textareaConfig,
            ui: props.ui,
            className,
          }),
          style,
          'data-mk-size': size,
          'data-mk-variant': variant,
          'data-mk-resize': resize,
          'data-mk-disabled': props.disabled ? '' : undefined,
          'data-mk-readonly': props.readonly ? '' : undefined,
          'data-mk-invalid': invalid ? '' : undefined,
        },
        textarea,
      )
    }
  },
})
