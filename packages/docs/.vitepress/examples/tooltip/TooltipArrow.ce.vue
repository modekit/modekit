<script lang="ts">
import { tooltipSides } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTooltip',
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
      defaultValue: 'top',
      options: selectOptions(tooltipSides),
    },
  ],
  code: (previewState) => `<template>
  <MkTooltip side="${String(previewState.side)}"${previewState.arrow ? ' arrow' : ''}>
    <MkButton>Hover or focus</MkButton>
    <template #content>Connected context</template>
  </MkTooltip>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkTooltip } from '@modekit/vue'
import type { TooltipSide } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    arrow?: boolean
    side?: TooltipSide
  }>(),
  {
    arrow: true,
    side: 'top',
  },
)
</script>

<template>
  <MkTooltip :arrow="props.arrow" :side="props.side" :portal="portalTarget">
    <MkButton>Hover or focus</MkButton>
    <template #content>Connected context</template>
  </MkTooltip>
</template>
