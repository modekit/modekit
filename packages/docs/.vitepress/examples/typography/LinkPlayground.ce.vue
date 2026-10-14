<script lang="ts">
import { inlineTextSizes, linkVariants, typographyWeights } from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'
export const preview = definePreview({
  componentName: 'MkLink',
  content: 'Read the accessibility guidance',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'underline',
      options: selectOptions(linkVariants),
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
      defaultValue: 'medium',
      options: selectOptions(typographyWeights),
    },
  ],
  code: (values) =>
    `<template>\n  <MkLink href="#accessibility" variant="${String(values.variant)}"${values.primary ? ' primary' : ''} size="${String(values.size)}" weight="${String(values.weight)}">\n    Read the accessibility guidance\n  </MkLink>\n</template>`,
})
</script>
<script setup lang="ts">
import { MkLink } from '@modekit/vue'
import type { InlineTextSize, LinkVariant, TypographyWeight } from '@modekit/vue'
withDefaults(
  defineProps<{
    variant?: LinkVariant
    primary?: boolean
    size?: InlineTextSize
    weight?: TypographyWeight
  }>(),
  { variant: 'underline', primary: false, size: 'inherit', weight: 'medium' },
)
</script>
<template>
  <MkLink href="#accessibility" :variant :primary :size :weight
    >Read the accessibility guidance</MkLink
  >
</template>
