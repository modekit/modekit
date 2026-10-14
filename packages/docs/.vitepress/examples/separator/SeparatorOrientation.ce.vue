<script lang="ts">
import { separatorOrientations } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSeparator',
  content: '',
  controls: [
    {
      prop: 'orientation',
      label: 'Orientation',
      defaultValue: 'horizontal',
      options: selectOptions(separatorOrientations),
    },
  ],
  code: (previewState) => `<template>
  <div style="height: 12rem">
    <MkSeparator label="Section" orientation="${String(previewState.orientation)}" />
  </div>
</template>`,
})
</script>

<script setup lang="ts">
import { MkSeparator } from '@modekit/vue'
import type { SeparatorOrientation } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    orientation?: SeparatorOrientation
  }>(),
  {
    orientation: 'horizontal',
  },
)
</script>

<template>
  <div
    class="separator-orientation-preview"
    :class="`separator-orientation-preview--${props.orientation}`"
  >
    <MkSeparator label="Section" :orientation="props.orientation" />
  </div>
</template>

<style>
.separator-orientation-preview {
  display: flex;
  width: min(100%, 32rem);
  min-height: 12rem;
  align-items: center;
  justify-content: center;
}

.separator-orientation-preview--vertical {
  height: 12rem;
}
</style>
