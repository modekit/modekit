<script lang="ts">
import { popoverSides } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'arrow',
      label: 'Arrow',
      defaultValue: true,
      options: [
        { label: 'true', value: true },
        { label: 'false', value: false },
      ],
    },
    {
      prop: 'side',
      label: 'Side',
      defaultValue: 'bottom',
      options: selectOptions(popoverSides),
    },
  ],
  code: (previewState) => `<template>
  <MkPopover side="${String(previewState.side)}"${previewState.arrow ? ' arrow' : ''}>
    <MkButton>Open popover</MkButton>

    <template #content>
      <MkText size="sm">The arrow follows the resolved position.</MkText>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkPopover, MkText } from '@modekit/vue'
import type { PopoverSide } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    arrow?: boolean
    side?: PopoverSide
  }>(),
  {
    arrow: true,
    side: 'bottom',
  },
)
</script>

<template>
  <MkPopover :arrow="props.arrow" :side="props.side" :portal="portalTarget">
    <MkButton>Open popover</MkButton>

    <template #content>
      <MkText size="sm">The arrow follows the resolved position.</MkText>
    </template>
  </MkPopover>
</template>
