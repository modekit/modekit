<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSwitch',
  content: '',
  controls: [],
})
</script>

<script setup lang="ts">
import { MkGrid, MkSwitch } from '@modekit/vue'
import { ref } from 'vue'

const leftAligned = ref(true)
const rightAligned = ref(true)
</script>

<template>
  <MkGrid gap="l">
    <MkSwitch
      v-model="leftAligned"
      align="left"
      description="The control leads and the text follows."
      label="Switch on the left"
    />
    <MkSwitch
      v-model="rightAligned"
      align="right"
      description="The text leads and the control follows."
      label="Switch on the right"
      variant="card"
    />
  </MkGrid>
</template>
