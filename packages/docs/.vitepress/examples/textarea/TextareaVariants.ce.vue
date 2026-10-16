<script lang="ts">
import { textareaVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTextarea',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'outline',
      options: selectOptions(textareaVariants),
    },
  ],
  code: (values) => `<MkTextarea
  aria-label="Project notes"
  default-value="Textarea keeps native editing and selection behavior."
  :rows="4"
  variant="${String(values.variant)}"
/>`,
})
</script>

<script setup lang="ts">
import { MkTextarea } from '@modekit/vue'
import type { TextareaVariant } from '@modekit/vue'

const props = withDefaults(defineProps<{ variant?: TextareaVariant }>(), {
  variant: 'outline',
})
</script>

<template>
  <div style="width: min(100%, 28rem)">
    <MkTextarea
      aria-label="Project notes"
      default-value="Textarea keeps native editing and selection behavior."
      :rows="4"
      :variant="props.variant"
    />
  </div>
</template>
