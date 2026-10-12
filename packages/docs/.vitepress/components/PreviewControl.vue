<script setup lang="ts">
import { computed } from 'vue'

import type { PreviewControl, PreviewControlValue } from './preview.js'

const props = defineProps<{
  id: string
  control: PreviewControl
  modelValue: PreviewControlValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PreviewControlValue]
}>()

const selectedOptionIndex = computed(() =>
  props.control.options.findIndex((option) => option.value === props.modelValue),
)

function updateValue(event: Event): void {
  const select = event.target as HTMLSelectElement
  const option = props.control.options[select.selectedIndex]

  if (option) {
    emit('update:modelValue', option.value)
  }
}
</script>

<template>
  <label class="mk-docs-preview-control" :for="id">
    <span class="mk-docs-preview-control__prop">{{ control.prop }}</span>
    <select
      :id="id"
      class="mk-docs-preview-control__select"
      :value="selectedOptionIndex"
      @change="updateValue"
    >
      <option v-for="(option, index) in control.options" :key="index" :value="index">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
