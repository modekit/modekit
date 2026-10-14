<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSeparator',
  content: '',
  controls: [
    {
      prop: 'primary',
      label: 'Primary',
      defaultValue: false,
      options: [
        { label: 'false', value: false },
        { label: 'true', value: true },
      ],
    },
  ],
  code: (previewState) => `<template>
  <MkSeparator label="Featured"${previewState.primary ? ' primary' : ''} />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSeparator } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    primary?: boolean
  }>(),
  {
    primary: false,
  },
)
</script>

<template>
  <MkSeparator class="separator-preview" label="Featured" :primary="props.primary" />
</template>

<style>
.separator-preview {
  width: min(100%, 32rem);
}
</style>
