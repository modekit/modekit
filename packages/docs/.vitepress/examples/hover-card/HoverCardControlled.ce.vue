<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkHoverCard',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
<\x2Fscript>

<template>
  <MkFlex align="center" gap="m">
    <MkButton size="sm" variant="outline" @click="open = !open">
      {{ open ? 'Close preview' : 'Open preview' }}
    </MkButton>

    <MkHoverCard v-model:open="open">
      <MkLink href="/teams/design">Design team</MkLink>
      <template #content>
        <MkText size="sm">12 members · 4 active projects</MkText>
      </template>
    </MkHoverCard>
  </MkFlex>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkFlex, MkHoverCard, MkLink, MkText } from '@modekit/vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const open = ref(false)
</script>

<template>
  <MkFlex align="center" gap="m">
    <MkButton size="sm" variant="outline" @click="open = !open">
      {{ open ? 'Close preview' : 'Open preview' }}
    </MkButton>

    <MkHoverCard v-model:open="open" :portal="portalTarget">
      <MkLink href="/teams/design">Design team</MkLink>
      <template #content>
        <MkText size="sm">12 members · 4 active projects</MkText>
      </template>
    </MkHoverCard>
  </MkFlex>
</template>
