<script lang="ts">
import { inputVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

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
  ],
  code: (values) => `<MkInput
  placeholder="Enter a value"
  variant="${String(values.variant)}"
/>`,
})
</script>

<script setup lang="ts">
import { MkInput } from '@modekit/vue'
import type { InputVariant } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    variant?: InputVariant
  }>(),
  {
    variant: 'outline',
  },
)
</script>

<template>
  <div style="width: min(100%, 28rem)">
    <MkInput placeholder="Enter a value" :variant="props.variant" />
  </div>
</template>
