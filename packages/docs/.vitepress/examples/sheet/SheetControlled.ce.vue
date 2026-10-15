<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSheet',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const prevented = ref(0)
<\x2Fscript>

<template>
  <MkGrid gap="m" justify="center">
    <MkText size="sm">Prevented passive closes: {{ prevented }}</MkText>
    <MkButton @click="open = true">Open review sheet</MkButton>
  </MkGrid>

  <MkSheet
    v-model:open="open"
    :dismissible="false"
    title="Review changes"
    description="Swipe, Escape, and outside presses cannot abandon this review."
    @close-prevented="prevented++"
  >
    <template #content>
      <MkCallout color="amber" title="Explicit completion required">
        Confirm the pending changes before closing this sheet.
      </MkCallout>
    </template>
    <template #footer="{ close }">
      <MkButton @click="close">Review complete</MkButton>
    </template>
  </MkSheet>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkCallout, MkGrid, MkSheet, MkText } from '@modekit/vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const open = ref(false)
const prevented = ref(0)
const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkGrid gap="m" justify="center">
    <MkText size="sm">Prevented passive closes: {{ prevented }}</MkText>
    <MkButton @click="open = true">Open review sheet</MkButton>
  </MkGrid>

  <MkSheet
    v-model:open="open"
    description="Swipe, Escape, and outside presses cannot abandon this review."
    :dismissible="false"
    :portal="portalTarget"
    title="Review changes"
    @close-prevented="prevented++"
  >
    <template #content>
      <MkCallout color="amber" title="Explicit completion required">
        Confirm the pending changes before closing this sheet.
      </MkCallout>
    </template>
    <template #footer="{ close }">
      <MkButton @click="close">Review complete</MkButton>
    </template>
  </MkSheet>
</template>
