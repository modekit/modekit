<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkHoverCard',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkHoverCard :open-delay="150" :close-delay="500">
    <MkLink href="/releases/v2">Version 2.0</MkLink>

    <template #content>
      <MkText size="sm">Keep the card available while the pointer crosses into its content.</MkText>
    </template>
  </MkHoverCard>
</template>`,
})
</script>

<script setup lang="ts">
import { MkHoverCard, MkLink, MkText } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkHoverCard :open-delay="150" :close-delay="500" :portal="portalTarget">
    <MkLink href="/releases/v2">Version 2.0</MkLink>

    <template #content>
      <MkText size="sm">Keep the card available while the pointer crosses into its content.</MkText>
    </template>
  </MkHoverCard>
</template>
