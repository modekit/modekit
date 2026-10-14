<script lang="ts">
import { inlineTextSizes, markVariants, typographyWeights } from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'
export const preview = definePreview({
  componentName: 'MkMark',
  content: 'Intentional emphasis',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'soft',
      options: selectOptions(markVariants),
    },
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
      prop: 'size',
      label: 'Size',
      defaultValue: 'inherit',
      options: selectOptions(inlineTextSizes),
    },
    {
      prop: 'weight',
      label: 'Weight',
      defaultValue: 'inherit',
      options: selectOptions(typographyWeights),
    },
  ],
  code: (values) =>
    `<template>\n  <MkMark variant="${String(values.variant)}"${values.primary ? ' primary' : ''} size="${String(values.size)}" weight="${String(values.weight)}">\n    Intentional emphasis\n  </MkMark>\n</template>`,
})
</script>
<script setup lang="ts">
import { MkMark } from '@modekit/vue'
import type { InlineTextSize, MarkVariant, TypographyWeight } from '@modekit/vue'
withDefaults(
  defineProps<{
    variant?: MarkVariant
    primary?: boolean
    size?: InlineTextSize
    weight?: TypographyWeight
  }>(),
  { variant: 'soft', primary: false, size: 'inherit', weight: 'inherit' },
)
</script>
<template><MkMark :variant :primary :size :weight>Intentional emphasis</MkMark></template>
