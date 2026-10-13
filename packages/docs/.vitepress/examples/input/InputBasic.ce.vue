<script lang="ts">
import { inputSizes, inputVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkInput',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'outline',
      options: selectOptions(inputVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(inputSizes),
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

const email = ref('')
${scriptEnd}

<template>
  <MkLabel for="email" size="${String(values.size)}">Email address</MkLabel>
  <MkInput
    id="email"
    v-model="email"
    type="email"
    placeholder="name@example.com"
    variant="${String(values.variant)}"
    size="${String(values.size)}"
    :disabled="${String(values.disabled)}"
    :readonly="${String(values.readonly)}"
    :invalid="${String(values.invalid)}"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkInput, MkLabel } from '@modekit/vue'
import type { InputSize, InputVariant } from '@modekit/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    invalid?: boolean
    readonly?: boolean
    size?: InputSize
    variant?: InputVariant
  }>(),
  {
    disabled: false,
    invalid: false,
    readonly: false,
    size: 'md',
    variant: 'outline',
  },
)

const email = ref('')
</script>

<template>
  <div style="display: grid; width: min(100%, 24rem); gap: 0.5rem">
    <MkLabel for="email" :size="props.size">Email address</MkLabel>
    <MkInput
      id="email"
      v-model="email"
      :disabled="props.disabled"
      :invalid="props.invalid"
      placeholder="name@example.com"
      :readonly="props.readonly"
      :size="props.size"
      type="email"
      :variant="props.variant"
    />
  </div>
</template>
