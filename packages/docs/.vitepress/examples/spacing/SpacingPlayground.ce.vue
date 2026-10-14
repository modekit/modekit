<script lang="ts">
import { spacingOrientations, spacingSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSpacing',
  content: '',
  controls: [
    {
      prop: 'orientation',
      label: 'orientation',
      defaultValue: 'vertical',
      options: selectOptions(spacingOrientations),
    },
    {
      prop: 'size',
      label: 'size',
      defaultValue: 'm',
      options: selectOptions(spacingSizes),
    },
  ],
  code: (previewState) => `<template>
  <div style="display: flex; flex-direction: ${previewState.orientation === 'horizontal' ? 'row' : 'column'}">
    <MkCard variant="outline" size="sm">Content before</MkCard>
    <MkSpacing orientation="${String(previewState.orientation)}" size="${String(previewState.size)}" />
    <MkCard variant="outline" size="sm">Content after</MkCard>
  </div>
</template>`,
})
</script>

<script setup lang="ts">
import { MkCard, MkSpacing, type SpacingOrientation, type SpacingSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    orientation?: SpacingOrientation
    size?: SpacingSize
  }>(),
  {
    orientation: 'vertical',
    size: 'm',
  },
)
</script>

<template>
  <div class="spacing-preview" :class="`spacing-preview--${props.orientation}`">
    <MkCard variant="outline" size="sm">Content before</MkCard>
    <MkSpacing :orientation="props.orientation" :size="props.size" />
    <MkCard variant="outline" size="sm">Content after</MkCard>
  </div>
</template>

<style>
.spacing-preview {
  display: flex;
  width: min(100%, 28rem);
}

.spacing-preview--vertical {
  flex-direction: column;
}

.spacing-preview--horizontal {
  align-items: center;
  flex-direction: row;
}

.spacing-preview--horizontal > .mk-card {
  flex: 0 0 auto;
}
</style>
