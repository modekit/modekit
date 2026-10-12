<script lang="ts">
import { buttonColors } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Button',
  controls: [
    {
      prop: 'disabled',
      label: 'Disabled',
      defaultValue: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
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
import type { ButtonColor } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    disabled?: boolean
  }>(),
  {
    color: 'primary',
    disabled: true,
  },
)
</script>

<template>
  <MkButton :color="props.color" :disabled="props.disabled">Button</MkButton>
</template>
