<script lang="ts">
import { labelSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkLabel',
  content: 'Email address',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(labelSizes),
    },
    {
      prop: 'required',
      label: 'Required',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
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
  ],
})
</script>

<script setup lang="ts">
import { MkLabel } from '@modekit/vue'
import type { LabelSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    required?: boolean
    size?: LabelSize
  }>(),
  {
    disabled: false,
    required: false,
    size: 'md',
  },
)
</script>

<template>
  <MkLabel :disabled="props.disabled" for="email" :required="props.required" :size="props.size">
    Email address
  </MkLabel>
</template>
