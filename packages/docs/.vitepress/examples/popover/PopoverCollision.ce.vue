<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'avoidCollisions',
      label: 'Avoid collisions',
      defaultValue: true,
      options: [
        { label: 'true', value: true },
        { label: 'false', value: false },
      ],
    },
    {
      prop: 'collisionPadding',
      label: 'Collision padding',
      defaultValue: 8,
      options: [
        { label: '4', value: 4 },
        { label: '8', value: 8 },
        { label: '16', value: 16 },
      ],
    },
    {
      prop: 'hideWhenDetached',
      label: 'Hide when detached',
      defaultValue: false,
      options: [
        { label: 'false', value: false },
        { label: 'true', value: true },
      ],
    },
    {
      prop: 'positionStrategy',
      label: 'Position strategy',
      defaultValue: 'fixed',
      options: [
        { label: 'fixed', value: 'fixed' },
        { label: 'absolute', value: 'absolute' },
      ],
    },
  ],
  code: (previewState) => `<template>
  <MkPopover
    :avoid-collisions="${String(previewState.avoidCollisions)}"
    :collision-padding="${String(previewState.collisionPadding)}"
    :hide-when-detached="${String(previewState.hideWhenDetached)}"
    position-strategy="${String(previewState.positionStrategy)}"
  >
    <MkButton>Open popover</MkButton>

    <template #content>
      <MkText size="sm">Viewport-aware floating content.</MkText>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkPopover, MkText } from '@modekit/vue'
import type { PopoverPositionStrategy } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    avoidCollisions?: boolean
    collisionPadding?: number
    hideWhenDetached?: boolean
    positionStrategy?: PopoverPositionStrategy
  }>(),
  {
    avoidCollisions: true,
    collisionPadding: 8,
    hideWhenDetached: false,
    positionStrategy: 'fixed',
  },
)
</script>

<template>
  <MkPopover
    :avoid-collisions="props.avoidCollisions"
    :collision-padding="props.collisionPadding"
    :hide-when-detached="props.hideWhenDetached"
    :position-strategy="props.positionStrategy"
    :portal="portalTarget"
  >
    <MkButton>Open popover</MkButton>

    <template #content>
      <MkText size="sm">Viewport-aware floating content.</MkText>
    </template>
  </MkPopover>
</template>
