<script lang="ts">
import { hoverCardAlignments, hoverCardSides } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkHoverCard',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'side',
      label: 'Side',
      defaultValue: 'bottom',
      options: selectOptions(hoverCardSides),
    },
    {
      prop: 'align',
      label: 'Align',
      defaultValue: 'center',
      options: selectOptions(hoverCardAlignments),
    },
  ],
  code: (previewState) => `<template>
  <MkHoverCard side="${String(previewState.side)}" align="${String(previewState.align)}">
    <MkLink href="/projects/modekit">ModeKit</MkLink>

    <template #content>
      <MkText size="sm">Accessible Vue components with typed styling contracts.</MkText>
    </template>
  </MkHoverCard>
</template>`,
})
</script>

<script setup lang="ts">
import { MkHoverCard, MkLink, MkText } from '@modekit/vue'
import type { HoverCardAlign, HoverCardSide } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    side?: HoverCardSide
    align?: HoverCardAlign
  }>(),
  {
    side: 'bottom',
    align: 'center',
  },
)
</script>

<template>
  <MkHoverCard :side="props.side" :align="props.align" :portal="portalTarget">
    <MkLink href="/projects/modekit">ModeKit</MkLink>

    <template #content>
      <MkText size="sm">Accessible Vue components with typed styling contracts.</MkText>
    </template>
  </MkHoverCard>
</template>
