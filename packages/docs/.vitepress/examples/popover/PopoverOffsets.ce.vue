<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'sideOffset',
      label: 'Side offset',
      defaultValue: 8,
      options: [
        { label: '4', value: 4 },
        { label: '8', value: 8 },
        { label: '16', value: 16 },
      ],
    },
    {
      prop: 'alignOffset',
      label: 'Align offset',
      defaultValue: 0,
      options: [
        { label: '-16', value: -16 },
        { label: '0', value: 0 },
        { label: '16', value: 16 },
      ],
    },
  ],
  code: (previewState) => `<template>
  <MkPopover
    :side-offset="${String(previewState.sideOffset)}"
    :align-offset="${String(previewState.alignOffset)}"
  >
    <MkButton>Open popover</MkButton>

    <template #content>
      <MkText size="sm">Offset from the trigger and alignment anchor.</MkText>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkPopover, MkText } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    sideOffset?: number
    alignOffset?: number
  }>(),
  {
    sideOffset: 8,
    alignOffset: 0,
  },
)
</script>

<template>
  <MkPopover
    :side-offset="props.sideOffset"
    :align-offset="props.alignOffset"
    :portal="portalTarget"
  >
    <MkButton>Open popover</MkButton>

    <template #content>
      <MkText size="sm">Offset from the trigger and alignment anchor.</MkText>
    </template>
  </MkPopover>
</template>
