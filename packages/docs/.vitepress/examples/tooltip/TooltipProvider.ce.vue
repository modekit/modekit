<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTooltipProvider',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkTooltipProvider :delay-duration="400" :skip-delay-duration="800">
    <MkFlex gap="s">
      <MkTooltip>
        <MkButton variant="outline">Cut</MkButton>
        <template #content>Remove the selection</template>
      </MkTooltip>
      <MkTooltip>
        <MkButton variant="outline">Copy</MkButton>
        <template #content>Copy the selection</template>
      </MkTooltip>
      <MkTooltip>
        <MkButton variant="outline">Paste</MkButton>
        <template #content>Insert clipboard content</template>
      </MkTooltip>
    </MkFlex>
  </MkTooltipProvider>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkFlex, MkTooltip, MkTooltipProvider } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkTooltipProvider :delay-duration="400" :skip-delay-duration="800">
    <MkFlex gap="s">
      <MkTooltip :portal="portalTarget">
        <MkButton variant="outline">Cut</MkButton>
        <template #content>Remove the selection</template>
      </MkTooltip>
      <MkTooltip :portal="portalTarget">
        <MkButton variant="outline">Copy</MkButton>
        <template #content>Copy the selection</template>
      </MkTooltip>
      <MkTooltip :portal="portalTarget">
        <MkButton variant="outline">Paste</MkButton>
        <template #content>Insert clipboard content</template>
      </MkTooltip>
    </MkFlex>
  </MkTooltipProvider>
</template>
