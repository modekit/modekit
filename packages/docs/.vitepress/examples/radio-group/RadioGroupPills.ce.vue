<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkRadioGroup',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const priority = ref('critical')
const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
]
${scriptEnd}

<template>
  <MkRadioGroup
    v-model="priority"
    :items="priorities"
    label="Priority"
    orientation="horizontal"
    variant="pills"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkRadioGroup } from '@modekit/vue'
import { ref } from 'vue'

const priority = ref('critical')
const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
]
</script>

<template>
  <MkRadioGroup
    v-model="priority"
    :items="priorities"
    label="Priority"
    orientation="horizontal"
    variant="pills"
  />
</template>
