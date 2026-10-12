<script lang="ts">
import { buttonColors, buttonSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Button',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(buttonSizes),
    },
    {
      prop: 'color',
      label: 'Color',
      defaultValue: 'primary',
      options: selectOptions(buttonColors),
    },
  ],
})
</script>

<script setup lang="ts">
import { MkButton } from '@modekit/vue'
import type { ButtonColor, ButtonSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    size?: ButtonSize
  }>(),
  {
    color: 'primary',
    size: 'md',
  },
)
</script>

<template>
  <MkButton :color="props.color" :size="props.size">Button</MkButton>
</template>
