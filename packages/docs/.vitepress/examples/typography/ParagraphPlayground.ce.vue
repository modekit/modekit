<script lang="ts">
import { paragraphVariants, textSizes, typographyAlignments } from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'
export const preview = definePreview({
  componentName: 'MkParagraph',
  content:
    'Paragraph rhythm adapts to the selected size while preserving readable spacing and line length.',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(paragraphVariants),
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
      prop: 'align',
      label: 'Align',
      defaultValue: 'left',
      options: selectOptions(typographyAlignments),
    },
  ],
  code: (values) =>
    `<template>\n  <MkParagraph variant="${String(values.variant)}" size="${String(values.size)}"${values.primary ? ' primary' : ''} align="${String(values.align)}">\n    Paragraph rhythm adapts to the selected size while preserving readable spacing and line length.\n  </MkParagraph>\n</template>`,
})
</script>
<script setup lang="ts">
import { MkParagraph } from '@modekit/vue'
import type { ParagraphVariant, TextSize, TypographyAlign } from '@modekit/vue'
withDefaults(
  defineProps<{
    variant?: ParagraphVariant
    size?: TextSize
    primary?: boolean
    align?: TypographyAlign
  }>(),
  { variant: 'default', size: 'md', primary: false, align: 'left' },
)
</script>
<template>
  <MkParagraph :variant :size :primary :align style="width: min(100%, 42rem)"
    >Paragraph rhythm adapts to the selected size while preserving readable spacing and line
    length.</MkParagraph
  >
</template>
