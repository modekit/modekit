<script lang="ts">
import { tooltipAlignments, tooltipSides } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTooltip',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'side',
      label: 'Side',
      defaultValue: 'top',
      options: selectOptions(tooltipSides),
    },
    {
      prop: 'align',
      label: 'Align',
      defaultValue: 'center',
      options: selectOptions(tooltipAlignments),
    },
  ],
  code: (previewState) => `<template>
  <MkTooltip side="${String(previewState.side)}" align="${String(previewState.align)}">
    <MkButton>Hover or focus</MkButton>
    <template #content>Positioned context</template>
  </MkTooltip>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkTooltip } from '@modekit/vue'
import type { TooltipAlign, TooltipSide } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    side?: TooltipSide
    align?: TooltipAlign
  }>(),
  {
    side: 'top',
    align: 'center',
  },
)
</script>

<template>
  <MkTooltip :side="props.side" :align="props.align" :portal="portalTarget">
    <MkButton>Hover or focus</MkButton>
    <template #content>Positioned context</template>
  </MkTooltip>
</template>
