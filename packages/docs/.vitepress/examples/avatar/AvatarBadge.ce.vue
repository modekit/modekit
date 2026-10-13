<script lang="ts">
import { avatarBadgePositions, avatarSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAvatar',
  content: '',
  controls: [
    {
      prop: 'badgePosition',
      label: 'Badge position',
      defaultValue: 'bottom-right',
      options: selectOptions(avatarBadgePositions),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'lg',
      options: selectOptions(avatarSizes),
    },
  ],
  code: (values) => `<MkAvatar
  src="/avatar-demo.svg"
  alt="John Doe"
  fallback="JD"
  badge
  badge-position="${String(values.badgePosition)}"
  size="${String(values.size)}"
  aria-label="John Doe, online"
/>`,
})
</script>

<script setup lang="ts">
import { MkAvatar } from '@modekit/vue'
import type { AvatarBadgePosition, AvatarColor, AvatarSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    badgePosition?: AvatarBadgePosition
    badgeColor?: AvatarColor
    size?: AvatarSize
  }>(),
  {
    badgePosition: 'bottom-right',
    badgeColor: 'primary',
    size: 'lg',
  },
)
</script>

<template>
  <MkAvatar
    src="/avatar-demo.svg"
    alt="John Doe"
    fallback="JD"
    badge
    :badge-position="props.badgePosition"
    :badge-color="props.badgeColor"
    :size="props.size"
    aria-label="John Doe, online"
  />
</template>
