<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkToast',
  content: '',
  controls: [],
  code: () => `<template>
  <MkToastProvider :portal="false" position="top-left">
    <MkToast color="blue" variant="solid" title="Solid notification" :duration="0">
      Strong emphasis for an important result.
    </MkToast>
    <MkToast color="red" variant="soft" title="Soft notification" :duration="0">
      A quieter semantic surface for supporting feedback.
    </MkToast>
    <MkToast color="green" variant="outline" title="Outline notification" :duration="0">
      A neutral surface with a semantic border.
    </MkToast>
  </MkToastProvider>
</template>`,
})
</script>

<script setup lang="ts">
import { MkToast, MkToastProvider } from '@modekit/vue'
</script>

<template>
  <div class="toast-variants-preview">
    <MkToastProvider :portal="false" position="top-left">
      <MkToast color="blue" variant="solid" title="Solid notification" :duration="0">
        Strong emphasis for an important result.
      </MkToast>
      <MkToast color="red" variant="soft" title="Soft notification" :duration="0">
        A quieter semantic surface for supporting feedback.
      </MkToast>
      <MkToast color="green" variant="outline" title="Outline notification" :duration="0">
        A neutral surface with a semantic border.
      </MkToast>
    </MkToastProvider>
  </div>
</template>

<style scoped>
.toast-variants-preview {
  width: min(100%, 32rem);
  min-height: 15rem;
}

.toast-variants-preview :deep(.mk-toast-viewport) {
  position: static;
  width: 100%;
  max-height: none;
  padding: 0;
  gap: 0.75rem;
}
</style>
