<script setup lang="ts">
import { MkButton, MkText, useToast } from '@modekit/vue'
import { ref } from 'vue'

const toast = useToast()
const status = ref('')

function archive(): void {
  status.value = ''
  toast.add({
    title: 'Project archived',
    description: 'The project moved to your archive.',
    color: 'red',
    variant: 'soft',
    actions: [
      {
        label: 'Undo',
        altText: 'Undo archiving the project',
        onClick: () => {
          status.value = 'Project restored.'
        },
      },
      {
        label: 'View archive',
        altText: 'View archived projects',
        closeOnClick: false,
        onClick: () => {
          status.value = 'Archive selected.'
        },
      },
    ],
  })
}
</script>

<template>
  <div class="toast-action-preview">
    <MkButton @click="archive">Archive project</MkButton>
    <MkText v-if="status" size="sm">{{ status }}</MkText>
  </div>
</template>

<style scoped>
.toast-action-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
