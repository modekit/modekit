<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTooltip',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'delayDuration',
      label: 'Delay',
      defaultValue: 300,
      options: [
        { label: '0 ms', value: 0 },
        { label: '300 ms', value: 300 },
        { label: '700 ms', value: 700 },
      ],
    },
    {
      prop: 'disabled',
      label: 'Disabled',
      defaultValue: false,
      options: [
        { label: 'false', value: false },
        { label: 'true', value: true },
      ],
    },
    {
      prop: 'disableHoverableContent',
      label: 'Hoverable content',
      defaultValue: false,
      options: [
        { label: 'true', value: false },
        { label: 'false', value: true },
      ],
    },
  ],
  code: (previewState) => `<template>
  <MkTooltip
    :delay-duration="${String(previewState.delayDuration)}"
    :disabled="${String(previewState.disabled)}"
    :disable-hoverable-content="${String(previewState.disableHoverableContent)}"
  >
    <MkButton>Hover or focus</MkButton>
    <template #content>Behavior-aware context</template>
  </MkTooltip>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkTooltip } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    delayDuration?: number
    disabled?: boolean
    disableHoverableContent?: boolean
  }>(),
  {
    delayDuration: 300,
    disabled: false,
    disableHoverableContent: false,
  },
)
</script>

<template>
  <MkTooltip
    :delay-duration="props.delayDuration"
    :disabled="props.disabled"
    :disable-hoverable-content="props.disableHoverableContent"
    :portal="portalTarget"
  >
    <MkButton>Hover or focus</MkButton>
    <template #content>Behavior-aware context</template>
  </MkTooltip>
</template>
