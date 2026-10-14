<script lang="ts">
import { textSizes, textVariants, typographyWeights } from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'
export const preview = definePreview({
  componentName: 'MkText',
  content: 'Labels, metadata, and inline copy share one controlled text scale.',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(textVariants),
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
    {
      prop: 'weight',
      label: 'Weight',
      defaultValue: 'normal',
      options: selectOptions(typographyWeights),
    },
  ],
  code: (values) =>
    `<template>\n  <MkText variant="${String(values.variant)}" size="${String(values.size)}"${values.primary ? ' primary' : ''} weight="${String(values.weight)}">\n    Labels, metadata, and inline copy share one controlled text scale.\n  </MkText>\n</template>`,
})
</script>
<script setup lang="ts">
import { MkText } from '@modekit/vue'
import type { TextSize, TextVariant, TypographyWeight } from '@modekit/vue'
withDefaults(
  defineProps<{
    variant?: TextVariant
    size?: TextSize
    primary?: boolean
    weight?: TypographyWeight
  }>(),
  { variant: 'default', size: 'md', primary: false, weight: 'normal' },
)
</script>
<template>
  <MkText :variant :size :primary :weight
    >Labels, metadata, and inline copy share one controlled text scale.</MkText
  >
</template>
