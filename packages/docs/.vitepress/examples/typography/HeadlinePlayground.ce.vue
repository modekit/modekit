<script lang="ts">
import {
  headlineSizes,
  headlineVariants,
  typographyAlignments,
  typographyWeights,
} from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkHeadline',
  content: 'Build interfaces with a clear visual hierarchy',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(headlineVariants),
    },
    { prop: 'size', label: 'Size', defaultValue: 'lg', options: selectOptions(headlineSizes) },
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
      defaultValue: 'bold',
      options: selectOptions(typographyWeights),
    },
    {
      prop: 'align',
      label: 'Align',
      defaultValue: 'left',
      options: selectOptions(typographyAlignments),
    },
  ],
  code: (values) =>
    `<template>\n  <MkHeadline as="h2" variant="${String(values.variant)}" size="${String(values.size)}"${values.primary ? ' primary' : ''} weight="${String(values.weight)}" align="${String(values.align)}">\n    Build interfaces with a clear visual hierarchy\n  </MkHeadline>\n</template>`,
})
</script>
<script setup lang="ts">
import { MkHeadline } from '@modekit/vue'
import type { HeadlineSize, HeadlineVariant, TypographyAlign, TypographyWeight } from '@modekit/vue'
withDefaults(
  defineProps<{
    variant?: HeadlineVariant
    size?: HeadlineSize
    primary?: boolean
    weight?: TypographyWeight
    align?: TypographyAlign
  }>(),
  { variant: 'default', size: 'lg', primary: false, weight: 'bold', align: 'left' },
)
</script>
<template>
  <MkHeadline as="h2" :variant :size :primary :weight :align style="width: min(100%, 42rem)"
    >Build interfaces with a clear visual hierarchy</MkHeadline
  >
</template>
