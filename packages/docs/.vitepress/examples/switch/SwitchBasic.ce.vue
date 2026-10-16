<script lang="ts">
import { switchAlignments, switchSizes, switchVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkSwitch',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(switchVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(switchSizes),
    },
    {
      prop: 'align',
      label: 'Control side',
      defaultValue: 'right',
      options: selectOptions(switchAlignments),
    },
    {
      prop: 'loading',
      label: 'Loading',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
    {
      prop: 'disabled',
      label: 'Disabled',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
  ],
  code: (values) => `<script setup lang="ts">
import { ref } from 'vue'

const enabled = ref(true)
${scriptEnd}

<template>
  <MkSwitch
    v-model="enabled"
    label="Email notifications"
    description="Receive important account and security updates."
    variant="${String(values.variant)}"
    size="${String(values.size)}"
    align="${String(values.align)}"
    :loading="${String(values.loading)}"
    :disabled="${String(values.disabled)}"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSwitch } from '@modekit/vue'
import type { SwitchAlignment, SwitchSize, SwitchVariant } from '@modekit/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    align?: SwitchAlignment
    disabled?: boolean
    loading?: boolean
    size?: SwitchSize
    variant?: SwitchVariant
  }>(),
  {
    align: 'right',
    disabled: false,
    loading: false,
    size: 'md',
    variant: 'default',
  },
)

const enabled = ref(true)
</script>

<template>
  <MkSwitch
    v-model="enabled"
    :align="props.align"
    description="Receive important account and security updates."
    :disabled="props.disabled"
    label="Email notifications"
    :loading="props.loading"
    :size="props.size"
    :variant="props.variant"
  />
</template>
