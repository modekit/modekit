<script lang="ts">
import { avatarColors, avatarGroupSpacings, avatarSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAvatarGroup',
  content: '',
  controls: [
    {
      prop: 'max',
      label: 'Visible',
      defaultValue: 3,
      options: [2, 3, 4, 5].map((value) => ({ label: String(value), value })),
    },
    {
      prop: 'overflowColor',
      label: 'Overflow color',
      defaultValue: 'neutral',
      options: selectOptions(avatarColors),
    },
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
    :max="${String(values.max)}"
    overflow-color="${String(values.overflowColor)}"
    size="${String(values.size)}"
    spacing="${String(values.spacing)}"
    aria-label="Team members"
  >
    <MkAvatar src="/avatar-demo.svg" alt="John Doe" fallback="JD" />
    <MkAvatar fallback="JS" color="primary" aria-label="Jane Smith" />
    <MkAvatar fallback="AB" color="sky" aria-label="Alice Brown" />
    <MkAvatar fallback="RL" color="amber" aria-label="Robert Lee" />
    <MkAvatar fallback="EW" color="green" aria-label="Emma Wilson" />
    <MkAvatar fallback="DM" color="red" aria-label="David Miller" />
  </MkAvatarGroup>
</template>`,
})
</script>

<script setup lang="ts">
import { MkAvatar, MkAvatarGroup } from '@modekit/vue'
import type { AvatarColor, AvatarGroupSpacing, AvatarSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    max?: number
    overflowColor?: AvatarColor
    size?: AvatarSize
    spacing?: AvatarGroupSpacing
  }>(),
  {
    max: 3,
    overflowColor: 'neutral',
    size: 'md',
    spacing: 'normal',
  },
)
</script>

<template>
  <MkAvatarGroup
    :max="props.max"
    :overflow-color="props.overflowColor"
    :size="props.size"
    :spacing="props.spacing"
    aria-label="Team members"
  >
    <MkAvatar src="/avatar-demo.svg" alt="John Doe" fallback="JD" />
    <MkAvatar fallback="JS" color="primary" aria-label="Jane Smith" />
    <MkAvatar fallback="AB" color="sky" aria-label="Alice Brown" />
    <MkAvatar fallback="RL" color="amber" aria-label="Robert Lee" />
    <MkAvatar fallback="EW" color="green" aria-label="Emma Wilson" />
    <MkAvatar fallback="DM" color="red" aria-label="David Miller" />
  </MkAvatarGroup>
</template>
