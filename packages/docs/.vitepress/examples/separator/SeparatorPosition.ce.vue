<script lang="ts">
import { separatorPositions } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSeparator',
  content: '',
  controls: [
    {
      prop: 'position',
      label: 'Position',
      defaultValue: 'center',
      options: selectOptions(separatorPositions),
    },
  ],
  code: (previewState) => `<template>
  <MkSeparator label="Chapter two" position="${String(previewState.position)}" />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSeparator } from '@modekit/vue'
import type { SeparatorPosition } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    position?: SeparatorPosition
  }>(),
  {
    position: 'center',
  },
)
</script>

<template>
  <MkSeparator class="separator-preview" label="Chapter two" :position="props.position" />
</template>

<style>
.separator-preview {
  width: min(100%, 32rem);
}
</style>
