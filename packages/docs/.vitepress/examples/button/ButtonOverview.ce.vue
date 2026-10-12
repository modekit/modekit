<script setup lang="ts">
import { MkButton } from '@modekit/vue'
</script>

<template>
  <div class="button-preview">
    <MkButton>Primary</MkButton>
    <MkButton variant="secondary">Secondary</MkButton>
    <MkButton variant="tertiary">Tertiary</MkButton>
    <MkButton variant="destructive">Destructive</MkButton>
    <MkButton disabled>Disabled</MkButton>
    <MkButton loading variant="secondary">
      <template #loader>
        <span class="button-preview__spinner" aria-hidden="true" />
      </template>
      Saving
    </MkButton>
  </div>
</template>

<style scoped>
.button-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.button-preview__spinner {
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-preview-spin 700ms linear infinite;
}

@keyframes button-preview-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .button-preview__spinner {
    animation: none;
  }
}
</style>
