<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTooltip',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
<\x2Fscript>

<template>
  <MkFlex align="center" gap="s">
    <MkTooltip v-model:open="open">
      <MkButton>Hover or focus</MkButton>
      <template #content>Controlled context</template>
    </MkTooltip>
    <MkText size="sm">{{ open ? 'Open' : 'Closed' }}</MkText>
  </MkFlex>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkFlex, MkText, MkTooltip } from '@modekit/vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const open = ref(false)
const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkFlex align="center" gap="s">
    <MkTooltip v-model:open="open" :portal="portalTarget">
      <MkButton>Hover or focus</MkButton>
      <template #content>Controlled context</template>
    </MkTooltip>
    <MkText size="sm">{{ open ? 'Open' : 'Closed' }}</MkText>
  </MkFlex>
</template>
