<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkToast',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import { useToast } from '@modekit/vue'

const toast = useToast()

function restoreProject() {}
function openArchive() {}

function archive() {
  toast.add({
    title: 'Project archived',
    description: 'The project moved to your archive.',
    color: 'red',
    variant: 'soft',
    actions: [
      {
        label: 'Undo',
        altText: 'Undo archiving the project',
        onClick: () => restoreProject()
      },
      {
        label: 'View archive',
        altText: 'View archived projects',
        closeOnClick: false,
        onClick: () => openArchive()
      }
    ]
  })
}
<\x2Fscript>

<template>
  <MkButton @click="archive">Archive project</MkButton>
</template>`,
})
</script>

<script setup lang="ts">
import { MkToastProvider } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'
import ToastActionTrigger from './ToastActionTrigger.vue'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkToastProvider :portal="portalTarget" position="bottom-right" swipe-direction="right">
    <ToastActionTrigger />
  </MkToastProvider>
</template>
