<script lang="ts">
import { separatorTypes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSeparator',
  content: '',
  controls: [
    {
      prop: 'type',
      label: 'Type',
      defaultValue: 'solid',
      options: selectOptions(separatorTypes),
    },
  ],
  code: (previewState) => `<template>
  <MkSeparator label="Workspace" type="${String(previewState.type)}" />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSeparator } from '@modekit/vue'
import type { SeparatorType } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    type?: SeparatorType
  }>(),
  {
    type: 'solid',
  },
)
</script>

<template>
  <MkSeparator class="separator-preview" label="Workspace" :type="props.type" />
</template>

<style>
.separator-preview {
  width: min(100%, 32rem);
}
</style>
