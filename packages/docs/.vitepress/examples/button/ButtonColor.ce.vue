<script lang="ts">
import { buttonColors } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Button',
  controls: [
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
import type { ButtonColor } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
  }>(),
  {
    color: 'primary',
  },
)
</script>

<template>
  <MkButton :color="props.color">Button</MkButton>
</template>
