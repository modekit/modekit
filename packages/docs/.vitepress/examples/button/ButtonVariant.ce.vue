<script lang="ts">
import { buttonVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Button',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(buttonVariants),
    },
  ],
})
</script>

<script setup lang="ts">
import { MkButton } from '@modekit/vue'
import type { ButtonColor, ButtonVariant } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    variant?: ButtonVariant
  }>(),
  {
    color: 'primary',
    variant: 'default',
  },
)
</script>

<template>
  <MkButton :color="props.color" :variant="props.variant">Button</MkButton>
</template>
