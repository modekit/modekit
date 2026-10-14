<script lang="ts">
import { ellipsisLines, textSizes } from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'
export const preview = definePreview({
  componentName: 'MkEllipsisText',
  content:
    'Long interface content stays within a predictable number of lines while the native title keeps the complete value available to users.',
  controls: [
    {
      prop: 'lines',
      label: 'Lines',
      defaultValue: 2,
      options: ellipsisLines.map((value) => ({ label: String(value), value })),
    },
    { prop: 'size', label: 'Size', defaultValue: 'md', options: selectOptions(textSizes) },
    {
      prop: 'primary',
      label: 'Primary',
      defaultValue: false,
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
  ],
  code: (values) =>
    `<template>\n  <MkEllipsisText :lines="${String(values.lines)}" size="${String(values.size)}"${values.primary ? ' primary' : ''} title="Long interface content stays within a predictable number of lines while the native title keeps the complete value available to users.">\n    Long interface content stays within a predictable number of lines while the native title keeps the complete value available to users.\n  </MkEllipsisText>\n</template>`,
})
</script>
<script setup lang="ts">
import { MkEllipsisText } from '@modekit/vue'
import type { EllipsisLines, TextSize } from '@modekit/vue'
withDefaults(defineProps<{ lines?: EllipsisLines; size?: TextSize; primary?: boolean }>(), {
  lines: 2,
  size: 'md',
  primary: false,
})
</script>
<template>
  <MkEllipsisText
    :lines
    :size
    :primary
    style="width: min(100%, 24rem)"
    title="Long interface content stays within a predictable number of lines while the native title keeps the complete value available to users."
    >Long interface content stays within a predictable number of lines while the native title keeps
    the complete value available to users.</MkEllipsisText
  >
</template>
