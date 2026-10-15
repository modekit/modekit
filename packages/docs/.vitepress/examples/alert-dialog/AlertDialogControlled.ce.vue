<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAlertDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
<\x2Fscript>

<template>
  <MkButton @click="open = true">Reset settings</MkButton>
  <MkAlertDialog
    v-model:open="open"
    title="Reset all settings?"
    description="Your preferences return to their defaults."
    action-label="Reset settings"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkAlertDialog, MkButton } from '@modekit/vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const open = ref(false)
const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkButton @click="open = true">Reset settings</MkButton>
  <MkAlertDialog
    v-model:open="open"
    action-label="Reset settings"
    description="Your preferences return to their defaults."
    :portal="portalTarget"
    title="Reset all settings?"
  />
</template>
