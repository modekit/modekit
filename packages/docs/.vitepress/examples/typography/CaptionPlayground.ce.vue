<script lang="ts">
import { captionSizes, captionVariants, typographyWeights } from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'
export const preview = definePreview({
  componentName: 'MkCaption',
  content: 'Updated a few moments ago',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(captionVariants),
    },
    { prop: 'size', label: 'Size', defaultValue: 'sm', options: selectOptions(captionSizes) },
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
      defaultValue: 'medium',
      options: selectOptions(typographyWeights),
    },
  ],
  code: (values) =>
    `<template>\n  <MkCaption variant="${String(values.variant)}" size="${String(values.size)}"${values.primary ? ' primary' : ''} weight="${String(values.weight)}">\n    Updated a few moments ago\n  </MkCaption>\n</template>`,
})
</script>
<script setup lang="ts">
import { MkCaption } from '@modekit/vue'
import type { CaptionSize, CaptionVariant, TypographyWeight } from '@modekit/vue'
withDefaults(
  defineProps<{
    variant?: CaptionVariant
    size?: CaptionSize
    primary?: boolean
    weight?: TypographyWeight
  }>(),
  { variant: 'default', size: 'sm', primary: false, weight: 'medium' },
)
</script>
<template>
  <MkCaption :variant :size :primary :weight>Updated a few moments ago</MkCaption>
</template>
