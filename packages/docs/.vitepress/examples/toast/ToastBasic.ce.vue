<script lang="ts">
import { toastColors, toastPositions, toastVariants } from '@modekit/vue'
import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkToast',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'color',
      label: 'Color',
      defaultValue: 'neutral',
      options: selectOptions(toastColors),
    },
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'solid',
      options: selectOptions(toastVariants),
    },
    {
      prop: 'position',
      label: 'Position',
      defaultValue: 'top-right',
      options: selectOptions(toastPositions),
    },
  ],
  code: (values) => `<script setup lang="ts">
import { CheckCircle2 } from '@lucide/vue'
import { useToast } from '@modekit/vue'
import { h } from 'vue'

const toast = useToast()

function showToast() {
  toast.add({
    title: 'Changes saved',
    description: 'Your workspace settings are up to date.',
    icon: () => h(CheckCircle2, { 'aria-hidden': 'true' }),
    color: '${String(values.color)}',
    variant: '${String(values.variant)}'
  })
}
${scriptEnd}

<template>
  <MkButton @click="showToast">Add toast</MkButton>
</template>`,
})
</script>

<script setup lang="ts">
import { MkToastProvider } from '@modekit/vue'
import type { ToastColor, ToastPosition, ToastVariant } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'
import ToastBasicTrigger from './ToastBasicTrigger.vue'

const props = withDefaults(
  defineProps<{
    color?: ToastColor
    position?: ToastPosition
    variant?: ToastVariant
  }>(),
  {
    color: 'neutral',
    position: 'top-right',
    variant: 'solid',
  },
)

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkToastProvider :portal="portalTarget" :position="props.position">
    <ToastBasicTrigger :color="props.color" :variant="props.variant" />
  </MkToastProvider>
</template>
