<script lang="ts">
import { avatarSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAvatar',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(avatarSizes),
    },
  ],
  code: (values) => `<template>
  <MkAvatar
    src="/avatar-demo.svg"
    alt="John Doe"
    fallback="JD"
    size="${String(values.size)}"
  />

  <MkAvatar fallback="JS" size="${String(values.size)}" aria-label="Jane Smith" />
</template>`,
})
</script>

<script setup lang="ts">
import { MkAvatar } from '@modekit/vue'
import type { AvatarSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    size?: AvatarSize
  }>(),
  {
    size: 'md',
  },
)
</script>

<template>
  <div style="display: flex; align-items: center; gap: 0.75rem">
    <MkAvatar src="/avatar-demo.svg" alt="John Doe" fallback="JD" :size="props.size" />
    <MkAvatar fallback="JS" :size="props.size" aria-label="Jane Smith" />
  </div>
</template>
