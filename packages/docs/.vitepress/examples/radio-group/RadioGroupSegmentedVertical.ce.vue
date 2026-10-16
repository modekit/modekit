<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkRadioGroup',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const density = ref('comfortable')
const densities = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
]
${scriptEnd}

<template>
  <MkRadioGroup
    v-model="density"
    :items="densities"
    label="Density"
    orientation="vertical"
    variant="segmented"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkRadioGroup } from '@modekit/vue'
import { ref } from 'vue'

const density = ref('comfortable')
const densities = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
]
</script>

<template>
  <MkRadioGroup
    v-model="density"
    :items="densities"
    label="Density"
    orientation="vertical"
    variant="segmented"
  />
</template>
