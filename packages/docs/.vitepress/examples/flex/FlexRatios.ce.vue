<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkFlex',
  content: '',
  controls: [],
  code: () => `<MkFlex gap="s">
  <MkFlex :flex="1">
    <MkCard variant="outline" size="sm">One part</MkCard>
  </MkFlex>
  <MkFlex :flex="2">
    <MkCard variant="outline" size="sm">Two parts</MkCard>
  </MkFlex>
</MkFlex>`,
})
</script>

<script setup lang="ts">
import { MkCard, MkFlex } from '@modekit/vue'
</script>

<template>
  <MkFlex class="flex-ratios" gap="s">
    <MkFlex :flex="1">
      <MkCard class="flex-ratios__card" variant="outline" size="sm">One part</MkCard>
    </MkFlex>
    <MkFlex :flex="2">
      <MkCard class="flex-ratios__card" variant="outline" size="sm">Two parts</MkCard>
    </MkFlex>
  </MkFlex>
</template>

<style>
.flex-ratios {
  width: min(100%, 32rem);
}

.flex-ratios__card {
  width: 100%;
  text-align: center;
}
</style>
