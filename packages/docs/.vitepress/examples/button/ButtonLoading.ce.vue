<script lang="ts">
import { buttonSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Saving',
  controls: [
    {
      prop: 'loading',
      label: 'Loading',
      defaultValue: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(buttonSizes),
    },
  ],
  code: (values) =>
    `<MkButton size="${String(values.size)}" :loading="${String(values.loading)}">Saving</MkButton>`,
})
</script>

<script setup lang="ts">
import { MkButton } from '@modekit/vue'
import type { ButtonColor, ButtonSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    loading?: boolean
    size?: ButtonSize
  }>(),
  {
    color: 'primary',
    loading: true,
    size: 'md',
  },
)
</script>

<template>
  <MkButton :color="props.color" :loading="props.loading" :size="props.size">Saving</MkButton>
</template>
