<script lang="ts">
import { popoverAlignments, popoverSides } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  controls: [
    {
      prop: 'side',
      label: 'Side',
      defaultValue: 'bottom',
      options: selectOptions(popoverSides),
    },
    {
      prop: 'align',
      label: 'Align',
      defaultValue: 'center',
      options: selectOptions(popoverAlignments),
    },
  ],
  code: (previewState) => `<template>
  <MkPopover side="${String(previewState.side)}" align="${String(previewState.align)}">
    <MkButton variant="outline">Open popover</MkButton>

    <template #content>
      <MkText size="sm">Positioned content</MkText>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkPopover, MkText } from '@modekit/vue'
import type { PopoverAlign, PopoverSide } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    side?: PopoverSide
    align?: PopoverAlign
  }>(),
  {
    side: 'bottom',
    align: 'center',
  },
)
</script>

<template>
  <MkPopover :side="props.side" :align="props.align">
    <MkButton variant="outline">Open popover</MkButton>

    <template #content>
      <MkText size="sm">Positioned content</MkText>
    </template>
  </MkPopover>
</template>
