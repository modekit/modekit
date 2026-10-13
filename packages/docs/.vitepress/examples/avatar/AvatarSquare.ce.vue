<script lang="ts">
import { avatarSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAvatar',
  content: '',
  controls: [
    {
      prop: 'square',
      label: 'Square',
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
      options: selectOptions(avatarSizes),
    },
  ],
  code: (values) => `<MkAvatar
  fallback="JD"
  :square="${String(values.square)}"
  color="primary"
  size="${String(values.size)}"
  aria-label="John Doe"
/>`,
})
</script>

<script setup lang="ts">
import { MkAvatar } from '@modekit/vue'
import type { AvatarColor, AvatarSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: AvatarColor
    size?: AvatarSize
    square?: boolean
  }>(),
  {
    color: 'primary',
    size: 'md',
    square: true,
  },
)
</script>

<template>
  <MkAvatar
    fallback="JD"
    :square="props.square"
    :color="props.color"
    :size="props.size"
    aria-label="John Doe"
  />
</template>
