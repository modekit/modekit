<script lang="ts">
import { textareaResizeModes, textareaSizes, textareaVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkTextarea',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'outline',
      options: selectOptions(textareaVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(textareaSizes),
    },
    {
      prop: 'resize',
      label: 'Resize',
      defaultValue: 'vertical',
      options: selectOptions(textareaResizeModes),
    },
    {
      prop: 'disabled',
      label: 'Disabled',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
    {
      prop: 'readonly',
      label: 'Readonly',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
    {
      prop: 'invalid',
      label: 'Invalid',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
  ],
  code: (values) => `<script setup lang="ts">
import { ref } from 'vue'

const summary = ref('')
${scriptEnd}

<template>
  <MkLabel for="summary" size="${String(values.size)}">Summary</MkLabel>
  <MkTextarea
    id="summary"
    v-model="summary"
    placeholder="Describe the change"
    :rows="4"
    variant="${String(values.variant)}"
    size="${String(values.size)}"
    resize="${String(values.resize)}"
    :disabled="${String(values.disabled)}"
    :readonly="${String(values.readonly)}"
    :invalid="${String(values.invalid)}"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkLabel, MkTextarea } from '@modekit/vue'
import type { TextareaResize, TextareaSize, TextareaVariant } from '@modekit/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    invalid?: boolean
    readonly?: boolean
    resize?: TextareaResize
    size?: TextareaSize
    variant?: TextareaVariant
  }>(),
  {
    disabled: false,
    invalid: false,
    readonly: false,
    resize: 'vertical',
    size: 'md',
    variant: 'outline',
  },
)

const summary = ref('')
</script>

<template>
  <div style="display: grid; width: min(100%, 28rem); gap: 0.5rem">
    <MkLabel for="textarea-summary" :size="props.size">Summary</MkLabel>
    <MkTextarea
      id="textarea-summary"
      v-model="summary"
      :disabled="props.disabled"
      :invalid="props.invalid"
      placeholder="Describe the change"
      :readonly="props.readonly"
      :resize="props.resize"
      :rows="4"
      :size="props.size"
      :variant="props.variant"
    />
  </div>
</template>
