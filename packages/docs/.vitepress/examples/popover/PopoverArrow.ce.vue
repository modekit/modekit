<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
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
  ],
  code: (previewState) => `<template>
  <MkPopover${previewState.arrow ? ' arrow' : ''}>
    <MkButton variant="outline">Open popover</MkButton>

    <template #content>
      <MkText size="sm">The arrow follows the resolved position.</MkText>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkPopover, MkText } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    arrow?: boolean
  }>(),
  {
    arrow: true,
  },
)
</script>

<template>
  <MkPopover :arrow="props.arrow">
    <MkButton variant="outline">Open popover</MkButton>

    <template #content>
      <MkText size="sm">The arrow follows the resolved position.</MkText>
    </template>
  </MkPopover>
</template>
