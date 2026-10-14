<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkGrid',
  content: '',
  controls: [],
  code: () => `<template>
  <MkGrid :min-col-width="180" gap="m">
    <MkCard v-for="item in items" :key="item" variant="outline" size="sm">
      {{ item }}
    </MkCard>
  </MkGrid>
</template>`,
})
</script>

<script setup lang="ts">
import { MkCard, MkGrid } from '@modekit/vue'

const items = ['Analytics', 'Customers', 'Revenue', 'Campaigns', 'Regions', 'Tasks']
</script>

<template>
  <MkGrid :min-col-width="180" gap="m" style="width: 100%">
    <MkCard v-for="item in items" :key="item" variant="outline" size="sm">
      {{ item }}
    </MkCard>
  </MkGrid>
</template>
