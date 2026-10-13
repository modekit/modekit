<script lang="ts">
import { badgeColors, badgeVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkBadge',
  content: 'Status',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(badgeVariants),
    },
    {
      prop: 'color',
      label: 'Color',
      defaultValue: 'primary',
      options: selectOptions(badgeColors),
    },
  ],
})
</script>

<script setup lang="ts">
import { MkBadge } from '@modekit/vue'
import type { BadgeColor, BadgeVariant } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: BadgeColor
    variant?: BadgeVariant
  }>(),
  {
    color: 'primary',
    variant: 'default',
  },
)
</script>

<template>
  <MkBadge :color="props.color" :variant="props.variant">Status</MkBadge>
</template>
