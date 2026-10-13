<script lang="ts">
import { avatarColors, avatarSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAvatar',
  content: '<UserRound aria-hidden="true" />',
  controls: [
    {
      prop: 'color',
      label: 'Color',
      defaultValue: 'secondary',
      options: selectOptions(avatarColors),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(avatarSizes),
    },
  ],
  code: (values) =>
    [
      '<script setup lang="ts">',
      "import { UserRound } from '@lucide/vue'",
      '<' + '/script>',
      '',
      '<template>',
      `  <MkAvatar color="${String(values.color)}" size="${String(values.size)}" aria-label="Unassigned user">`,
      '    <UserRound aria-hidden="true" />',
      '  </MkAvatar>',
      '</template>',
    ].join('\n'),
})
</script>

<script setup lang="ts">
import { UserRound } from '@lucide/vue'
import { MkAvatar } from '@modekit/vue'
import type { AvatarColor, AvatarSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: AvatarColor
    size?: AvatarSize
  }>(),
  {
    color: 'secondary',
    size: 'md',
  },
)
</script>

<template>
  <MkAvatar :color="props.color" :size="props.size" aria-label="Unassigned user">
    <UserRound aria-hidden="true" />
  </MkAvatar>
</template>
