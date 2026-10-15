<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTooltip',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkTooltip>
    <MkButton>Hover or focus</MkButton>
    <template #content>Helpful context</template>
  </MkTooltip>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkTooltip } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkTooltip :portal="portalTarget">
    <MkButton>Hover or focus</MkButton>
    <template #content>Helpful context</template>
  </MkTooltip>
</template>
