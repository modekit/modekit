<script setup lang="ts">
import { CheckCircle2 } from '@lucide/vue'
import { MkButton, useToast } from '@modekit/vue'
import type { ToastColor, ToastVariant } from '@modekit/vue'
import { h, ref } from 'vue'

const props = defineProps<{
  color: ToastColor
  variant: ToastVariant
}>()

const toast = useToast()
const sequence = ref(0)

function addToast(title = 'Changes saved'): void {
  sequence.value += 1
  toast.add({
    title: sequence.value === 1 ? title : `${title} #${String(sequence.value)}`,
    description: 'Your workspace settings are up to date.',
    icon: () => h(CheckCircle2, { 'aria-hidden': 'true' }),
    color: props.color,
    variant: props.variant,
  })
}
</script>

<template>
  <MkButton @click="addToast()">Add toast</MkButton>
</template>
