<script lang="ts">
import { avatarGroupSpacings, avatarSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAvatarGroup',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(avatarSizes),
    },
    {
      prop: 'spacing',
      label: 'Spacing',
      defaultValue: 'normal',
      options: selectOptions(avatarGroupSpacings),
    },
  ],
  code: (values) => `<template>
  <MkAvatarGroup
    size="${String(values.size)}"
    spacing="${String(values.spacing)}"
    aria-label="Project members"
  >
    <MkAvatar src="/avatar-demo.svg" alt="John Doe" fallback="JD" />
    <MkAvatar fallback="JS" color="primary" aria-label="Jane Smith" />
    <MkAvatar fallback="AB" color="neutral" aria-label="Alice Brown" />
    <MkAvatar fallback="RL" color="primary" aria-label="Robert Lee" />
  </MkAvatarGroup>
</template>`,
})
</script>

<script setup lang="ts">
import { MkAvatar, MkAvatarGroup } from '@modekit/vue'
import type { AvatarGroupSpacing, AvatarSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    size?: AvatarSize
    spacing?: AvatarGroupSpacing
  }>(),
  {
    size: 'md',
    spacing: 'normal',
  },
)
</script>

<template>
  <MkAvatarGroup :size="props.size" :spacing="props.spacing" aria-label="Project members">
    <MkAvatar src="/avatar-demo.svg" alt="John Doe" fallback="JD" />
    <MkAvatar fallback="JS" color="primary" aria-label="Jane Smith" />
    <MkAvatar fallback="AB" color="neutral" aria-label="Alice Brown" />
    <MkAvatar fallback="RL" color="primary" aria-label="Robert Lee" />
  </MkAvatarGroup>
</template>
