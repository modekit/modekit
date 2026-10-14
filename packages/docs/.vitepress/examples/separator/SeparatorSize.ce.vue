<script lang="ts">
import { separatorSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSeparator',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'sm',
      options: selectOptions(separatorSizes),
    },
  ],
  code: (previewState) => `<template>
  <MkSeparator label="Details" size="${String(previewState.size)}" />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSeparator } from '@modekit/vue'
import type { SeparatorSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    size?: SeparatorSize
  }>(),
  {
    size: 'sm',
  },
)
</script>

<template>
  <MkSeparator class="separator-preview" label="Details" :size="props.size" />
</template>

<style>
.separator-preview {
  width: min(100%, 32rem);
}
</style>
