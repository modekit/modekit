<script lang="ts">
import { spinnerSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSpinner',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(spinnerSizes),
    },
  ],
})
</script>

<script setup lang="ts">
import { MkSpinner } from '@modekit/vue'
import type { SpinnerSize } from '@modekit/vue'

withDefaults(
  defineProps<{
    size?: SpinnerSize
  }>(),
  {
    size: 'md',
  },
)
</script>

<template>
  <MkSpinner :size="size" />
</template>
